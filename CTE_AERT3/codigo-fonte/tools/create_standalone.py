from pathlib import Path
import re,base64,json,mimetypes
root=Path(__file__).resolve().parents[1]
dist=root/'dist'
index=(dist/'index.html').read_text(encoding='utf-8-sig')
js_path=re.search(r'<script[^>]+src="([^"]+)"[^>]*></script>',index).group(1)
css_path=re.search(r'<link[^>]+href="([^"]+\.css)"[^>]*>',index).group(1)
js=(dist/js_path.lstrip('/')).read_text(encoding='utf-8')
css=(dist/css_path.lstrip('/')).read_text(encoding='utf-8')
assets={}
for p in (dist/'assets').iterdir():
 if p.suffix.lower() in ['.png','.pdf']:
  mime=mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
  assets['/assets/'+p.name]='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
for key,value in assets.items(): js=js.replace(key,value)
bootstrap='const __cteAssets='+json.dumps(assets,separators=(',',':'))+''';const __cteFetch=window.fetch.bind(window);window.fetch=(input,options)=>__cteFetch(typeof input==='string'&&__cteAssets[input]?__cteAssets[input]:input,options);document.addEventListener('click',async e=>{const a=e.target.closest?.('a');if(a?.href.startsWith('data:application/pdf')){e.preventDefault();const blob=await(await __cteFetch(a.href)).blob(),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='Planta_CTE_AERT3.pdf';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}},true);'''
# O jogo e todas as imagens ficam no próprio HTML. O modo QA continua disponível na distribuição HTTP.
js=re.sub(r'</script',r'<\\/script',bootstrap+js,flags=re.I)
html='<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#132f40"><title>CTE AERT3 · Missão Web</title><style>'+css+'</style></head><body><div id="app"></div><script type="module">'+js+'</script></body></html>'
out=root.parents[1]/'outputs'/'Jogo_CTE_AERT3.html'
out.write_text(html,encoding='utf-8')
print('Standalone:',out.name,'bytes:',out.stat().st_size)
