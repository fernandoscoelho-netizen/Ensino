"""
CTE Online · construção dos dados editáveis a partir da planta em PDF.

Lê a planta vetorial (orientação da folha: entrada em cima), extrai o mobiliário
pelas cores da legenda, junta a interpretação da arquitetura (medida à escala
1:100 nas linhas do desenho) e grava dados/cte-planta.json.

Convenções:
  - unidade: metro; origem no canto exterior superior esquerdo do bloco principal
  - x cresce para a direita da folha, y cresce para baixo da folha
  - "superior/inferior/esquerda/direita" referem-se à folha, não a pontos cardeais

Proveniência de cada valor (campo "origem"):
  medido      linha/forma do PDF medida à escala 1:100
  cota        valor escrito na planta ou na legenda
  observado   elemento presente no desenho, posição medida
  interpretado leitura do desenho com alguma ambiguidade (explicada em "nota")
  estimado    a planta não define o valor; valor de trabalho editável
  ficcional   objeto ou efeito acrescentado para o jogo
  proposta    função pedagógica sugerida, não confirmada
"""
import json, math, sys, os, collections, datetime
import numpy as np
import pymupdf

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(BASE, 'dados', 'planta-referencia.pdf')
OUT = os.path.join(BASE, 'dados', 'cte-planta.json')
REF = os.path.join(BASE, 'dados', 'planta-referencia.jpg')

O = (201.7, 151.6)          # canto exterior superior esquerdo do bloco (pt, folha rodada)
K = 72 / 25.4 * 10          # 1 m à escala 1:100 = 10 mm no papel = 28.3465 pt
R2 = lambda v: round(float(v), 3)

doc = pymupdf.open(PDF)
pg = doc[0]
ROT = pg.rotation_matrix
def m(p):
    q = p * ROT
    return (R2((q.x - O[0]) / K), R2((q.y - O[1]) / K))
def mr(r):
    a = m(pymupdf.Point(r.x0, r.y0)); b = m(pymupdf.Point(r.x1, r.y1))
    return [min(a[0], b[0]), min(a[1], b[1]), max(a[0], b[0]), max(a[1], b[1])]

# ------------------------------------------------------------------
# 1. Legenda (lida na folha; cores do desenho)
# ------------------------------------------------------------------
LEGENDA = {
    (1.0, 0.0, 1.0):   dict(cod='CALLERO DUPLO GRATNELLS SSET13', tipo='carro', desc='Carro duplo de tabuleiros (Gratnells SSET13)', alt=None),
    (0.75, 0.5, 1.0):  dict(cod='E32CPLUS', tipo='carregador', desc='Carro de carregamento EU Aver E32C (32 dispositivos)', alt=None),
    (0.0, 0.72, 0.72): dict(cod='RSET 01 Rover', tipo='rover', desc='Rover com 3 tabuleiros F25', alt=None),
    (0.0, 0.72, 0.0):  dict(cod='PROMETHEAN 86"', tipo='ecra', desc='Ecrã interativo Promethean 86"', alt=None),
    (0.0, 0.0, 1.0):   dict(cod='B1800900', tipo='bancada_armario', desc='Bancada 1800×750×900 mm com blocos elétricos e armário de 4 portas', alt=0.90),
    (0.0, 1.0, 0.0):   dict(cod='VTR 750 D', tipo='mesa', desc='Mesa Verd 750×700×750 mm', alt=0.75),
    (0.36, 0.72, 0.0): dict(cod='VTR F16 70', tipo='mesa', desc='Mesa Verd 1600×700×740 mm', alt=0.74),
    (0.36, 0.29, 0.59): dict(cod='VTS 140 70R', tipo='mesa_professor', desc='Mesa Verd 1400×700×750 mm com púlpito à direita', alt=0.75),
    (0.72, 0.36, 0.63): dict(cod='BT11200900-SCPU', tipo='bancada_tecnica', desc='Bancada técnica 1200×750×900 mm, suporte para monitor', alt=0.90),
    (0.87, 0.43, 0.0): dict(cod='BT11200900-SBGCPU', tipo='bancada_tecnica', desc='Bancada técnica 1200×750×900 mm, prateleira superior com iluminação, suporte para monitor', alt=0.90),
    (0.0, 1.0, 1.0):   dict(cod='N3L TDD 41D', tipo='mesa_redonda', desc='Mesa para professor, altura 1050 mm, diâmetro 600 mm', alt=1.05),
    (1.0, 0.5, 0.0):   dict(cod='VTR 140 50', tipo='mesa', desc='Mesa Verd 1400×500×750 mm', alt=0.75),
    (0.14, 0.59, 0.0): dict(cod='N4M 109 5N0', tipo='bancada_alta', desc='FrameFour Bench 3222×1200×1050 mm', alt=1.05),
    (0.0, 0.36, 0.72): dict(cod='N4M 109 5H0', tipo='bancada_alta', desc='FrameFour Bench 2400×1200×1050 mm', alt=1.05),
    (0.59, 0.0, 0.59): dict(cod='GAC100', tipo='bancada_rodada', desc='Bancada Actiflex 1500×900×780 mm', alt=0.78),
    (0.59, 0.29, 0.44): dict(cod='N3L T50 030', tipo='mesa', desc='Mesa B-Free 1600×600×780 mm', alt=0.78),
    (0.72, 0.72, 0.0): dict(cod='AAC115', tipo='armario_curvo', desc='Armário curvo Actiflex Wave', alt=None),
    (0.72, 0.36, 0.36): dict(cod='MESA DIAMOND', tipo='mesa_diamond', desc='Mesa Diamond (conjunto hexagonal)', alt=None),
}
ALT_EST = {'carro': 0.90, 'carregador': 1.00, 'rover': 0.90, 'armario_curvo': 0.80, 'mesa_diamond': 0.75}

