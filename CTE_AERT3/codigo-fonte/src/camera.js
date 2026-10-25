export const CAMERA_PRESETS={
 overview:{label:'Visão geral',yaw:Math.PI+.55,pitch:.88,distance:43,target:'campus'},
 follow:{label:'Seguir aluno',yaw:Math.PI+.55,pitch:.92,distance:18,target:'player'},
 top:{label:'De cima',yaw:Math.PI,pitch:1.5,distance:35,target:'campus'},
 side:{label:'Lateral',yaw:Math.PI*1.5,pitch:.6,distance:36,target:'campus'},
 first:{label:'Primeira pessoa',yaw:Math.PI,pitch:.8,distance:1,target:'player'}
};
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function newCameraState(preset='overview'){return {...CAMERA_PRESETS[preset],preset,panX:0,panZ:0};}
export function orbitCamera(camera,dx,dy){camera.yaw-=dx*.006;camera.pitch=clamp(camera.pitch+dy*.006,.22,1.52);}
export function zoomCamera(camera,delta){camera.distance=clamp(camera.distance*Math.exp(delta*.001),4,85);}
export function cameraPosition(camera,target,aspect=1){const distance=camera.distance*(camera.target==='campus'?Math.max(1,1.1/aspect):1),horizontal=Math.cos(camera.pitch)*distance;return {x:target.x+camera.panX+Math.sin(camera.yaw)*horizontal,y:target.y+Math.sin(camera.pitch)*distance,z:target.z+camera.panZ+Math.cos(camera.yaw)*horizontal};}
