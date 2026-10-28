// Validação comportamental. Função independente para execução no sandbox.
export async function checkLesson(id, source, doc, win, requestedWidth=null) {
  const rows=[];
  const add=(ok,label)=>rows.push({ok:Boolean(ok),label});
  const q=s=>doc.querySelector(s);
  const all=s=>Array.from(doc.querySelectorAll(s));
  const text=e=>(e?.textContent||'').trim();
  const style=e=>e?win.getComputedStyle(e):null;
  const cols=e=>(style(e)?.gridTemplateColumns.match(/[0-9.]+px/g)||[]).length;
  const click=e=>e?.click();
  const wait=()=>new Promise(r=>win.setTimeout(r,20));
  if(id===1){
    add(/^\s*<!doctype\s+html\s*>/i.test(source),'Documento com declaração HTML5.');
    add(/^pt(?:-|$)/i.test(doc.documentElement.lang),'Idioma português definido no elemento html.');
    add((q('meta[charset]')?.getAttribute('charset')||'').toLowerCase()==='utf-8','Codificação UTF-8 definida.');
    add(text(q('title')).length>=3,'Título do documento preenchido.');
    add(text(q('h1')).length>=3,'Título principal apresentado.');
    add(text(q('p')).length>=8,'Mensagem de identificação apresentada.');
  }
  if(id===2){
    add(Boolean(q('main section h2')),'Conteúdo organizado numa secção com título.');
    add(all('ol li, ul li').length>=3,'Lista com pelo menos três procedimentos.');
    add(all('a[href]').some(e=>/^https:\/\//.test(e.getAttribute('href'))&&text(e).length>=5),'Ligação externa com texto descritivo.');
    add(all('img').some(e=>(e.getAttribute('src')||'').length>0&&(e.getAttribute('alt')||'').trim().length>=5),'Imagem com origem e descrição alternativa.');
  }
  if(id===3){
    add(all('table thead th').length>=2,'Cabeçalho com pelo menos duas colunas.');
    add(all('table tbody tr').filter(e=>e.querySelectorAll('td').length>=2).length>=2,'Corpo da tabela com duas linhas de dados.');
    add(all('form input').some(e=>e.id&&all('form label').some(l=>l.htmlFor===e.id)),'Campo do formulário associado a uma etiqueta.');
    add(Boolean(q('form input[required]')),'Campo obrigatório definido.');
    add(Boolean(q('form button[type="submit"], form input[type="submit"]')),'Comando de envio presente.');
  }
  if(id===4){
    const c=q('.cartao'),s=style(c);
    add(Boolean(c?.querySelector('h2')&&c.querySelector('p')&&c.querySelector('button')),'Cartão com título, informação e botão.');
    add(s?.boxSizing==='border-box','Dimensões calculadas com border-box.');
    add(s&&['paddingTop','paddingRight','paddingBottom','paddingLeft'].every(k=>parseFloat(s[k])>=16),'Espaçamento interior de pelo menos 16 px.');
    add(s&&parseFloat(s.borderTopWidth)>0&&s.borderTopStyle!=='none','Contorno visível.');
    add(s&&parseFloat(s.borderTopLeftRadius)>0,'Cantos arredondados.');
    add(s&&s.backgroundColor!=='rgba(0, 0, 0, 0)'&&s.backgroundColor!=='transparent','Fundo próprio no cartão.');
  }
  if(id===5){
    const p=q('.cartoes'),s=style(p),items=p?Array.from(p.children):[];
    add(s?.display==='flex','Flexbox aplicado ao contentor.');
    add(items.length>=3&&items.every(e=>e.classList.contains('cartao')),'Três cartões como filhos diretos.');
    add(s&&parseFloat(s.columnGap)>=12,'Espaço entre cartões de pelo menos 12 px.');
    add(s?.flexWrap==='wrap','Quebra de linha permitida.');
    add(s&&s.justifyContent!=='normal'&&s.alignItems!=='normal','Alinhamento definido nos dois eixos.');
    add(items.length>=3&&items.every(e=>parseFloat(style(e).flexGrow)>0),'Cartões crescem para repartir o espaço.');
  }
  if(id===6){
    const p=q('.painel'),s=style(p);
    add(s?.display==='grid','Grid aplicado ao painel.');
    add(p?.querySelectorAll('.cartao').length>=6,'Seis instrumentos presentes.');
    add(cols(p)===3,'Grelha com três colunas na largura de teste.');
    add(s&&parseFloat(s.columnGap)>=12,'Espaçamento de pelo menos 12 px.');
    add(/span 2/.test((style(q('.destaque'))?.gridColumnEnd||'')+' '+(style(q('.destaque'))?.gridColumnStart||'')),'Instrumento destacado ocupa duas colunas.');
  }
  if(id===7){
    const width=win.innerWidth,expected=(requestedWidth||width)<=480?1:(requestedWidth||width)<=768?2:3;
    if(requestedWidth)add(width===requestedWidth,'Largura de teste exata: '+requestedWidth+' px (medida: '+width+' px).');
    const p=q('.painel');
    add(Boolean(q('meta[name="viewport"]')),'Meta viewport presente.');
    add(style(p)?.display==='grid'&&cols(p)===expected,width+' px: '+expected+' coluna(s).');
    add(doc.documentElement.scrollWidth<=width+2,width+' px: sem deslocamento horizontal.');
    if(width<=480)add(!/span 2/.test((style(q('.destaque'))?.gridColumnEnd||'')+' '+(style(q('.destaque'))?.gridColumnStart||'')),'Destaque ajustado na largura mais estreita.');
  }
  if(id===8){
    const e=q('#estado'),b=q('#ligar'),before=text(e);
    add(Boolean(e&&b),'Elementos de estado e comando presentes.');
    add(before==='Sem ligação','Estado inicial preservado antes do clique.');
    click(b);await wait();
    add(text(e).toLowerCase()==='ligação estabelecida','O clique estabelece a ligação e atualiza a mensagem.');
  }
  if(id===9){
    const e=q('#detalhes'),b=q('#alternar');
    add(Boolean(e&&b),'Comando e detalhes presentes.');
    add(e?.classList.contains('escondido')&&style(e)?.display==='none','Detalhes inicialmente escondidos.');
    click(b);await wait();
    add(e&&!e.classList.contains('escondido')&&style(e).display!=='none','Primeiro clique mostra os detalhes.');
    add(text(b)==='Ocultar detalhes','Texto do comando acompanha a abertura.');
    click(b);await wait();
    add(e?.classList.contains('escondido')&&style(e)?.display==='none'&&text(b)==='Mostrar detalhes','Segundo clique repõe o estado e o texto iniciais.');
  }
  if(id===10){
    const inputs=['energia','escudo','rota'].map(x=>q('#'+x)),b=q('#reentrar');
    add(inputs.every(Boolean)&&Boolean(b),'Três requisitos e comando presentes.');
    if(inputs.every(Boolean)&&b){
      for(let mask=0;mask<8;mask++){
        inputs.forEach((e,i)=>{e.checked=Boolean(mask&(1<<i));e.dispatchEvent(new win.Event('change',{bubbles:true}));});await wait();
        add(b.disabled!==(mask===7),'Requisitos '+inputs.map(e=>e.checked?'✓':'–').join(' / ')+': comando '+(mask===7?'disponível.':'bloqueado.'));
      }
      click(b);await wait();add(text(q('#mensagem'))==='Reentrada autorizada','Autorização apresentada após o clique.');
      inputs[0].checked=false;inputs[0].dispatchEvent(new win.Event('change',{bubbles:true}));await wait();
      add(b.disabled,'Retirar um requisito volta a bloquear o comando.');
    }
  }
  if(id===11){
    add(all('.painel .cartao').length>=7,'Painel com pelo menos sete cartões.');
    add(style(q('.painel'))?.display==='grid','Grid mantido no painel.');
    add(style(q('.cartao.reserva'))?.display==='flex','Flexbox utilizado no cartão de reserva.');
    add(text(q('#resultado'))==='Por testar','Reserva inicialmente por testar.');
    click(q('#testar'));await wait();add(text(q('#resultado'))==='Reserva operacional','Comando confirma a reserva.');
  }
  if(id===12){
    add(text(q('h1')).length>3,'Relatório com título principal.');
    add(all('section').filter(e=>text(e.querySelector('h2')).length>2&&text(e.querySelector('p')).length>=20).length>=3,'Três secções com títulos e explicações.');
    add(all('a[href]').some(e=>/^https:\/\//.test(e.getAttribute('href'))&&text(e).length>3),'Referência externa identificada.');
  }
  return rows;
}