ESPACOS = [
    # id, nome, tipo, rects, nome_origem
    ('entrada', 'Entrada', 'circulacao', [[11.63, -3.52, 14.89, 0.0]], 'texto da planta'),
    ('corredor', 'Corredor', 'circulacao', [[11.66, 0.515, 14.83, 6.29]], 'nome atribuído'),
    ('atrio', 'Átrio', 'circulacao', [[8.04, 6.29, 14.83, 9.72]], 'nome atribuído'),
    ('passagem_esq', 'Passagem esquerda', 'circulacao', [[8.04, 9.72, 9.51, 16.14]], 'nome atribuído'),
    ('passagem_dir', 'Passagem direita', 'circulacao', [[13.21, 9.72, 14.83, 14.53]], 'nome atribuído'),
    ('sala_e6', 'Sala E6', 'sala', [[0.83, 0.515, 7.64, 7.31]], 'texto da planta'),
    ('sala_e5', 'Sala E5', 'sala', [[0.83, 7.72, 7.64, 14.53]], 'texto da planta'),
    ('sala_e4', 'Sala E4', 'sala', [[0.83, 14.95, 7.64, 21.76]], 'texto da planta'),
    ('sala_e1', 'Sala E1', 'sala', [[15.26, 0.515, 22.07, 7.31]], 'texto da planta'),
    ('sala_e2', 'Sala E2', 'sala', [[15.26, 7.72, 22.07, 14.53]], 'texto da planta'),
    ('sala_e3', 'Sala E3', 'sala', [[13.38, 14.95, 22.07, 21.76], [11.66, 16.35, 13.38, 21.76]], 'texto da planta'),
    ('lab_e61', 'Lab Apoio E6.1', 'laboratorio', [[8.04, 0.515, 11.24, 5.91]], 'texto da planta'),
    ('lab_31', 'Lab Apoio 3.1', 'laboratorio', [[8.04, 16.35, 11.24, 21.76]], 'texto da planta'),
    ('escadas', 'Escadas (acesso ao piso superior)', 'fora_de_jogo', [[11.53, 9.78, 13.21, 14.55]], 'interpretado do desenho'),
    ('arrecadacao', 'Arrecadação', 'fora_de_jogo', [[9.69, 9.86, 11.38, 12.6]], 'texto da planta (4,38 m²)'),
    ('compartimento', 'Compartimento (função não indicada)', 'fora_de_jogo', [[9.69, 12.75, 11.38, 14.55]], 'sem nome na planta'),
    ('tecnico', 'Compartimento técnico', 'fora_de_jogo', [[9.69, 14.76, 13.21, 16.14]], 'interpretado (quadro elétrico na parede)'),
]
EXTERIOR = [[7.0, -11.0, 19.6, -3.87], [15.23, -3.87, 19.6, -0.73]]   # área exterior jogável aproximada
RAMPA = [15.24, -2.13, 18.24, -0.73]

PORTAS = [
    # id, liga, vão [x0,y0,x1,y1], folhas, nota
    ('p_exterior', ['exterior', 'entrada'], [11.63, -3.87, 14.89, -3.52], 2, 'interpretado: frente envidraçada com seta de entrada; largura útil não detalhada'),
    ('p_rampa', ['exterior', 'entrada'], [14.89, -2.13, 15.23, -0.73], 0, 'interpretado: acesso lateral pela rampa (seta desenhada)'),
    ('p_entrada', ['entrada', 'corredor'], [12.27, 0.0, 14.24, 0.515], 2, 'observado: vão de 1,97 m e duas folhas com arcos'),
    ('p_e6', ['sala_e6', 'atrio'], [7.64, 6.37, 8.04, 7.22], 1, 'observado'),
    ('p_e5', ['sala_e5', 'passagem_esq'], [7.64, 13.61, 8.04, 14.45], 1, 'observado'),
    ('p_e4', ['sala_e4', 'passagem_esq'], [7.64, 15.03, 8.04, 15.88], 1, 'observado'),
    ('p_e1', ['sala_e1', 'atrio'], [14.83, 6.40, 15.26, 7.25], 1, 'observado'),
    ('p_e2', ['sala_e2', 'passagem_dir'], [14.83, 13.61, 15.26, 14.45], 1, 'observado'),
    ('p_e3', ['sala_e3', 'passagem_dir'], [13.45, 14.53, 14.31, 14.95], 1, 'observado'),
    ('p_e61', ['lab_e61', 'atrio'], [8.12, 5.91, 8.98, 6.29], 1, 'observado'),
    ('p_31', ['lab_31', 'passagem_esq'], [8.13, 16.14, 8.98, 16.35], 1, 'observado'),
    ('p_31_e3', ['lab_31', 'sala_e3'], [11.24, 16.49, 11.66, 17.35], 1, 'observado: vão nas duas faces da parede e folha desenhada'),
    ('p_escadas', ['escadas', 'atrio'], [11.62, 9.72, 13.12, 9.78], 2, 'observado a tracejado (estado da porta não indicado)'),
    ('p_arrecadacao', ['arrecadacao', 'passagem_esq'], [9.51, 9.97, 9.69, 10.85], 1, 'observado (arco)'),
    ('p_compartimento', ['compartimento', 'passagem_esq'], [9.51, 13.62, 9.69, 14.47], 1, 'observado (arco)'),
    ('p_tecnico', ['tecnico', 'passagem_esq'], [9.51, 14.78, 9.69, 15.62], 1, 'observado (arco)'),
]
FORA_DE_JOGO_PORTAS = {'p_escadas', 'p_arrecadacao', 'p_compartimento', 'p_tecnico'}

JANELAS = (
    [dict(fachada='superior', a=a, b=b) for a, b in [(1.52, 3.35), (5.13, 6.96), (8.74, 10.57), (15.96, 17.79), (19.57, 21.40)]] +
    [dict(fachada='inferior', a=a, b=b) for a, b in [(1.52, 3.35), (5.13, 6.96), (8.74, 10.57), (12.35, 14.18), (15.96, 17.79), (19.57, 21.40)]] +
    [dict(fachada='esquerda', a=a, b=b) for a, b in [(7.97, 9.20), (12.02, 13.85)]] +
    [dict(fachada='direita', a=a, b=b) for a, b in [(7.97, 9.20), (12.02, 13.85)]] +
    [dict(fachada='entrada_esq', a=-2.37, b=-0.48)]
)
FACHADA = {  # posição da face interior e exterior de cada fachada
    'superior': dict(eixo='x', int=0.515, ext=0.0), 'inferior': dict(eixo='x', int=21.76, ext=22.27),
    'esquerda': dict(eixo='y', int=0.83, ext=0.0), 'direita': dict(eixo='y', int=22.07, ext=22.59),
    'entrada_esq': dict(eixo='y', int=11.63, ext=11.28),
}

