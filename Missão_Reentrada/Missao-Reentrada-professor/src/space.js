import * as THREE from 'three';
// Textura ilustrada original, sem imagens externas ou pedidos de rede.
function earthTexture(){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const c=canvas.getContext('2d');
 const sea=c.createLinearGradient(0,0,0,512);sea.addColorStop(0,'#91b8c1');sea.addColorStop(.25,'#276d96');sea.addColorStop(.6,'#174c79');sea.addColorStop(1,'#0f2b50');c.fillStyle=sea;c.fillRect(0,0,1024,512);
 const continents=[[[60,65],[110,40],[180,65],[235,115],[200,150],[178,180],[140,190],[130,155],[90,155],[70,115]],[[190,205],[240,215],[280,260],[270,305],[245,345],[215,395],[198,340],[200,280],[175,240]],[[420,102],[455,75],[510,90],[538,118],[525,145],[475,155],[450,140]],[[480,165],[535,155],[575,205],[565,255],[535,305],[505,325],[475,270],[458,205]],[[535,105],[580,65],[695,60],[790,85],[845,125],[800,175],[740,165],[710,205],[675,185],[645,155],[590,175]],[[680,180],[710,195],[725,242],[705,260],[685,220]],[[795,305],[850,280],[900,300],[908,345],[870,365],[825,355]],[[500,425],[530,412],[545,445],[525,470]]];
 for(const points of continents){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle='#6d9e93';c.fill();c.strokeStyle='#a6c3ad';c.lineWidth=3;c.stroke();}
 c.fillStyle='#c4d5d2';c.fillRect(0,0,1024,20);c.fillRect(0,485,1024,27);
 let seed=41;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<330;i++){c.save();c.translate(rand()*1024,30+rand()*440);c.rotate(-.4+rand()*.8);c.scale(1,.18+rand()*.25);const r=10+rand()*60,g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(238,245,245,'+(.12+rand()*.5)+')');g.addColorStop(1,'rgba(238,245,245,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();c.restore();}
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=2;return t;
}

