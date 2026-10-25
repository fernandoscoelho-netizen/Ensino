"""Desenha os dados interpretados sobre a planta de referência, para verificar a leitura.
Uso: python3 tools/verificar_sobreposicao.py [pasta_de_saida]"""
import json, sys, math, os
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAI = sys.argv[1] if len(sys.argv) > 1 else os.path.join(BASE, 'verificacao')
os.makedirs(SAI, exist_ok=True)
from PIL import Image, ImageDraw
D=json.load(open(os.path.join(BASE, 'dados', 'cte-planta.json'), encoding='utf-8'))
im=Image.open(os.path.join(BASE, 'dados', 'planta-referencia.jpg')).convert('RGB')
B=D['meta']['imagem_referencia']['limites']; W,H=im.size
sx=W/(B[2]-B[0]); sy=H/(B[3]-B[1])
P=lambda x,y:(int((x-B[0])*sx),int((y-B[1])*sy))
ov=Image.new('RGBA',im.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
R=lambda r,f=None,o=None,w=3: d.rectangle([P(r[0],r[1]),P(r[2],r[3])],fill=f,outline=o,width=w)
for r in D['paredes']['rects']: R(r,(30,60,200,90))
for r in D['nucleo_fechado']['rects']: R(r,(120,120,120,90))
for p in D['portas']: R(p['vao'],(0,200,0,170) if p['jogavel'] else (200,0,0,170))
for m in D['mobiliario']:
  if 'quad' in m: d.polygon([P(*q) for q in m['quad']],outline=(255,120,0,255),width=4)
  elif 'r' in m: R(m['r'],None,(255,120,0,255),4)
  if 'c' in m and 'raio' in m:
    c=P(*m['c']); rr=int(m['raio']*sx); d.ellipse([c[0]-rr,c[1]-rr,c[0]+rr,c[1]+rr],outline=(255,0,180,255),width=4)
for c in D['cadeiras']['lista']:
  x,y=P(*c['c']); a=c['rot']; d.ellipse([x-12,y-12,x+12,y+12],outline=(0,150,255,255),width=3)
  d.line([x,y,x+int(math.sin(a)*30),y+int(math.cos(a)*30)],fill=(0,150,255,255),width=4)
for c in D['consolas']:
  x,y=P(*c['parede']); d.rectangle([x-14,y-14,x+14,y+14],fill=(255,190,0,255))
  px,py=P(*c['ponto']); d.ellipse([px-int(c['raio']*sx),py-int(c['raio']*sy),px+int(c['raio']*sx),py+int(c['raio']*sy)],outline=(255,190,0,255),width=4)
for c in D['a_construir']: R(c['r'],None,(255,0,0,255),5)
for j in D['janelas']:
  if j['eixo']=='x': R([j['de'],min(j['face_interior'],j['face_exterior']),j['ate'],max(j['face_interior'],j['face_exterior'])],(0,220,255,150))
  else: R([min(j['face_interior'],j['face_exterior']),j['de'],max(j['face_interior'],j['face_exterior']),j['ate']],(0,220,255,150))
out=Image.alpha_composite(im.convert('RGBA'),ov).convert('RGB')
out.save(os.path.join(SAI, 'sobreposicao.jpg'), quality=85)
w=out.width; out.crop((0,0,w//2,out.height//2)).save(os.path.join(SAI, 'sob-zoom1.jpg'))
out.crop((w//2,out.height//2,w,out.height)).save(os.path.join(SAI, 'sob-zoom2.jpg'))
out.resize((w//2,out.height//2)).save(os.path.join(SAI, 'sob-geral.jpg'))
print('imagens em', SAI)