QUADROS_ELETRICOS = [[7.65, 5.35, 7.76, 5.77], [7.65, 12.59, 7.76, 13.01], [7.65, 16.48, 7.76, 16.91], [13.26, 14.96, 13.38, 15.38],
                     [15.14, 5.35, 15.26, 5.78], [15.14, 12.57, 15.26, 12.99], [9.24, 16.22, 9.67, 16.33], [9.58, 5.93, 10.0, 6.04],
                     [10.51, 14.58, 11.39, 14.86]]

CONSTRUIR = [  # elementos a vermelho ("Construir" na legenda); tipo não especificado
    dict(id='c_e61_a', espaco='lab_e61', r=[10.67, 0.52, 11.24, 5.34]),
    dict(id='c_e61_b', espaco='lab_e61', r=[9.31, 5.34, 11.24, 5.90]),
    dict(id='c_31_a', espaco='lab_31', r=[8.05, 17.77, 8.63, 21.74]),
    dict(id='c_31_b', espaco='lab_31', r=[10.54, 17.77, 11.24, 21.74]),
    dict(id='c_31_c', espaco='lab_31', r=[9.16, 16.36, 10.15, 16.94]),
    dict(id='c_e3', espaco='sala_e3', r=[21.47, 14.95, 22.07, 21.76]),
    dict(id='c_corredor', espaco='corredor', r=[11.66, 2.09, 12.06, 6.29]),
    dict(id='c_atrio', espaco='atrio', r=[9.48, 6.29, 12.06, 6.89]),
]
EXISTENTE_SEM_TIPO = [dict(id='x_e61', espaco='lab_e61', r=[8.05, 0.52, 8.75, 4.52], nota='contorno negro (existente) com indicação a tracejado vermelho; tipo não indicado'),
                      dict(id='x_e6_pelicula', espaco='sala_e6', r=[7.30, 0.71, 7.50, 5.82], nota='painel junto à parede com a indicação «PELÍCULA 3M»')]

# ------------------------------------------------------------------
# 2. Extração vetorial do mobiliário
# ------------------------------------------------------------------
quads = collections.defaultdict(list)
greys = []
wave, diamond, gac = [], [], []
for d in pg.get_drawings():
    col = tuple(round(c, 2) for c in d['color']) if d.get('color') else None
    for it in d['items']:
        if it[0] == 'qu' and col in LEGENDA:
            q = it[1]
            pts = [m(q.ul), m(q.ur), m(q.lr), m(q.ll)]
            quads[col].append(pts)
    if col == (0.5, 0.5, 0.5):
        greys.append(mr(d['rect']))
    if col == (0.72, 0.72, 0.0):
        wave += [m(it[1]) for it in d['items'] if it[0] == 'l']
    if col == (0.72, 0.36, 0.36):
        diamond.append(mr(d['rect']))
    if col == (0.0, 1.0, 1.0):
        quads[('mesa_redonda',)].append(mr(d['rect']))

def bbox(pts):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return [min(xs), min(ys), max(xs), max(ys)]

def inside(r, x, y):
    return r[0] - 0.05 <= x <= r[2] + 0.05 and r[1] - 0.05 <= y <= r[3] + 0.05

def espaco_de(x, y):
    for e in ESPACOS:
        for r in e[3]:
            if inside(r, x, y): return e[0]
    return None

mob = []
cont = collections.Counter()
for col, L in quads.items():
    if col == ('mesa_redonda',): continue
    leg = LEGENDA[col]
    for pts in L:
        b = bbox(pts)
        if not (-1 < b[0] < 23 and -5 < b[1] < 23): continue
        cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
        esp = espaco_de(cx, cy)
        if esp is None: continue
        cont[leg['tipo']] += 1
        item = dict(id=f"m{len(mob)+1:03d}", tipo=leg['tipo'], codigo=leg['cod'], descricao=leg['desc'], espaco=esp,
                    origem='observado', fonte='cor da legenda; posição medida no PDF')
        lado = [math.dist(pts[0], pts[1]), math.dist(pts[1], pts[2])]
        rodado = abs((pts[1][1] - pts[0][1])) > 0.05 and abs((pts[1][0] - pts[0][0])) > 0.05
        if rodado:
            item['quad'] = [[R2(x), R2(y)] for x, y in pts]
        else:
            item['r'] = [R2(v) for v in b]
        if leg['alt'] is not None:
            item['altura'] = dict(v=leg['alt'], origem='cota', fonte='legenda (LxPxA)')
        else:
            item['altura'] = dict(v=ALT_EST[leg['tipo']], origem='estimado')
        mob.append(item)

# tipos desenhados só com linhas: agrupar os traços por cor
POR_LINHAS = {(0.0, 0.72, 0.0): (1.8, 2.2), (0.0, 0.72, 0.72): (0.5, 0.9), (0.36, 0.29, 0.59): (1.0, 2.2)}
traços = collections.defaultdict(list)
for d in pg.get_drawings():
    col = tuple(round(c, 2) for c in d['color']) if d.get('color') else None
    if col in POR_LINHAS: traços[col].append(mr(d['rect']))
for col, L in traços.items():
    gs = []
    for b in sorted(L):
        if not (-1 < b[0] < 23 and -5 < b[1] < 23): continue
        for g in gs:
            if b[0] <= g[2] + 0.03 and b[2] >= g[0] - 0.03 and b[1] <= g[3] + 0.03 and b[3] >= g[1] - 0.03:
                g[:] = [min(g[0], b[0]), min(g[1], b[1]), max(g[2], b[2]), max(g[3], b[3])]; break
        else: gs.append(list(b))
    lo, hi = POR_LINHAS[col]
    leg = LEGENDA[col]
    for g in gs:
        if not (lo <= max(g[2] - g[0], g[3] - g[1]) <= hi): continue
        cx, cy = (g[0] + g[2]) / 2, (g[1] + g[3]) / 2
        esp = espaco_de(cx, cy)
        if not esp or not esp.startswith('sala'): continue
        cont[leg['tipo']] += 1
        item = dict(id=f"m{len(mob)+1:03d}", tipo=leg['tipo'], codigo=leg['cod'], descricao=leg['desc'], espaco=esp, r=[R2(v) for v in g],
                    origem='observado', fonte='cor da legenda; contorno dos traços medido no PDF')
        item['altura'] = dict(v=leg['alt'], origem='cota', fonte='legenda (LxPxA)') if leg['alt'] else dict(v=ALT_EST.get(leg['tipo'], 1.0), origem='estimado')
        if leg['tipo'] == 'mesa_professor': item['nota'] = 'contorno inclui o púlpito e a zona da cadeira'
        mob.append(item)

