import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createCapsule} from './capsule.js';
import {EARTH_IMAGE} from './earth-map.js';
// Textura NASA local: sem pedidos à Internet durante a utilização.
function earthTexture(onReady=()=>{}){const texture=new THREE.TextureLoader().load(EARTH_IMAGE,onReady);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;return texture;}
function cloudTexture(){const c=document.createElement('canvas');c.width=2048;c.height=1024;const x=c.getContext('2d');let seed=151;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<210;i++){const cx=random()*2048,cy=50+random()*920,a=random()*6.28,r=15+random()*80;for(let j=0;j<22;j++){const t=a+j*.1,rr=3+random()*8,xx=cx+Math.cos(t)*r,yy=cy+Math.sin(t)*r*.45;x.save();x.translate(xx,yy);x.rotate(a);x.scale(1.7,.65);const g=x.createRadialGradient(0,0,0,0,0,rr);g.addColorStop(0,'rgba(255,255,255,'+(.25+random()*.45)+')');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(-rr,-rr,rr*2,rr*2);x.restore();}}const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;return map;}
function atmosphere(radius){return new THREE.Mesh(new THREE.SphereGeometry(radius,64,40),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{tint:{value:new THREE.Color(0x559fde)}},vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n;varying vec3 v;uniform vec3 tint;void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(v))),3.5);gl_FragColor=vec4(tint,rim*.4);}' }));}
function setupRenderer(renderer,scene){renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();return environment;}
function makeStars(count=320){const vertices=[];for(let i=0;i<count;i++)vertices.push(Math.sin(i*81.2)*19,Math.cos(i*41.6)*10,-8-Math.abs(Math.sin(i*32.7))*14);const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));return new THREE.Points(geometry,new THREE.PointsMaterial({size:.022,color:0xc0def3,transparent:true,opacity:.7}));}
function makeEarth(radius,onReady){const earth=new THREE.Mesh(new THREE.SphereGeometry(radius,80,56),new THREE.MeshPhongMaterial({map:earthTexture(onReady),shininess:6,specular:0x172d3d}));earth.rotation.set(.13,-1.7,-.2);return earth;}
function makeCapsule(){return createCapsule();}
function lightScene(scene){scene.add(new THREE.AmbientLight(0x9ec5ed,.85));const sun=new THREE.DirectionalLight(0xe6f3ff,2.8);sun.position.set(-4,8,8);scene.add(sun);const rim=new THREE.DirectionalLight(0x3aa8db,.6);rim.position.set(6,-2,-3);scene.add(rim);}
function disposeScene(scene){const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(node=>{if(node.geometry)geometries.add(node.geometry);for(const material of Array.isArray(node.material)?node.material:node.material?[node.material]:[])materials.add(material);});for(const m of materials){if(m.map)textures.add(m.map);m.dispose();}for(const g of geometries)g.dispose();for(const t of textures)t.dispose();}
export function createSpace(canvas,initial,onFailure){
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{onFailure();return{setOptions(){},setView(){},setRecovery(){},setPaused(){}};}
 canvas.parentElement.classList.add('space-ready');renderer.setClearColor(0x000000,0);const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(39,1,.1,70);camera.position.z=8;const studio=setupRenderer(renderer,scene);
 const globe=makeEarth(3.2,()=>render());globe.position.set(2.25,-2.35,0);scene.add(globe);
 const halo=atmosphere(3.245);halo.position.copy(globe.position);scene.add(halo);const clouds=new THREE.Mesh(new THREE.SphereGeometry(3.215,64,40),new THREE.MeshPhongMaterial({map:cloudTexture(),transparent:true,opacity:.66,depthWrite:false,shininess:0}));clouds.position.copy(globe.position);clouds.rotation.copy(globe.rotation);scene.add(clouds);lightScene(scene);
 const stars=makeStars();scene.add(stars);
 const capsule=makeCapsule();capsule.scale.setScalar(.4);capsule.position.set(1.3,.12,4.1);capsule.rotation.set(.1,-.62,-.18);capsule.visible=false;scene.add(capsule);
 const cabin=new THREE.Group(),metal=new THREE.MeshStandardMaterial({color:0x182635,metalness:.7,roughness:.45}),trim=new THREE.MeshBasicMaterial({color:0x477383});
 function rail(x,y,w,h,material=metal){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,.16),material);mesh.position.set(x,y,3.15);cabin.add(mesh);}
 rail(-1.77,0,.13,3.45);rail(1.77,0,.13,3.45);rail(0,1.67,3.65,.13);rail(0,-1.67,3.65,.2);rail(0,-1.52,3.45,.012,trim);scene.add(cabin);
 let options=initial,last=0,frame=0,visible=true,paused=false,exterior=false;
 function render(){renderer.render(scene,camera);}
 function resize(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setPixelRatio(options.quality==='low'?1:Math.min(devicePixelRatio,1.5));renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();cabin.scale.x=camera.aspect;capsule.position.x=Math.min(camera.aspect*.65,2.8);render();}
 const observer=new ResizeObserver(resize);observer.observe(canvas.parentElement);
 function tick(time){frame=requestAnimationFrame(tick);if(!visible||paused||document.hidden||options.quality==='2d'||options.reduced)return;if(time-last<1000/(options.quality==='low'?12:24))return;last=time;globe.rotation.y+=.0007;stars.rotation.y+=.000045;clouds.rotation.y+=.0009;globe.position.y=-2.35+Math.sin(time*.00009)*.035;if(exterior){capsule.rotation.y+=.0007;capsule.position.y=.12+Math.sin(time*.0003)*.055;}render();}
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});intersection.observe(canvas);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);canvas.parentElement.classList.remove('space-ready');onFailure();});resize();frame=requestAnimationFrame(tick);
 return{setOptions(next){options=next;resize();},setView(value){exterior=value==='exterior';capsule.visible=exterior;cabin.visible=!exterior;render();},setRecovery(value){trim.color.set(value>=1?0x88dec2:0x477383);render();},setPaused(value){paused=value;},dispose(){cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();disposeScene(scene);studio.dispose();renderer.dispose();}};
}
export function createOpening(canvas,options,onReady=()=>{}){
 if(options.quality==='2d'){onReady();return{supported:false,skip:onReady,dispose(){}};}
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{onReady();return{supported:false,skip:onReady,dispose(){}};}
 renderer.setClearColor(0x000000,0);renderer.setPixelRatio(options.quality==='low'?1:Math.min(devicePixelRatio,1.25));const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,70);const stars=makeStars(260),earth=makeEarth(4,()=>{if(!disposed)render();}),capsule=makeCapsule();scene.add(stars);earth.position.set(4,-4.6,-6);scene.add(earth);capsule.rotation.set(.1,-.6,-.12);scene.add(capsule);lightScene(scene);const studio=setupRenderer(renderer,scene);
 let frame=0,done=false,disposed=false;const started=performance.now();
 function position(p){const eased=1-Math.pow(1-p,3);camera.position.set(0,.3,8.5-eased*2.8);camera.lookAt(0,-.1,0);capsule.position.x=1.2*(1-eased);capsule.rotation.y=-.6+eased*.28;stars.rotation.y=p*.018;}
 function render(){renderer.render(scene,camera);}
 function resize(){const r=canvas.parentElement.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();render();}
 function finish(){if(disposed)return;done=true;cancelAnimationFrame(frame);position(1);render();onReady();}
 function tick(now){if(disposed||done)return;const p=Math.min(1,(now-started)/3800);position(p);render();if(p<1)frame=requestAnimationFrame(tick);else finish();}
 const observer=new ResizeObserver(resize);observer.observe(canvas.parentElement);position(options.reduced?1:0);resize();if(options.reduced)finish();else frame=requestAnimationFrame(tick);
 return{supported:true,skip:finish,dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();disposeScene(scene);renderer.dispose();}};
}
