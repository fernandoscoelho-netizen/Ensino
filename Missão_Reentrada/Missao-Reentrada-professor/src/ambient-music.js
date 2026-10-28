// Órbita tranquila: composição generativa original para a cápsula Aurora.
// Apenas Web Audio. Sem ficheiros, transmissões ou serviços externos.
export const MUSIC_TITLE='Órbita tranquila';
export function createAmbientMusic({volume=20,onState=()=>{}}={}){
 let context=null,graph=null,timer=null,fadeTimer=null,wanted=false,generation=0,nextChord=0,nextStar=0,chordIndex=0;
 const chords=[[50,57,62,64],[46,53,57,60],[48,55,60,62],[43,50,57,60]];
 const live=new Set();
 const level=()=>Math.max(0,Math.min(100,volume))/100*.24;
 const frequency=midi=>440*Math.pow(2,(midi-69)/12);
 function notify(){onState(wanted&&context?.state==='running'?'playing':wanted?'starting':'stopped');}
 function removeGraph(){
  clearInterval(timer);timer=null;
  for(const node of live){try{node.stop();}catch{}try{node.disconnect();}catch{}}
  live.clear();
  if(graph){for(const node of graph.nodes){try{node.disconnect();}catch{}}graph=null;}
 }
 function makeGraph(){
  const input=context.createGain(),filter=context.createBiquadFilter(),dry=context.createGain(),wet=context.createGain(),convolver=context.createConvolver(),master=context.createGain(),limiter=context.createDynamicsCompressor();
  filter.type='lowpass';filter.frequency.value=1250;filter.Q.value=.35;dry.gain.value=.8;wet.gain.value=.26;
  limiter.threshold.value=-15;limiter.knee.value=20;limiter.ratio.value=4;limiter.attack.value=.025;limiter.release.value=.45;
  const length=Math.floor(context.sampleRate*2.8),impulse=context.createBuffer(2,length,context.sampleRate);let seed=271;
  for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);for(let i=0;i<length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=((seed/4294967296)*2-1)*Math.pow(1-i/length,3.4);}}
  convolver.buffer=impulse;input.connect(filter);filter.connect(dry);filter.connect(convolver);convolver.connect(wet);dry.connect(master);wet.connect(master);master.connect(limiter);limiter.connect(context.destination);
  master.gain.setValueAtTime(0,context.currentTime);master.gain.linearRampToValueAtTime(level(),context.currentTime+1.8);
  graph={input,master,nodes:[input,filter,dry,wet,convolver,master,limiter]};
 }
 function voice(midi,start,duration,peak,pan=0,sparkle=false){
  const envelope=context.createGain(),panner=context.createStereoPanner();panner.pan.value=pan;
  envelope.gain.setValueAtTime(.0001,start);envelope.gain.exponentialRampToValueAtTime(peak,start+(sparkle ? 0.8 : 5));
  if(!sparkle)envelope.gain.setValueAtTime(peak,start+duration-8);
  envelope.gain.exponentialRampToValueAtTime(.0001,start+duration);
  envelope.connect(panner);panner.connect(graph.input);
  const oscillators=[context.createOscillator(),context.createOscillator()];let ended=0;
  oscillators.forEach((osc,index)=>{osc.type=sparkle?'sine':index?'triangle':'sine';osc.frequency.value=frequency(midi);osc.detune.value=index?2.5:-2.5;osc.connect(envelope);live.add(osc);osc.start(start);osc.stop(start+duration+.1);osc.onended=()=>{live.delete(osc);osc.disconnect();if(++ended===oscillators.length){envelope.disconnect();panner.disconnect();}};});
 }
 function schedule(){
  if(!wanted||!graph||context.state!=='running')return;
  const until=context.currentTime+1.5;
  if(nextChord<until){const chord=chords[chordIndex%chords.length];chord.forEach((note,i)=>voice(note,nextChord,32,.075,[-.35,.25,-.12,.4][i]));voice(chord[0]-12,nextChord,32,.045,0);nextChord+=24;chordIndex++;}
  if(nextStar<until){const chord=chords[Math.max(0,chordIndex-1)%chords.length];const note=chord[(chordIndex+Math.floor(nextStar))%chord.length]+12;voice(note,nextStar,7,.024,Math.sin(nextStar*.27)*.55,true);nextStar+=7.2+(chordIndex%3)*1.1;}
 }
 async function start(){
  if(wanted&&context?.state==='running')return;
  const request=++generation;wanted=true;clearTimeout(fadeTimer);removeGraph();
  const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio){wanted=false;notify();throw new Error('Este navegador não disponibiliza áudio ambiente.');}
  try{
   if(!context||context.state==='closed'){context=new Audio({latencyHint:'playback'});context.onstatechange=notify;}
   await context.resume();
   if(request!==generation||!wanted)return;
   if(context.state!=='running')throw new Error('Clica novamente em Ligar música para permitir o áudio.');
   makeGraph();nextChord=context.currentTime+.1;nextStar=context.currentTime+6;chordIndex=0;schedule();timer=setInterval(schedule,1000);notify();
  }catch(error){if(request===generation){wanted=false;removeGraph();notify();}throw error;}
 }
 function stop(){
  generation++;wanted=false;clearInterval(timer);timer=null;clearTimeout(fadeTimer);
  if(graph&&context?.state==='running'){const now=context.currentTime;graph.master.gain.cancelScheduledValues(now);graph.master.gain.setValueAtTime(graph.master.gain.value,now);graph.master.gain.linearRampToValueAtTime(0,now+.5);fadeTimer=setTimeout(()=>{removeGraph();context?.suspend().catch(()=>{});},600);}else removeGraph();notify();
 }
 function setVolume(value){volume=Number.isFinite(Number(value))?Math.max(0,Math.min(100,Number(value))):20;if(graph&&wanted){const now=context.currentTime;graph.master.gain.cancelScheduledValues(now);graph.master.gain.setTargetAtTime(level(),now,.12);}}
 function dispose(){generation++;wanted=false;clearTimeout(fadeTimer);removeGraph();const old=context;context=null;old?.close().catch(()=>{});notify();}
 return{start,stop,setVolume,dispose,get playing(){return wanted&&context?.state==='running';},get title(){return MUSIC_TITLE;}};
}