# mesas de professor redondas (círculos)
seen = []
for b in quads[('mesa_redonda',)]:
    w, h = b[2] - b[0], b[3] - b[1]
    if 0.5 < w < 0.7 and 0.5 < h < 0.7 and not any(abs(b[0] - s[0]) < 0.05 and abs(b[1] - s[1]) < 0.05 for s in seen):
        seen.append(b)
        cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
        esp = espaco_de(cx, cy)
        if not esp or not esp.startswith('sala'): continue
        mob.append(dict(id=f"m{len(mob)+1:03d}", tipo='mesa_redonda', codigo='N3L TDD 41D', descricao=LEGENDA[(0.0, 1.0, 1.0)]['desc'],
                        espaco=esp, c=[R2(cx), R2(cy)], raio=0.3, altura=dict(v=1.05, origem='cota', fonte='legenda'),
                        origem='observado', fonte='cor da legenda; posição medida no PDF'))

# mesas Diamond: agrupar em conjuntos hexagonais
groups = []
for b in diamond:
    if b[2] - b[0] > 3 or b[3] - b[1] > 3: continue
    for g in groups:
        if b[0] <= g[2] + 0.05 and b[2] >= g[0] - 0.05 and b[1] <= g[3] + 0.05 and b[3] >= g[1] - 0.05:
            g[:] = [min(g[0], b[0]), min(g[1], b[1]), max(g[2], b[2]), max(g[3], b[3])]; break
    else: groups.append(list(b))
for g in groups:
    if g[2] - g[0] < 1.0: continue
    cx, cy = (g[0] + g[2]) / 2, (g[1] + g[3]) / 2
    mob.append(dict(id=f"m{len(mob)+1:03d}", tipo='mesa_diamond', codigo='MESA DIAMOND', descricao=LEGENDA[(0.72, 0.36, 0.36)]['desc'],
                    espaco=espaco_de(cx, cy), c=[R2(cx), R2(cy)], raio=R2((g[2] - g[0]) / 2), r=[R2(v) for v in g],
                    altura=dict(v=0.75, origem='estimado'), origem='observado', fonte='cor da legenda; forma simplificada a hexágono'))

# armário curvo (arco aproximado; forma ajustada ao contorno)
if wave:
    b = bbox(wave)
    mob.append(dict(id=f"m{len(mob)+1:03d}", tipo='armario_curvo', codigo='AAC115', descricao=LEGENDA[(0.72, 0.72, 0.0)]['desc'],
                    espaco=espaco_de((b[0] + b[2]) / 2, (b[1] + b[3]) / 2),
                    arco=dict(c=[R2((b[0] + b[2]) / 2), 5.52], raioExt=1.27, raioInt=0.72, angulo=115),
                    r=[R2(v) for v in b], altura=dict(v=0.80, origem='estimado'), origem='interpretado',
                    fonte='cor da legenda; arco ajustado ao contorno (forma aproximada)'))

# cadeiras: símbolos cinzentos de ~0,6 m; orientação para a mesa mais próxima
def closest_point(r, x, y):
    return (min(max(x, r[0]), r[2]), min(max(y, r[1]), r[3]))
alvos = []
for it in mob:
    if it['tipo'] in ('carro', 'carregador', 'rover', 'ecra'): continue
    if 'r' in it: alvos.append(it['r'])
    elif 'quad' in it: alvos.append(bbox(it['quad']))
    elif 'c' in it: alvos.append([it['c'][0] - 0.3, it['c'][1] - 0.3, it['c'][0] + 0.3, it['c'][1] + 0.3])
boxes = []
for b in greys:
    if not (-1 < b[0] < 23 and -5 < b[1] < 23): continue
    for g in boxes:
        if b[0] <= g[2] and b[2] >= g[0] and b[1] <= g[3] and b[3] >= g[1]:
            g[:] = [min(g[0], b[0]), min(g[1], b[1]), max(g[2], b[2]), max(g[3], b[3])]; break
    else: boxes.append(list(b))
cadeiras = []
for g in boxes:
    w, h = g[2] - g[0], g[3] - g[1]
    if not (0.45 < w < 0.8 and 0.45 < h < 0.8): continue
    cx, cy = (g[0] + g[2]) / 2, (g[1] + g[3]) / 2
    esp = espaco_de(cx, cy)
    if not esp: continue
    best = None
    for r in alvos:
        px, py = closest_point(r, cx, cy); dd = math.dist((px, py), (cx, cy))
        if best is None or dd < best[0]: best = (dd, px, py)
    ang = math.atan2(best[1] - cx, best[2] - cy) if best and best[0] < 1.0 else 0.0
    cadeiras.append(dict(c=[R2(cx), R2(cy)], rot=R2(ang), espaco=esp))

# ------------------------------------------------------------------
# 3. Grelha de ocupação, paredes e pontos de interação
# ------------------------------------------------------------------
RES = 0.05; GX0, GY0, GX1, GY1 = -1.0, -12.0, 25.5, 24.0
GW, GH = int(round((GX1 - GX0) / RES)), int(round((GY1 - GY0) / RES))
VOID, WALK, WALL, BLOCK, PROP = 0, 1, 2, 3, 4
grid = np.zeros((GH, GW), np.uint8)
def fill(r, v, cond=None):
    i0, i1 = int(round((r[0] - GX0) / RES)), int(round((r[2] - GX0) / RES))
    j0, j1 = int(round((r[1] - GY0) / RES)), int(round((r[3] - GY0) / RES))
    sub = grid[max(0, j0):j1, max(0, i0):i1]
    if cond is None: sub[:] = v
    else: sub[cond(sub)] = v
