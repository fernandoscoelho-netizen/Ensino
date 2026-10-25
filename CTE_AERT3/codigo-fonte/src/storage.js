import {allMissions} from './missions.js';
import {canStand,validPlacement,SPAWN,mapRevision,buildingZones} from './map.js';
const KEY='cte-aert3-progress-v1';
export const blank=()=>({version:1,mapRevision,completed:[],consulted:[],drafts:{},position:{...SPAWN},objects:[],discovered:[],settings:{view:'3d',camera:'third',quality:'medium',reduced:false,sound:false,interact:'e'}});
export function validateSave(raw){
 if(!raw||raw.version!==1||!Array.isArray(raw.completed)||!Array.isArray(raw.consulted)||!Array.isArray(raw.objects)||!raw.drafts||typeof raw.drafts!=='object')throw new Error('Formato de progresso inválido.');
 const out=blank(),ids=new Set(allMissions.map(m=>m.id));
 for(const field of ['completed','consulted']){if(raw[field].some(id=>!ids.has(id)))throw new Error('Missão desconhecida.');out[field]=[...new Set(raw[field])];}
 for(const [id,c]of Object.entries(raw.drafts)){if(!ids.has(id)||!c||['html','css','js'].some(k=>typeof c[k]!=='string'||c[k].length>100000))throw new Error('Código guardado inválido.');out.drafts[id]={html:c.html,css:c.css,js:c.js};}
 if(raw.objects.length>30)throw new Error('Demasiados objetos.');
 const migrating=raw.mapRevision!==mapRevision;
 for(const original of raw.objects){const o={...original};if(migrating){const zone=buildingZones.find(z=>z.room===o.room);if(!zone)continue;const placed=out.objects.filter(x=>x.room===o.room).length;if(placed>1)continue;o.x=zone.x+(placed? .5:-.5);o.z=zone.z;}
 if(!o||!['plinth','screen','plant'].includes(o.type)||![o.x,o.z,o.rotation].every(Number.isFinite)||!validPlacement(o,out.objects))throw new Error('Objeto fora da zona de construção.');out.objects.push({...o});}
 if(!migrating&&raw.position&&Number.isFinite(raw.position.x)&&Number.isFinite(raw.position.z)&&canStand(raw.position.x,raw.position.z,out.objects))out.position={x:raw.position.x,z:raw.position.z};
 out.discovered=Array.isArray(raw.discovered)?raw.discovered.filter(x=>/^E[1-6]$/.test(x)):[];
 const s=raw.settings??{};for(const k of ['view','camera','quality'])if({view:['2d','3d'],camera:['first','third'],quality:['low','medium','high']}[k].includes(s[k]))out.settings[k]=s[k];
 for(const k of ['sound','reduced'])out.settings[k]=s[k]===true;
 if(typeof s.interact==='string'&&/^[a-z]$/.test(s.interact)&&!['w','a','s','d','m','q','r'].includes(s.interact))out.settings.interact=s.interact;
 return out;
}
export function load(){let parsed;try{const raw=localStorage.getItem(KEY);parsed=raw?JSON.parse(raw):null;return {state:parsed?validateSave(parsed):blank(),recovered:false};}catch{if(parsed){try{return {state:validateSave({...parsed,mapRevision:0}),recovered:false};}catch{}}return {state:blank(),recovered:true};}}
export function persist(state){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
