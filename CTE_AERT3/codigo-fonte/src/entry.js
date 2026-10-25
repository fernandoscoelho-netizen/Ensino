import {SPAWN} from './map.js';
export function beginSession(state){state.position={...SPAWN};return state;}
export const ENTRY_STARTER='<___ id="entrar-cte">Entrar no CTE</___>';
export function checkEntryDocument(doc){const found=doc.querySelector('#entrar-cte'),label=found?.textContent.replace(/\s+/g,' ').trim().toLowerCase();return [
 {ok:found?.localName==='button',message:'Usar o elemento HTML button.'},
 {ok:doc.querySelectorAll('#entrar-cte').length===1&&found?.localName==='button',message:'Dar ao botão o identificador entrar-cte.'},
 {ok:label==='entrar no cte',message:'Mostrar o texto Entrar no CTE.'},
 {ok:!!found&&found.localName==='button'&&!found.hasAttribute('disabled'),message:'O botão deve estar ativo.'}
];}