BLOCO = [0, 0, 22.59, 22.27]
VOLUME_ENTRADA = [11.28, -3.87, 15.23, 0.0]
fill(BLOCO, WALL)
fill(VOLUME_ENTRADA, WALL)
for e in ESPACOS:
    for r in e[3]: fill(r, BLOCK if e[2] == 'fora_de_jogo' else WALK)
for r in EXTERIOR: fill(r, WALK, lambda s: s == VOID)
for p in PORTAS:
    if p[0] in FORA_DE_JOGO_PORTAS: continue
    fill(p[2], WALK, lambda s: s == WALL)

def greedy(val):
    vis = np.zeros_like(grid, bool); out = []
    H, W = grid.shape
    for j in range(H):
        row = grid[j]
        i = 0
        while i < W:
            if row[i] != val or vis[j, i]: i += 1; continue
            w = 1
            while i + w < W and row[i + w] == val and not vis[j, i + w]: w += 1
            h = 1
            while j + h < H and np.all(grid[j + h, i:i + w] == val) and not vis[j + h, i:i + w].any(): h += 1
            vis[j:j + h, i:i + w] = True
            out.append([R2(GX0 + i * RES), R2(GY0 + j * RES), R2(GX0 + (i + w) * RES), R2(GY0 + (j + h) * RES)])
            i += w
    return out
# paredes: volume do edifício que não é espaço nem vão
for p in PORTAS:
    if p[0] in FORA_DE_JOGO_PORTAS: continue
    fill(p[2], WALL, lambda s: s == WALK)   # temporariamente, para gerar paredes contínuas
paredes = greedy(WALL)
for p in PORTAS:
    if p[0] in FORA_DE_JOGO_PORTAS: continue
    fill(p[2], WALK, lambda s: s == WALL)
nucleo = greedy(BLOCK)

# obstáculos do mobiliário (cadeiras não bloqueiam: simplificação de jogo)
def fill_poly(pts, v):
    b = bbox(pts)
    i0, i1 = int((b[0] - GX0) / RES), int((b[2] - GX0) / RES) + 1
    j0, j1 = int((b[1] - GY0) / RES), int((b[3] - GY0) / RES) + 1
    from matplotlib.path import Path
    P = Path(pts)
    for j in range(j0, j1):
        for i in range(i0, i1):
            x, y = GX0 + (i + .5) * RES, GY0 + (j + .5) * RES
            if grid[j, i] == WALK and P.contains_point((x, y)): grid[j, i] = v
for it in mob:
    if 'quad' in it: fill_poly(it['quad'], PROP)
    elif it['tipo'] == 'armario_curvo':
        a = it['arco']; c = a['c']
        for j in range(int((it['r'][1] - GY0) / RES), int((it['r'][3] - GY0) / RES) + 1):
            for i in range(int((it['r'][0] - GX0) / RES), int((it['r'][2] - GX0) / RES) + 1):
                x, y = GX0 + (i + .5) * RES, GY0 + (j + .5) * RES
                d = math.dist((x, y), c); ang = math.degrees(math.atan2(x - c[0], -(y - c[1])))
                if a['raioInt'] <= d <= a['raioExt'] and abs(ang) <= a['angulo'] and grid[j, i] == WALK: grid[j, i] = PROP
    elif 'c' in it and it['tipo'] in ('mesa_redonda', 'mesa_diamond'):
        rr = it['raio'] * (0.86 if it['tipo'] == 'mesa_diamond' else 1)
        c = it['c']
        for j in range(int((c[1] - rr - GY0) / RES), int((c[1] + rr - GY0) / RES) + 1):
            for i in range(int((c[0] - rr - GX0) / RES), int((c[0] + rr - GX0) / RES) + 1):
                x, y = GX0 + (i + .5) * RES, GY0 + (j + .5) * RES
                if math.dist((x, y), c) <= rr and grid[j, i] == WALK: grid[j, i] = PROP
    elif 'r' in it:
        fill(it['r'], PROP, lambda s: s == WALK)
for c in CONSTRUIR + EXISTENTE_SEM_TIPO: fill(c['r'], PROP, lambda s: s == WALK)

def walkable(x, y, rad=0.28):
    for a in range(8):
        px, py = x + math.cos(a * math.pi / 4) * rad, y + math.sin(a * math.pi / 4) * rad
        i, j = int((px - GX0) / RES), int((py - GY0) / RES)
        if grid[j, i] != WALK: return False
    return True

INICIO = dict(x=13.26, y=-7.2, rot=0.0)
def bfs(start):
    from collections import deque
    H, W = grid.shape
    ok = np.zeros((H, W), bool)
    # célula livre para o raio do aluno
    free = np.zeros((H, W), bool)
    rad = int(math.ceil(0.28 / RES))
    walk = grid == WALK
    # erosão simples (quadrado) para o raio do aluno
    from scipy.ndimage import binary_erosion
    free = binary_erosion(walk, structure=np.ones((2 * rad - 1, 2 * rad - 1)))
    si, sj = int((start[0] - GX0) / RES), int((start[1] - GY0) / RES)
    q = deque([(sj, si)]); ok[sj, si] = True
    while q:
        j, i = q.popleft()
        for dj, di in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nj, ni = j + dj, i + di
            if 0 <= nj < H and 0 <= ni < W and free[nj, ni] and not ok[nj, ni]:
                ok[nj, ni] = True; q.append((nj, ni))
    return ok, free
alc, livre = bfs((INICIO['x'], INICIO['y']))
def alcancavel(x, y):
    return alc[int((y - GY0) / RES), int((x - GX0) / RES)]