function makeStars(count=320){const vertices=[];for(let i=0;i<count;i++)vertices.push(Math.sin(i*81.2)*19,Math.cos(i*41.6)*10,-8-Math.abs(Math.sin(i*32.7))*14);const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));return new THREE.Points(geometry,new THREE.PointsMaterial({size:.022,color:0xc0def3,transparent:true,opacity:.7}));}
function makeEarth(radius){const earth=new THREE.Mesh(new THREE.SphereGeometry(radius,48,32),new THREE.MeshPhongMaterial({map:earthTexture(),shininess:12,specular:0x32658b}));earth.rotation.set(.13,-1.7,-.27);return earth;}
function makeCapsule(){
 const capsule=new THREE.Group();
 const white=new THREE.MeshStandardMaterial({color:0xe7edf2,metalness:.35,roughness:.42}),dark=new THREE.MeshStandardMaterial({color:0x142230,metalness:.7,roughness:.5});
 const points=[[.12,1.05],[.3,1],[.56,.78],[.82,.35],[.96,-.22],[1,-.6]].reverse().map(([x,y])=>new THREE.Vector2(x,y));
 const hull=new THREE.Mesh(new THREE.LatheGeometry(points,48),white);capsule.add(hull);
 const shield=new THREE.Mesh(new THREE.CylinderGeometry(1,1.02,.15,48),dark);shield.position.y=-.68;capsule.add(shield);
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.65,.7,.85,32),dark);trunk.position.y=-1.17;capsule.add(trunk);
 const band=new THREE.Mesh(new THREE.TorusGeometry(.96,.025,8,48),new THREE.MeshStandardMaterial({color:0x9fb6c6,metalness:.8,roughness:.3}));band.rotation.x=Math.PI/2;band.position.y=-.56;capsule.add(band);
 const glass=new THREE.MeshStandardMaterial({color:0x092438,emissive:0x154d65,emissiveIntensity:.45,metalness:.65,roughness:.18});
 for(const angle of [-.52,0,.52]){const window=new THREE.Mesh(new THREE.BoxGeometry(.25,.18,.045),glass);window.position.set(Math.sin(angle)*.83,.26,Math.cos(angle)*.83);window.rotation.y=angle;capsule.add(window);}
 const solar=new THREE.MeshStandardMaterial({color:0x173752,metalness:.6,roughness:.5});for(const side of [-1,1]){const panel=new THREE.Mesh(new THREE.BoxGeometry(.1,.72,.55),solar);panel.position.set(side*.76,-1.12,0);capsule.add(panel);}
 const labelCanvas=document.createElement('canvas');labelCanvas.width=512;labelCanvas.height=128;const c=labelCanvas.getContext('2d');c.fillStyle='#0b2635';c.textAlign='center';c.font='bold 62px sans-serif';c.fillText('AURORA',256,78);const labelMap=new THREE.CanvasTexture(labelCanvas);labelMap.colorSpace=THREE.SRGBColorSpace;
 const label=new THREE.Mesh(new THREE.PlaneGeometry(.65,.16),new THREE.MeshBasicMaterial({map:labelMap,transparent:true,side:THREE.DoubleSide}));label.position.set(0,-.2,.975);capsule.add(label);
 const light=new THREE.Mesh(new THREE.SphereGeometry(.035,8,8),new THREE.MeshBasicMaterial({color:0x86e6f0}));light.position.set(.8,-.3,.4);capsule.add(light);return capsule;
}
function lightScene(scene){scene.add(new THREE.AmbientLight(0x9ec5ed,1.5));const sun=new THREE.DirectionalLight(0xe6f3ff,2.8);sun.position.set(-4,8,8);scene.add(sun);const rim=new THREE.DirectionalLight(0x3aa8db,1.4);rim.position.set(6,-2,-3);scene.add(rim);}
function disposeScene(scene){const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(node=>{if(node.geometry)geometries.add(node.geometry);for(const material of Array.isArray(node.material)?node.material:node.material?[node.material]:[])materials.add(material);});for(const m of materials){if(m.map)textures.add(m.map);m.dispose();}for(const g of geometries)g.dispose();for(const t of textures)t.dispose();}
export function createSpace(canvas,initial,onFailure){
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{onFailure();return{setOptions(){},setView(){},setRecovery(){},setPaused(){}};}
 canvas.parentElement.classList.add('space-ready');renderer.setClearColor(0x000000,0);const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(39,1,.1,70);camera.position.z=8;
 const globe=makeEarth(3.2);globe.position.set(2.25,-2.35,0);scene.add(globe);
 const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(3.24,48,32),new THREE.MeshBasicMaterial({color:0x87d6f7,transparent:true,opacity:.1,side:THREE.BackSide}));atmosphere.position.copy(globe.position);scene.add(atmosphere);lightScene(scene);
 const stars=makeStars();scene.add(stars);
 const capsule=makeCapsule();capsule.scale.setScalar(.36);capsule.position.set(1.3,.12,4.1);capsule.rotation.set(.08,-.48,-.1);capsule.visible=false;scene.add(capsule);
 const cabin=new THREE.Group(),metal=new THREE.MeshStandardMaterial({color:0x182635,metalness:.7,roughness:.45}),trim=new THREE.MeshBasicMaterial({color:0x477383});
 function rail(x,y,w,h,material=metal){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,.16),material);mesh.position.set(x,y,3.15);cabin.add(mesh);}
 rail(-1.77,0,.13,3.45);rail(1.77,0,.13,3.45);rail(0,1.67,3.65,.13);rail(0,-1.67,3.65,.2);rail(0,-1.52,3.45,.012,trim);scene.add(cabin);
 let options=initial,last=0,frame=0,visible=true,paused=false,exterior=false;
 function render(){renderer.render(scene,camera);}
 function resize(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setPixelRatio(options.quality==='low'?1:Math.min(devicePixelRatio,1.5));renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();cabin.scale.x=camera.aspect;capsule.position.x=Math.min(camera.aspect*.65,2.8);render();}
 const observer=new ResizeObserver(resize);observer.observe(canvas.parentElement);
 function tick(time){frame=requestAnimationFrame(tick);if(!visible||paused||document.hidden||options.quality==='2d'||options.reduced)return;if(time-last<1000/(options.quality==='low'?12:24))return;last=time;globe.rotation.y+=.0007;stars.rotation.y+=.000045;globe.position.y=-2.35+Math.sin(time*.00009)*.035;if(exterior){capsule.rotation.y+=.0007;capsule.position.y=.12+Math.sin(time*.0003)*.055;}render();}
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});intersection.observe(canvas);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);canvas.parentElement.classList.remove('space-ready');onFailure();});resize();frame=requestAnimationFrame(tick);
 return{setOptions(next){options=next;resize();},setView(value){exterior=value==='exterior';capsule.visible=exterior;cabin.visible=!exterior;render();},setRecovery(value){trim.color.set(value>=1?0x88dec2:0x477383);render();},setPaused(value){paused=value;},dispose(){cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();disposeScene(scene);renderer.dispose();}};
}
export function createOpening(canvas,options,onReady=()=>{}){
 if(options.quality==='2d'){onReady();return{supported:false,skip:onReady,dispose(){}};}
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{onReady();return{supported:false,skip:onReady,dispose(){}};}
 renderer.setClearColor(0x000000,0);renderer.setPixelRatio(options.quality==='low'?1:Math.min(devicePixelRatio,1.25));const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,70);const stars=makeStars(260),earth=makeEarth(4),capsule=makeCapsule();scene.add(stars);earth.position.set(4,-4.6,-6);scene.add(earth);capsule.rotation.set(.1,-.6,-.12);scene.add(capsule);lightScene(scene);
 let frame=0,done=false,disposed=false;const started=performance.now();
 function position(p){const eased=1-Math.pow(1-p,3);camera.position.set(0,.3,8.5-eased*2.8);camera.lookAt(0,-.1,0);capsule.position.x=1.2*(1-eased);capsule.rotation.y=-.6+eased*.28;stars.rotation.y=p*.018;}
 function render(){renderer.render(scene,camera);}
 function resize(){const r=canvas.parentElement.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();render();}
 function finish(){if(disposed)return;done=true;cancelAnimationFrame(frame);position(1);render();onReady();}
 function tick(now){if(disposed||done)return;const p=Math.min(1,(now-started)/3800);position(p);render();if(p<1)frame=requestAnimationFrame(tick);else finish();}
 const observer=new ResizeObserver(resize);observer.observe(canvas.parentElement);position(options.reduced?1:0);resize();if(options.reduced)finish();else frame=requestAnimationFrame(tick);
 return{supported:true,skip:finish,dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();disposeScene(scene);renderer.dispose();}};
}
