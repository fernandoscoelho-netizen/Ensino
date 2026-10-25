import * as THREE from 'three';
export function buildEquipment(scene,items,box,mat){
 const brands=new Map();
 function cylinder(parent,x,y,z,r,h,color,rTop=r){const m=new THREE.Mesh(new THREE.CylinderGeometry(rTop,r,h,12),mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
 function ball(parent,x,y,z,r,color){const m=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),mat(color));m.position.set(x,y,z);parent.add(m);return m;}
 function rod(parent,a,b,r,color){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,start.distanceTo(end),10),mat(color));m.position.copy(start).add(end).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());m.castShadow=true;parent.add(m);}
 function brand(parent,text,x,y,z,w=.55,h=.15){let texture=brands.get(text);if(!texture){const c=document.createElement('canvas');c.width=256;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#183f4e';ctx.fillRect(0,0,256,64);ctx.fillStyle='#f6faf1';ctx.font='bold 31px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,128,34);texture=new THREE.CanvasTexture(c);brands.set(text,texture);}const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));p.position.set(x,y,z);parent.add(p);}
 const green=mat('#74d7b2',{emissive:'#369b73',emissiveIntensity:.12}),blue=mat('#8ed9e8',{emissive:'#469dba',emissiveIntensity:.15});
 for(const item of items){const g=new THREE.Group();g.position.set(item.x,item.floor?0:.84,item.z);g.rotation.y=item.rotation;scene.add(g);const b=(x,y,z,w,h,d,c)=>box(x,y,z,w,h,d,c,g);
 if(item.type==='computer'){b(0,.23,0,.56,.36,.07,'#213f4c');b(0,.23,.041,.49,.28,.01,blue);b(0,.04,0,.06,.15,.06,'#475f68');b(0,.015,.03,.24,.025,.14,'#475f68');b(0,.008,.23,.42,.025,.15,'#667d83');b(.28,.01,.23,.065,.025,.09,'#253e4a');for(let i=0;i<3;i++)b(-.16+i*.13,.24,.049,.08,.035,.004,'#cae9ce');}
 if(item.type==='robot'){
  cylinder(g,0,.06,0,.2,.12,'#384e55');cylinder(g,0,.17,0,.13,.14,'#edf0e9');
  const a=[0,.29,0],c=[.18,.63,0],e=[.45,.55,.06],tip=[.5,.37,.11];
  for(const p of [a,c,e])ball(g,...p,.09,'#dce2de');rod(g,a,c,.07,'#dfe4dd');rod(g,c,e,.065,'#dfe4dd');rod(g,e,tip,.038,'#d58b3d');ball(g,...tip,.055,'#354f59');
  b(.47,.3,.11,.025,.13,.035,'#1a3c47');b(.55,.3,.11,.025,.13,.035,'#1a3c47');brand(g,'DOBOT',0,.12,.18,.28,.07);
 }
 if(item.type==='oscilloscope'){b(0,.18,0,.68,.36,.3,'#eeeade');b(-.1,.2,.155,.35,.24,.012,'#173942');for(let i=0;i<3;i++)cylinder(g,.22,.12+i*.09,.17,.027,.025,'#789b99');const points=[];for(let i=0;i<40;i++)points.push(new THREE.Vector3(-.25+i*.008,.2+Math.sin(i*.36)*.06,.166));g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#a0ecc4'})));brand(g,'OSC',-.08,.04,.16,.26,.055);}
 if(item.type==='power'){b(0,.17,0,.48,.34,.3,'#e4e6df');b(0,.23,.158,.32,.1,.012,green);b(-.12,.1,.17,.045,.045,.025,'#d45f55');b(.12,.1,.17,.045,.045,.025,'#283f48');brand(g,'0–30 V',0,.23,.17,.29,.075);}
 if(item.type==='multimeter'){b(0,.035,0,.24,.07,.4,'#e7b948');b(0,.073,-.09,.18,.015,.13,green);cylinder(g,0,.075,.06,.055,.02,'#2e454d');const points=[new THREE.Vector3(-.07,.05,.18),new THREE.Vector3(-.2,.02,.35),new THREE.Vector3(-.3,.02,.2)];g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#d85d52'})));}
 if(item.type==='automation'){b(0,.015,0,1.3,.04,.56,'#869b9d');b(0,.43,-.12,1.3,.84,.08,'#b9c9c9');for(const y of [.25,.55])b(0,y,-.06,1.17,.04,.035,'#dde6df');for(let i=0;i<5;i++){const x=-.47+i*.23;b(x,.57,0,.16,.27,.09,i<2?'#415b62':'#e1e5dd');for(let k=0;k<3;k++)b(x-.045+k*.043,.47,.05,.025,.025,.016,'#c9ae54');}for(let i=0;i<4;i++){b(-.42+i*.28,.18,.02,.13,.16,.08,'#526d73');ball(g,-.42+i*.28,.2,.08,.034,i%2?'#e0a642':'#68ae83');}brand(g,'AUTOMAÇÃO',0,.79,-.07,.7,.09);}
 if(item.type==='rack'){b(0,1.05,0,.7,2.1,.75,'#263d48');b(0,1.08,.39,.58,1.9,.025,'#18333e');for(let i=0;i<9;i++){const y=.26+i*.2;b(0,y,.41,.54,.14,.035,i%3===0?'#627b80':'#304c59');for(let j=0;j<8;j++)b(-.2+j*.055,y,.436,.028,.035,.012,j%2?'#9cce76':'#7ab9a1');}brand(g,'REDE',0,2,.415,.35,.1);}
 if(item.type==='presentation'){b(0,1.12,0,3.4,1.75,.09,'#1c3b48');b(0,1.12,.052,3.15,1.5,.012,blue);brand(g,'PROJETOS · AERT3',0,1.3,.067,2.6,.45);b(0,.17,0,3.7,.28,.8,'#d9c599');b(1.25,.55,.35,.4,.8,.32,'#d4b47b');}
 if(item.type==='cnc'||item.type==='pcb'){
  const pcb=item.type==='pcb';b(0,.04,0,.75,.08,.6,'#718b8c');b(0,.38,-.25,.75,.68,.07,pcb?'#dedfcf':'#d8e1da');for(const x of [-.34,.34])b(x,.38,0,.06,.68,.6,'#a4b6b2');b(0,.74,0,.75,.07,.6,pcb?'#c8d7be':'#d7e1d9');b(0,.18,.02,.58,.05,.42,pcb?'#427b5e':'#6e9292');rod(g,[-.24,.57,-.05],[.24,.57,-.05],.025,'#526b71');b(.08,.49,-.05,.12,.24,.15,'#58777c');b(.08,.34,-.05,.025,.1,.025,'#ccd7d0');if(pcb){for(let i=0;i<4;i++)b(-.17+i*.1,.214,.05,.025,.01,.22,'#d7be61');}brand(g,pcb?'BUNGARD':'CNC',0,.68,.31,.6,.12);
 }
 if(item.type==='printer'){b(0,.04,0,.65,.08,.58,'#37535c');for(const x of [-.29,.29])for(const z of [-.25,.25])b(x,.42,z,.045,.8,.045,'#264a55');b(0,.82,0,.65,.06,.58,'#426874');b(0,.28,0,.53,.035,.46,'#9baeb0');b(0,.58,0,.52,.04,.04,'#d1d9d1');b(.05,.52,0,.09,.12,.09,'#c18a4a');cylinder(g,-.03,.38,0,.12,.17,'#a1d6b6');const spool=new THREE.Mesh(new THREE.TorusGeometry(.17,.035,8,20),mat('#dab875'));spool.position.set(.35,.58,0);spool.rotation.y=Math.PI/2;g.add(spool);brand(g,'3D',0,.09,.3,.25,.09);}
 }
}