# ecrãs observados (Promethean): orientação para dentro da sala
ecras = {}
for it in mob:
    if it['tipo'] != 'ecra': continue
    r = it['r']; esp = next(e for e in ESPACOS if e[0] == it['espaco'])
    sr = esp[3][0]
    cx, cy = (r[0] + r[2]) / 2, (r[1] + r[3]) / 2
    if r[2] - r[0] > r[3] - r[1]:
        n = [0, 1] if abs(cy - sr[1]) < abs(cy - sr[3]) else [0, -1]
        if it['espaco'] == 'sala_e3': n = [1, 0]
    else:
        n = [1, 0] if abs(cx - sr[0]) < abs(cx - sr[2]) else [-1, 0]
    if it['espaco'] == 'sala_e3':
        n = [1, 0]
    it['normal'] = n
    it['ecra'] = dict(largura=dict(v=R2(max(r[2] - r[0], r[3] - r[1])), origem='medido'),
                      alturaEcra=dict(v=1.07, origem='estimado', nota='86" 16:9'), centro=dict(v=1.45, origem='estimado'))
    ecras[it['espaco']] = it

# consola de missão (ficcional): na parede junto à porta da sala, com chão livre e alcançável à frente
MISSOES = [
    dict(id='tut', espaco='entrada', porta=None, ecra=None, funcao='Tutorial: movimento, terminal e primeira etiqueta HTML'),
    dict(id='m1', espaco='sala_e1', porta='p_e1', ecra='sala_e1', funcao='HTML: estrutura, elementos semânticos e atributos'),
    dict(id='m2', espaco='sala_e2', porta='p_e2', ecra='sala_e2', funcao='CSS: seletores, cores e modelo de caixa'),
    dict(id='m3', espaco='sala_e3', porta='p_e3', ecra='sala_e3', funcao='CSS Flexbox'),
    dict(id='m4', espaco='sala_e4', porta='p_e4', ecra='sala_e4', funcao='CSS Grid'),
    dict(id='m5', espaco='sala_e5', porta='p_e5', ecra='sala_e5', funcao='JavaScript: variáveis, eventos e DOM'),
    dict(id='m6', espaco='sala_e6', porta='p_e6', ecra='sala_e6', funcao='Formulários e validação'),
    dict(id='extra', espaco='lab_31', porta='p_31', ecra=None, funcao='Desafios extra (visita com desafios opcionais)'),
    dict(id='final', espaco='lab_e61', porta='p_e61', ecra=None, funcao='Desafio final (visita com desafio de transferência)'),
]

def wall_segments_near(espid, door):
    """Gera candidatos (x, y, normal) ao longo das paredes do espaço, por ordem de distância à porta."""
    esp = next(e for e in ESPACOS if e[0] == espid)
    cands = []
    for r in esp[3]:
        for t in np.arange(0.5, 12, 0.1):
            for (x, y, n) in [(r[0], None, [1, 0]), (r[2], None, [-1, 0]), (None, r[1], [0, 1]), (None, r[3], [0, -1])]:
                if x is not None:
                    for yy in (r[1] + t, r[3] - t):
                        if r[1] + 0.4 < yy < r[3] - 0.4: cands.append((x, yy, n))
                else:
                    for xx in (r[0] + t, r[2] - t):
                        if r[0] + 0.4 < xx < r[2] - 0.4: cands.append((xx, y, n))
    dx = (door[0] + door[2]) / 2 if door else 13.26; dy = (door[1] + door[3]) / 2 if door else -2.0
    cands = list({(round(a, 2), round(b, 2), tuple(n)) for a, b, n in cands})
    cands.sort(key=lambda c: math.dist((c[0], c[1]), (dx, dy)))
    return cands

def livre_rect(x0, y0, x1, y1):
    i0, i1 = int((x0 - GX0) / RES), int((x1 - GX0) / RES)
    j0, j1 = int((y0 - GY0) / RES), int((y1 - GY0) / RES)
    return np.all(grid[j0:j1, i0:i1] == WALK)

def em_porta(x, y, marg=0.75):
    for p in PORTAS:
        r = p[2]
        if r[0] - marg <= x <= r[2] + marg and r[1] - marg <= y <= r[3] + marg: return True
    return False

consolas = []
for ms in MISSOES:
    if ms['id'] == 'tut':
        consolas.append(dict(missao='tut', espaco='entrada', parede=[11.63, -3.0], normal=[1, 0], ponto=[12.35, -3.0], raio=1.3,
                             origem='ficcional', posicao='colocada na face interior do pilar esquerdo da entrada'))
        continue
    door = next(p for p in PORTAS if p[0] == ms['porta'])[2]
    escolhido = None
    for (x, y, n) in wall_segments_near(ms['espaco'], door):
        px, py = x + n[0] * 0.75, y + n[1] * 0.75
        if em_porta(x, y, 0.55): continue
        # zona à frente da consola livre (0,9 m de largura, 0,8 m de profundidade)
        a = (x + n[0] * 0.05, y + n[1] * 0.05); b = (x + n[0] * 0.85, y + n[1] * 0.85)
        if n[0] != 0: rect = [min(a[0], b[0]), y - 0.45, max(a[0], b[0]), y + 0.45]
        else: rect = [x - 0.45, min(a[1], b[1]), x + 0.45, max(a[1], b[1])]
        if not livre_rect(*rect): continue
        if not alcancavel(px, py): continue
        escolhido = (x, y, n, px, py); break
    if not escolhido:
        print('SEM LUGAR PARA CONSOLA', ms['id']); continue
    x, y, n, px, py = escolhido
    consolas.append(dict(missao=ms['id'], espaco=ms['espaco'], parede=[R2(x), R2(y)], normal=list(n), ponto=[R2(px), R2(py)], raio=1.2,
                         origem='ficcional', posicao='calculada: parede mais próxima da porta com chão livre e alcançável à frente'))

