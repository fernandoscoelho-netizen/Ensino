// Traçado sobre a imagem da planta original (2468 × 1264 px).
// Conversão para unidades virtuais de jogo; não representa cotas certificadas.
const SCALE=40;
export const fromPlan=(px,py)=>({x:(px-800)/SCALE,z:(py-700)/SCALE});
const rect=(x1,y1,x2,y2)=>({...fromPlan((x1+x2)/2,(y1+y2)/2),w:(x2-x1)/SCALE,d:(y2-y1)/SCALE});
const poly=points=>points.map(([x,y])=>fromPlan(x,y));
export const bounds={...rect(318,237,1250,1158),minX:fromPlan(318,237).x,maxX:fromPlan(1250,1158).x,minZ:fromPlan(318,237).z,maxZ:fromPlan(1250,1158).z};
export const entrance={...rect(785,68,942,237),id:'ENTRADA',name:'Entrada do CTE',color:'#d5e1dc'};
export const mapCenter=fromPlan(784,613);
export const SPAWN=fromPlan(870,165);
export const mapRevision=3;
function room(id,name,short,color,box,station,approach,polygon){const r={id,name,short,color,...rect(...box)};r.station=Object.values(fromPlan(...station));r.approach=fromPlan(...approach);if(polygon)r.polygon=poly(polygon);return r;}
export const topics=[
room('E1','HTML semântico','HTML','#e9b45d',[942,237,1250,544],[1060,485],[1060,450]),
room('E2','CSS e apresentação','CSS','#71bfb7',[942,544,1250,848],[980,600],[980,638]),
room('E3','CSS Grid','GRID','#b2a0e8',[800,848,1250,1158],[910,1010],[947,1010],[[875,848],[1250,848],[1250,1158],[800,1158],[800,918],[875,918]]),
room('E4','Flexbox','FLEX','#e2a18b',[318,848,625,1158],[540,935],[500,935]),
room('E5','JavaScript','JS','#a4c783',[318,544,625,848],[540,580],[540,615]),
room('E6','Integração','WEB','#80b4df',[318,237,625,544],[520,385],[520,350])];
export const roomIdentity={
 E1:{name:'Informática',description:'Sala com muitos computadores, para desenvolvimento de projetos e programação.'},
 E2:{name:'Robótica · Dobot',description:'Sala equipada com vários braços robóticos Dobot e zonas de trabalho colaborativo.'},
 E3:{name:'Eletrónica',description:'Bancadas de eletrónica com multímetros, fontes de alimentação e osciloscópios.'},
 E4:{name:'Automação',description:'Sala de automação com painéis de treino, módulos de controlo e ligações de sensores e atuadores.'},
 E5:{name:'Redes e computadores',description:'Sala com bastidores de redes, equipamentos de comunicação e computadores.'},
 E6:{name:'Apresentação de projetos',description:'Espaço para apresentação de projetos, com bancada em meia-lua para os alunos se sentarem e apresentarem.'}
};
for(const r of topics){r.learning=r.name;Object.assign(r,roomIdentity[r.id]);}
export const rooms=[...topics,{id:'E6.1',name:'CNC e impressão 3D',description:'Laboratório de apoio com máquinas CNC e impressoras 3D. Os modelos são ilustrativos; não foram fornecidas referências de fabricante ou modelo.',color:'#bacbc8',...rect(625,237,800,480),approach:fromPlan(710,355),station:Object.values(fromPlan(710,355))},{id:'3.1',name:'Produção de PCB · Bungard',description:'Laboratório de apoio com máquinas Bungard para produção de placas de circuito impresso. Representação ilustrativa do equipamento; os modelos exatos não foram indicados.',color:'#bacbc8',...rect(625,918,800,1158),approach:fromPlan(710,1040),station:Object.values(fromPlan(710,1040))}];
function door(id,room,axis,constant,start,end,hinge,inside,label=id){const d={id,room,axis,...(axis==='v'?{...fromPlan(constant,(start+end)/2),length:(end-start)/SCALE}:{...fromPlan((start+end)/2,constant),length:(end-start)/SCALE}),hinge,inside,label,source:{constant,start,end}};return d;}
export const doors=[
 door('entrada','ENTRADA','h',237,833,906,'start',-1,'Entrada'),
 door('porta-e1','E1','v',942,486,530,'end',1,'E1'),
 door('porta-e2','E2','v',942,798,840,'end',1,'E2'),
 door('porta-e3','E3','h',848,879,920,'start',1,'E3'),
 door('porta-e4','E4','v',625,864,906,'start',-1,'E4'),
 door('porta-e5','E5','v',625,798,840,'end',-1,'E5'),
 door('porta-e6','E6','v',625,486,530,'end',-1,'E6'),
 door('porta-apoio-e6','E6.1','h',480,638,679,'start',-1,'Apoio E6.1'),
 door('porta-apoio-3','3.1','h',918,638,680,'start',1,'Apoio 3.1'),
 door('porta-apoio-3-e3','3.1','v',800,930,972,'start',1,'Ligação 3.1 / E3'),
 door('porta-escada','ESCADA','h',642,790,865,'start',-1,'Escadas'),
 door('porta-arrumacao','ARRUMACAO','v',705,798,838,'end',1,'Arrumação'),
 door('porta-patamar','PATAMAR','v',705,858,899,'start',1,'Patamar')
];
export const walls=[],furniture=[];
function run(axis,constant,start,end,thickness=10){const gaps=doors.filter(d=>d.axis===axis&&d.source.constant===constant&&d.source.start>=start&&d.source.end<=end).sort((a,b)=>a.source.start-b.source.start);let cursor=start;const segment=(a,b)=>{if(b<=a)return;walls.push(axis==='v'?{...rect(constant-thickness/2,a,constant+thickness/2,b),source:{axis,constant,start:a,end:b}}:{...rect(a,constant-thickness/2,b,constant+thickness/2),source:{axis,constant,start:a,end:b}});};for(const d of gaps){segment(cursor,d.source.start);cursor=d.source.end;}segment(cursor,end);}
// Paredes exteriores e vestíbulo da entrada.
run('h',237,318,1250,16);run('h',1158,318,1250,16);run('v',318,237,1158,16);run('v',1250,237,1158,16);
run('v',785,68,237,10);run('v',942,68,237,10);run('h',68,785,942,10);
// Salas E1/E2 e ala esquerda: os vãos são recortados nas posições do desenho.
run('v',942,237,848,12);run('h',544,942,1250,12);run('h',848,875,1250,12);
run('v',625,237,1158,12);run('h',544,318,625,12);run('h',848,318,625,12);
// Apoios: E6.1 abre em baixo; 3.1 abre em cima e também para E3.
run('v',800,237,480,12);run('h',480,625,800,12);run('v',800,918,1158,12);run('h',918,625,800,12);
// Núcleo central: lanço de escada, arrumação e patamar.
run('h',642,705,875,10);run('v',705,642,912,10);run('v',875,642,918,10);run('v',786,642,846,8);run('h',755,705,786,8);run('h',846,705,786,10);run('h',912,705,875,10);
export const stairs={...rect(791,646,869,839),direction:1,steps:12,rise:.105,label:'Subir'};
furniture.push({...stairs,type:'stairs'});
function table(id,px,py,w,d,type='desk',shape='rect',seats=[]){furniture.push({room:id,...fromPlan(px,py),w:w/SCALE,d:d/SCALE,type,shape,seats:seats.map(([x,y,a=0])=>({...fromPlan(x,y),rotation:a}))});}
function sideSeats(x,y,span,count,side='z'){return Array.from({length:count},(_,i)=>side==='z'?[x-span/2+span*(i+.5)/count,y,0]:[x,y-span/2+span*(i+.5)/count,Math.PI/2]);}
// E1: bancadas perimetrais e grupo central, como na referência.
table('E1',966,360,26,230,'bench','rect',sideSeats(989,360,205,6,'x'));
table('E1',1096,263,145,24,'bench','rect',sideSeats(1096,288,130,4));
table('E1',1220,360,26,230,'bench','rect',sideSeats(1198,360,205,6,'x'));
table('E1',1114,357,76,148,'desk','rect',[...sideSeats(1057,357,120,3,'x'),...sideSeats(1170,357,120,3,'x')]);
// E2: duas mesas colaborativas, com orientações diferentes.
table('E2',1100,580,160,36,'bench');
table('E2',1050,712,130,52,'desk','rect',[...sideSeats(1050,671,110,4),...sideSeats(1050,753,110,4)]);
table('E2',1190,750,64,82,'desk','rect',[...sideSeats(1144,750,65,2,'x'),...sideSeats(1232,750,65,2,'x')]);
// E3: quatro ilhas de trabalho e zona do professor junto ao apoio.
for(const x of [1027,1150])for(const y of [908,1093])table('E3',x,y,90,104,'desk','rect',[...sideSeats(x-58,y,75,2,'x'),...sideSeats(x+58,y,75,2,'x')]);
table('E3',835,1040,58,48,'desk');
// E4: filas de bancadas duplas e bancada lateral.
for(const y of [877,1007,1128])for(const x of [464,539])table('E4',x,y,72,28,'desk','rect',[...sideSeats(x,y+28,60,2),...(y>900?sideSeats(x,y-28,60,2):[])]);
table('E4',604,1030,24,220,'bench','rect',sideSeats(580,1030,185,6,'x'));table('E4',366,1040,48,44,'desk');
// E5: filas longitudinais e bancada inferior.
for(const x of [474,512])table('E5',x,675,28,145,'desk','rect',sideSeats(x+(x<500?-28:28),675,120,3,'x'));
table('E5',364,691,26,120,'bench','rect',sideSeats(390,691,95,3,'x'));table('E5',605,665,24,230,'bench','rect',sideSeats(581,665,200,6,'x'));table('E5',451,817,220,24,'bench','rect',sideSeats(451,791,190,6));table('E5',364,565,60,36,'desk');
// E6: dois núcleos circulares, mesa curva e bancadas.
for(const y of [309,391])table('E6',391,y,65,65,'desk','round',Array.from({length:6},(_,i)=>[391+48*Math.cos(i*Math.PI/3),y+48*Math.sin(i*Math.PI/3),i*Math.PI/3]));
table('E6',479,462,118,66,'desk','arc',Array.from({length:6},(_,i)=>{const a=Math.PI*(i+.5)/6;return[479+78*Math.cos(a),462-53*Math.sin(a),-a];}));table('E6',510,270,92,26,'bench','rect',sideSeats(510,295,78,2));table('E6',603,346,24,190,'bench','rect',sideSeats(580,346,155,4,'x'));
// Bancadas de apoio e estações ficcionais de aprendizagem.
for(const [id,y,d]of[['E6.1',355,180],['3.1',1040,180]]){table(id,650,y,22,d,'bench');table(id,779,y,22,d,'bench');}
for(const r of topics)furniture.push({x:r.station[0],z:r.station[1],w:1.2,d:.65,type:'station',room:r.id});
// Equipamento identificado pelo utilizador. Geometrias genéricas, sem alegar modelos exatos.
export const equipment=[];
const device=(room,type,px,py,rotation=0,extra={})=>equipment.push({room,type,...fromPlan(px,py),rotation,...extra});
for(let i=0;i<6;i++){device('E1','computer',966,270+i*36,Math.PI/2);device('E1','computer',1220,270+i*36,-Math.PI/2);}
for(let i=0;i<4;i++)device('E1','computer',1045+i*34,263);
for(let i=0;i<3;i++){device('E1','computer',1097,307+i*49,Math.PI/2);device('E1','computer',1130,307+i*49,-Math.PI/2);}
for(const x of [1045,1100,1155])device('E2','robot',x,580,0,{brand:'DOBOT'});
for(const x of [1008,1050,1092])device('E2','robot',x,712,0,{brand:'DOBOT'});
for(const y of [730,773])device('E2','robot',1190,y,Math.PI/2,{brand:'DOBOT'});
for(const x of [1027,1150])for(const y of [908,1093]){device('E3','oscilloscope',x+17,y-25);device('E3','power',x-20,y-25);device('E3','multimeter',x+5,y+25);}
for(const x of [464,539])for(const y of [877,1007,1128])device('E4','automation',x,y);
for(const x of [420,460,500]){const r={...fromPlan(x,565),w:.7,d:.75,type:'rack',room:'E5'};furniture.push(r);device('E5','rack',x,565,0,{floor:true});}
for(const x of [474,512])for(const y of [625,675,725])device('E5','computer',x,y,x<500?-Math.PI/2:Math.PI/2);
for(const y of [580,635,690,745])device('E5','computer',605,y,-Math.PI/2);
for(const x of [365,420,475,530])device('E5','computer',x,817,Math.PI);
device('E6','presentation',479,514,Math.PI,{floor:true});
for(const y of [300,390]){device('E6.1','cnc',650,y,Math.PI/2);device('E6.1','printer',779,y,-Math.PI/2);}
for(const y of [990,1090]){device('3.1','pcb',650,y,Math.PI/2,{brand:'BUNGARD'});device('3.1','pcb',779,y,-Math.PI/2,{brand:'BUNGARD'});}
export const windows=[...[[410,237,115,'h'],[542,237,95,'h'],[709,237,125,'h'],[1065,237,120,'h'],[1193,237,90,'h'],[422,1158,135,'h'],[543,1158,96,'h'],[954,1158,120,'h'],[1114,1158,150,'h'],[318,370,120,'v'],[318,610,95,'v'],[318,749,100,'v'],[318,960,100,'v'],[318,1090,95,'v'],[1250,400,110,'v'],[1250,650,110,'v'],[1250,770,90,'v'],[1250,1030,150,'v']].map(([x,y,length,axis])=>({...fromPlan(x,y),length:length/SCALE,axis}))];
export function pointInPolygon(x,z,points){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a.z>z)!==(b.z>z)&&x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)inside=!inside;}return inside;}
export function roomAt(x,z){return rooms.find(r=>r.polygon?pointInPolygon(x,z,r.polygon):Math.abs(x-r.x)<r.w/2&&Math.abs(z-r.z)<r.d/2);}
export function overlaps(x,z,o,r=.22){if(o.shape==='round')return Math.hypot(x-o.x,z-o.z)<o.w/2+r;return Math.abs(x-o.x)<o.w/2+r&&Math.abs(z-o.z)<o.d/2+r;}
export const entryDoor=doors.find(d=>d.id==='entrada');
export const entryBarrier={x:entryDoor.x,z:entryDoor.z,w:entryDoor.length,d:.18};
export function canStand(x,z,objects=[],gateLocked=false){const inside=(x>bounds.minX+.22&&x<bounds.maxX-.22&&z>bounds.minZ&&z<bounds.maxZ-.22)||(Math.abs(x-entrance.x)<entrance.w/2-.22&&z>entrance.z-entrance.d/2+.22&&z<bounds.minZ+.3);return inside&&(!gateLocked||!overlaps(x,z,entryBarrier))&&!walls.some(o=>overlaps(x,z,o))&&!furniture.some(o=>overlaps(x,z,o))&&!objects.some(o=>overlaps(x,z,{...o,w:1,d:1}));}
export function nearestStation(x,z){return rooms.filter(r=>r.station).map(r=>({...r,distance:Math.hypot(x-r.station[0],z-r.station[1])})).sort((a,b)=>a.distance-b.distance)[0];}
export function pathTo(start,goal,objects=[],gateLocked=false){const step=.2,key=(x,z)=>`${x},${z}`,sx=Math.round(start.x/step),sz=Math.round(start.z/step),gx=Math.round(goal.x/step),gz=Math.round(goal.z/step),queue=[[sx,sz]],seen=new Map([[key(sx,sz),null]]);let end;for(let i=0;i<queue.length&&i<30000;i++){const[x,z]=queue[i];if(Math.hypot(x-gx,z-gz)<1.25){end=[x,z];break;}for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(!seen.has(k)&&canStand(nx*step,nz*step,objects,gateLocked)){seen.set(k,[x,z]);queue.push([nx,nz]);}}}if(!end)return[];const path=[];for(let p=end;p;p=seen.get(key(...p)))path.unshift({x:p[0]*step,z:p[1]*step});return path;}
const zones={E1:[1148,486],E2:[1165,660],E3:[1100,1005],E4:[470,940],E5:[410,600],E6:[490,300]};
export const buildingZones=topics.map(r=>({room:r.id,...fromPlan(...zones[r.id]),w:2.25,d:1.3}));
export function validPlacement(o,objects=[]){const zone=buildingZones.find(z=>z.room===o.room);return !!zone&&Math.abs(o.x-zone.x)<=zone.w/2-.45&&Math.abs(o.z-zone.z)<=zone.d/2-.45&&canStand(o.x,o.z,objects)&&topics.every(r=>Math.hypot(o.x-r.station[0],o.z-r.station[1])>1.1);}
export function doorTrace(d){const vertical=d.axis==='v',end=d.hinge==='end',hinge={x:d.x+(vertical?0:(end?1:-1)*d.length/2),z:d.z+(vertical?(end?1:-1)*d.length/2:0)},closed={x:hinge.x+(vertical?0:(end?-1:1)*d.length),z:hinge.z+(vertical?(end?-1:1)*d.length:0)},open={x:hinge.x+(vertical?d.inside*d.length:0),z:hinge.z+(vertical?0:d.inside*d.length)};return{hinge,closed,open};}

export function doorLeaves(d){if(!['entrada','porta-escada'].includes(d.id))return[d];return[-1,1].map(sign=>({...d,length:d.length/2,x:d.x+(d.axis==='h'?sign*d.length/4:0),z:d.z+(d.axis==='v'?sign*d.length/4:0),hinge:sign<0?'start':'end'}));}
