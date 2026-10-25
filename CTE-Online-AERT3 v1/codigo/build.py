import base64, re, os
B = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(B, p), encoding='utf-8').read()
def b64(p, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(os.path.join(B, p), 'rb').read()).decode())

# three.js: troca o export final por um objeto THREE
three = rd('vendor/three/build/three.module.min.js')
m = re.search(r'export\{([^}]*)\};?\s*$', three)
pairs = []
for part in m.group(1).split(','):
    a, _, b = part.strip().partition(' as ')
    pairs.append('%s:%s' % (b or a, a))
three = three[:m.start()] + 'return {' + ','.join(pairs) + '};'
three_iife = 'const THREE = (function(){\n' + three + '\n})();'

bs_css = re.sub(r'/\*# sourceMappingURL=.*?\*/', '', rd('vendor/bs/dist/css/bootstrap.min.css'))
bs_js = re.sub(r'//# sourceMappingURL=.*', '', rd('vendor/bs/dist/js/bootstrap.bundle.min.js'))
css = rd('src/00-estilo.css')
corpo = rd('src/corpo.html')
js = '\n'.join(rd('src/' + f) for f in ['01-data.js', '02-missoes.js', '03-motor.js', '04-mundo.js', '05-ui.js', '07-mapa2d.js', '06-arranque.js'])
import json as _json
dados = _json.load(open(os.path.join(B, 'dados', 'cte-planta.json'), encoding='utf-8'))
consts = 'const LOGO_AERT3 = %r;\nconst BARRA_FIN = %r;\nconst PLANTA_REF_IMG = %r;\nconst DADOS_PLANTA = %s;\n' % (b64('vendor/logo.png', 'image/png'), b64('vendor/barra.png', 'image/png'), b64('dados/planta-referencia.jpg', 'image/jpeg'), _json.dumps(dados, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))

for name, s in [('three', three_iife), ('bootstrap', bs_js), ('jogo', js)]:
    assert '</script' not in s.lower(), name

html = f'''<title>CTE Online</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Jogo 3D de HTML, CSS e JavaScript no CTE do AERT3">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=JetBrains+Mono:wght@400;600&family=Sora:wght@600;800&display=swap">
<style>{bs_css}</style>
<style>{css}</style>
{corpo}
<script>{bs_js}</script>
<script type="module">
{three_iife}
{consts}
{js}
</script>
'''
open(os.path.join(B, 'cte-online.html'), 'w', encoding='utf-8').write(html)
# versão para abrir diretamente num navegador ou servidor da escola
full = '<!doctype html>\n<html lang="pt-PT">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + html.replace('<canvas id="mundo"', '</head>\n<body>\n<canvas id="mundo"', 1) + '</body>\n</html>\n'
open(os.path.join(B, 'index.html'), 'w', encoding='utf-8').write(full)
print('ok', round(len(html) / 1024), 'KB')