# ecrãs e objetos do jogo (ficcionais)
bt = next(it for it in mob if it['codigo'] == 'BT11200900-SCPU')
FICCIONAIS = dict(
    ecras_jogo=[dict(missao='tut', parede=[11.63, -3.12], normal=[1, 0], largura=1.3, altura=0.8, centro=2.2),
                dict(missao='extra', parede=[11.24, 19.75], normal=[-1, 0], largura=2.6, altura=1.3, centro=1.9),
                dict(missao='final', parede=[8.04, 2.52], normal=[1, 0], largura=2.6, altura=1.4, centro=1.9)],
    caixas_m3=dict(missao='m3', sobre=bt['id'], nota='caixas animadas sobre a bancada técnica observada junto ao ecrã'),
    luzes_m5=dict(missao='m5', zonas=[dict(id='a', c=[2.25, 11.3]), dict(id='b', c=[4.05, 10.9]), dict(id='c', c=[6.35, 10.4])], altura=2.6),
    impressora_m6=dict(missao='m6', r=[5.85, 6.88, 6.4, 7.31]),
    quadro_missoes=dict(parede=[14.83, 3.4], normal=[-1, 0], largura=1.75, altura=1.15, centro=1.6,
                        nota='no corredor, do lado da Sala E1; a parede central do átrio tem o painel dos CTE'),
    sinal_orientacao=dict(parede=[13.97, 9.72], normal=[0, -1], largura=1.5, altura=0.5, centro=2.45, esquerda='← E1 · E2 · E3', direita='E4 · E5 · E6 →', labs='Labs de apoio E6.1 e 3.1 →'),
    placa_logo=dict(parede=[14.89, -3.12], normal=[-1, 0], largura=1.0, altura=1.0, centro=1.8),
    totem_financiamento=dict(c=[10.0, -6.6], largura=2.7),
)
for f in [FICCIONAIS['impressora_m6']]:
    i0, i1 = int((f['r'][0] - GX0) / RES), int((f['r'][2] - GX0) / RES)
    j0, j1 = int((f['r'][1] - GY0) / RES), int((f['r'][3] - GY0) / RES)
    assert np.all(grid[j0:j1, i0:i1] == WALK), 'impressora sobre obstáculo'

# decoração observada em fotografias do átrio (posições indicadas pelo professor)
FOTO = 'fotografias do átrio e da passagem, 24-10-2026'
DECORACAO = [
    dict(id='painel_cte', tipo='painel', nome='Painel dos Centros Tecnológicos Especializados',
         parede=[10.57, 9.72], normal=[0, -1], largura=dict(v=2.0, origem='estimado'), altura=dict(v=1.52, origem='estimado'),
         base=dict(v=0.08, origem='estimado'), imagem='painel-central', origem='fotografia', fonte=FOTO,
         nota='Parede central do núcleo, junto às escadas, de frente para o átrio. A imagem é a fotografia endireitada; '
              'a largura cabe na parede da planta e a altura segue a proporção da fotografia (1,32).'),
    dict(id='faixa_e2', tipo='faixa', nome='Faixa decorativa · parede da Sala E2',
         eixo='y', linha=14.83, de=7.35, ate=13.55, normal=[-1, 0], inicio='de',
         altura=dict(v=1.4, origem='estimado'), mural=dict(v=3.6, origem='estimado'), semente=11, origem='fotografia', fonte=FOTO,
         nota='Lado esquerdo de quem vem da entrada, a seguir à porta da Sala E1. Lambrim com o desenho em polígonos azuis e '
              'linhas pretas recriado no estilo da fotografia; não é uma cópia exata.'),
    dict(id='faixa_e5', tipo='faixa', nome='Faixa decorativa · parede da Sala E5',
         eixo='y', linha=8.04, de=9.75, ate=13.55, normal=[1, 0], inicio='de',
         altura=dict(v=1.4, origem='estimado'), mural=dict(v=3.6, origem='estimado'), semente=23, origem='fotografia', fonte=FOTO,
         nota='Lado direito, na passagem junto ao núcleo, ao longo da parede da Sala E5 (como aparece na fotografia do painel central). '
              'Desenho recriado no estilo da fotografia; não é uma cópia exata.'),
]

# ------------------------------------------------------------------
# 4. Escadas (referência espacial, fora da área de jogo)
# ------------------------------------------------------------------
escadas = dict(
    area=[9.51, 9.72, 13.21, 16.14],
    lancos=[dict(id='lanco_dir', r=[11.53, 9.86, 13.21, 12.75], degraus=11, sobe='para baixo na folha', origem='observado (linhas de degrau e seta)'),
            dict(id='lanco_esq', r=[9.69, 9.86, 11.38, 12.75], degraus=10, sobe='para cima na folha', origem='observado (linhas de degrau e seta)')],
    patamar=dict(r=[9.69, 12.75, 13.21, 13.1], origem='interpretado'),
    espelho=dict(v=0.17, origem='estimado'), cobertor=dict(v=0.30, origem='medido', nota='espaçamento das linhas de degrau ≈ 0,30 m'),
    jogavel=False, nota='Escada de dois lanços para um piso superior não documentado. Representada como referência; acesso vedado no jogo.')

# ------------------------------------------------------------------
# 5. Verificação de ligações
# ------------------------------------------------------------------
verif = []
for e in ESPACOS:
    if e[2] == 'fora_de_jogo': continue
    r = e[3][0]; cx, cy = (r[0] + r[2]) / 2, (r[1] + r[3]) / 2
    # procurar uma célula livre alcançável no espaço
    ok = False
    for rr in e[3]:
        sub = alc[int((rr[1] - GY0) / RES):int((rr[3] - GY0) / RES), int((rr[0] - GX0) / RES):int((rr[2] - GX0) / RES)]
        if sub.any(): ok = True
    verif.append((e[0], ok))
for c in consolas: verif.append(('consola_' + c['missao'], bool(alcancavel(*c['ponto']))))
print('Ligações:', verif)

# ------------------------------------------------------------------
# 6. Imagem de referência (para a vista de comparação)
# ------------------------------------------------------------------
REF_BOUNDS = [-1.2, -5.0, 23.8, 23.2]   # metros (x0, y0, x1, y1)
clip = pymupdf.Rect(O[0] + REF_BOUNDS[0] * K, O[1] + REF_BOUNDS[1] * K, O[0] + REF_BOUNDS[2] * K, O[1] + REF_BOUNDS[3] * K)
pix = pg.get_pixmap(matrix=pymupdf.Matrix(3.4, 3.4), clip=clip)
from PIL import Image
im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
im.save(REF, quality=78, optimize=True, progressive=True)

# ------------------------------------------------------------------
# 7. Gravar
# ------------------------------------------------------------------
dados = dict(
    versao=1,
    meta=dict(
        titulo='CTE AERT3 · planta interpretada para o jogo',
        fonte='Escola Secundária de Rio Tinto · Planta de mobiliário (Desigual, 15-09-2025), escala 1:100, folha única',
        data_leitura=datetime.date.today().isoformat(),
        unidade='metro', origem='canto exterior superior esquerdo do bloco principal',
        eixos='x para a direita da folha; y para baixo da folha. «Superior», «inferior», «esquerda» e «direita» referem-se à folha.',
        aviso='Interpretação de uma planta 2D para um jogo. Não é um modelo BIM nem uma conversão 3D exata: a planta não define alturas, materiais nem volumes. Medidas em planta lidas à escala; alturas são cotas da legenda ou estimativas editáveis.',
        validacao_escala=[dict(cota='2328', medido=2.33, local='Sala E1, afastamento entre mesas'),
                          dict(cota='1090', medido=1.08, local='Sala E1'), dict(cota='2808', medido=2.81, local='Sala E1')],
        legenda_lida=[dict(codigo=v['cod'], descricao=v['desc']) for v in LEGENDA.values()],
        nao_legivel=['funções dos compartimentos do núcleo, além da arrecadação', 'tipo dos elementos a construir', 'pé-direito, alturas de portas e janelas', 'piso superior'],
        imagem_referencia=dict(ficheiro='planta-referencia.jpg', limites=REF_BOUNDS),
    ),
    alturas=dict(
        peDireito=dict(v=3.0, origem='estimado'), porta=dict(v=2.1, origem='estimado'), janelaPeitoril=dict(v=0.9, origem='estimado'),
        janelaAltura=dict(v=1.6, origem='estimado'), cadeiraAssento=dict(v=0.45, origem='estimado'), cadeiraEncosto=dict(v=0.85, origem='estimado'),
        quadroEletrico=dict(v=1.3, origem='estimado', nota='altura do centro')),
    bloco=dict(r=BLOCO, origem='medido'),
    volumes=dict(rects=[BLOCO, VOLUME_ENTRADA], regra='paredes = volumes − espaços − vãos de porta', origem='medido'),
    entrada_pilares=[dict(r=[11.28, -3.87, 11.63, -2.37], origem='observado'), dict(r=[14.89, -3.87, 15.23, -2.37], origem='observado')],
    exterior=dict(rects=EXTERIOR, rampa=dict(r=RAMPA, origem='observado (rampa com seta)'), origem='estimado', nota='área exterior aproximada; fora do âmbito da planta'),
    espacos=[dict(id=e[0], nome=e[1], tipo=e[2], rects=e[3], origem='medido', nome_origem=e[4]) for e in ESPACOS],
    paredes=dict(rects=paredes, origem='derivado', nota='contorno do bloco medido, menos espaços e vãos; inclui espessuras lidas nas linhas do desenho'),
    nucleo_fechado=dict(rects=nucleo, nota='espaços sem acesso no jogo'),
    portas=[dict(id=p[0], liga=p[1], vao=p[2], folhas=p[3], largura=R2(max(p[2][2] - p[2][0], p[2][3] - p[2][1])), origem='observado' if p[4].startswith('observado') else 'interpretado',
                 nota=p[4], jogavel=p[0] not in FORA_DE_JOGO_PORTAS) for p in PORTAS],
    janelas=[dict(fachada=j['fachada'], de=j['a'], ate=j['b'], face_interior=FACHADA[j['fachada']]['int'], face_exterior=FACHADA[j['fachada']]['ext'],
                  eixo=FACHADA[j['fachada']]['eixo'], origem='observado' if j['fachada'] != 'entrada_esq' else 'interpretado') for j in JANELAS],
    quadros_eletricos=[dict(r=r, origem='observado', fonte='cor «Quadro elétrico» da legenda') for r in QUADROS_ELETRICOS],
    mobiliario=mob,
    cadeiras=dict(lista=cadeiras, origem='observado', nota='símbolos de cadeira; orientação inferida pela mesa mais próxima; não bloqueiam o movimento (simplificação de jogo)'),
    a_construir=[dict(**c, origem='observado', tipo='não especificado', altura=dict(v=0.9, origem='estimado'),
                      nota='legenda «Construir»; a planta não indica o tipo de móvel') for c in CONSTRUIR],
    existente_sem_tipo=[dict(**c, origem='observado', altura=dict(v=0.9, origem='estimado')) for c in EXISTENTE_SEM_TIPO],
    escadas=escadas,
    inicio=dict(**INICIO, origem='ficcional'),
    limites=dict(nota='Área jogável: exterior aproximado, entrada, corredor, átrio, passagens, seis salas e dois laboratórios. Escadas e compartimentos técnicos fechados.',
                 barreiras=[dict(id='b_escadas', r=[11.62, 9.55, 13.12, 9.72], tipo='fita e sinal', origem='ficcional'),
                            dict(id='b_ext_sup', r=[7.0, -11.1, 19.6, -11.0], tipo='vedação baixa', origem='ficcional'),
                            dict(id='b_ext_esq', r=[6.9, -11.0, 7.0, -3.87], tipo='vedação baixa', origem='ficcional'),
                            dict(id='b_ext_dir', r=[19.6, -11.0, 19.7, -0.73], tipo='vedação baixa', origem='ficcional')]),
    ecras_observados=[dict(id=it['id'], espaco=it['espaco'], r=it['r'], normal=it['normal'], **it['ecra']) for it in ecras.values()],
    consolas=consolas,
    ficcionais=dict(**FICCIONAIS, origem='ficcional'),
    decoracao=DECORACAO,
    missoes=[dict(**ms, origem='proposta', nota='função pedagógica proposta para o jogo; não é a função real confirmada da sala') for ms in MISSOES],
    verificacao=dict(resultado=[dict(alvo=a, alcancavel=b) for a, b in verif], metodo='pesquisa em largura na grelha de 5 cm, com o raio do aluno (0,28 m)'),
    resumo=dict(mobiliario=dict(cont), cadeiras=len(cadeiras), paredes=len(paredes)),
)
json.dump(dados, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('mobiliário', dict(cont), 'cadeiras', len(cadeiras), 'paredes', len(paredes))
print('consolas', [(c['missao'], c['parede'], c['normal']) for c in consolas])
print('ficheiro', OUT, os.path.getsize(OUT) // 1024, 'KB', '· imagem', os.path.getsize(REF) // 1024, 'KB', im.size)
