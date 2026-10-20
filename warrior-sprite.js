/* Dunkler Krieger v2: Idle, Angriff, Treffer, Tod.
   Nur Darstellung. Kampfwerte bleiben in game.js.
   v1-Idle bleibt der Fallback, falls v2 nicht lädt. */
(function(){
'use strict';
const canvas=document.getElementById('heroSprite'),fallback=document.getElementById('heroFallback');
if(!canvas||!fallback)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';

const V2='assets/characters/dunkler-krieger/v2/';
const V1='assets/characters/dunkler-krieger/v1/';
const SPEC={
 idle:{fps:6,loop:true,hold:false,count:4,file:i=>'idle/idle_'+String(i+1).padStart(2,'0')+'.png'},
 attack:{fps:12,loop:false,hold:false,count:5,file:i=>'attack/attack_'+String(i+1).padStart(2,'0')+'.png'},
 hit:{fps:10,loop:false,hold:false,count:3,file:i=>'hit/hit_'+String(i+1).padStart(2,'0')+'.png'},
 death:{fps:8,loop:false,hold:true,count:5,file:i=>'death/death_'+String(i+1).padStart(2,'0')+'.png'}
};
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const v1=Array.from({length:32},()=>new Image());
let mode='v2',pose='idle',frame=0,dead=false,loaded=0,errors=0,using=null,frameAt=performance.now();
const sets={};
function loadSet(name){
 const spec=SPEC[name];
 return Array.from({length:spec.count},(_,i)=>{
  const im=new Image();
  im.onload=name==='idle'&&i===0?markReady:()=>{};
  im.onerror=()=>{
   errors++;
   if(name==='idle'&&i===0)useV1();
   else console.warn('Dunkler Krieger: Frame fehlt',im.src);
  };
  im.src=V2+spec.file(i)+'?v=v2-combat';
  return im;
 });
}
for(const name of Object.keys(SPEC))sets[name]=loadSet(name);
using=sets.idle;

function markReady(){
 loaded++;
 if(loaded===1){canvas.style.display='block';fallback.style.display='none';canvas.dataset.ready='true'}
}
function useV1(){
 if(mode==='v1')return;
 mode='v1';pose='idle';frame=0;dead=false;using=v1;
 v1.forEach((im,i)=>{
  im.onload=i===0&&loaded===0?markReady:()=>{};
  im.onerror=()=>{errors++;if(i===0)console.warn('Dunkler Krieger: auch v1-Idle fehlt')};
  if(!im.getAttribute||!im.src)im.src=V1+'frame_'+String(i).padStart(3,'0')+'.png?v=v6-transparent-2';
 });
 console.warn('Dunkler Krieger: v2 nicht ladbar, Idle aus v1 wird gezeigt.');
}

function picture(){
 const list=using;
 const im=list[frame];
 if(im&&im.complete&&im.naturalWidth)return im;
 return list.find(x=>x.complete&&x.naturalWidth)||null;
}
function draw(){
 const im=picture();if(!im)return;
 const w=canvas.width,h=canvas.height;
 ctx.clearRect(0,0,w,h);
 const scale=Math.min(w/im.naturalWidth,h/im.naturalHeight);
 const dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;
 ctx.drawImage(im,(w-dw)/2,h-dh,dw,dh);
 canvas.dataset.animation=pose;
 canvas.dataset.frame=String(frame);
}
function begin(name){
 pose=name;frame=0;frameAt=performance.now();using=mode==='v1'?v1:sets[name]||sets.idle;
 draw();
}
function play(name){
 if(mode==='v1')return name==='idle';
 if(name==='death'){dead=true;begin('death');return true}
 if(name==='idle'&&dead){dead=false;begin('idle');return true}
 if(dead)return false;
 if(name==='hit'){begin('hit');return true}
 if(name==='attack'){if(pose==='hit')return true;begin('attack');return true}
 if(name==='idle'){if(pose==='idle')return true;begin('idle');return true}
 return false;
}
window.addEventListener('rpg-warrior-pose',ev=>play(ev.detail));

function render(now){
 const spec=mode==='v1'?{fps:25,loop:true,hold:false,count:32}:SPEC[pose];
 if(!(reduced&&(pose==='idle'||mode==='v1'))){
  const step=1000/spec.fps;
  if(now-frameAt>=step){
   const adv=Math.floor((now-frameAt)/step);
   frameAt+=adv*step;
   if(spec.loop)frame=(frame+adv)%spec.count;
   else if(frame<spec.count-1)frame=Math.min(spec.count-1,frame+adv);
   else if(!spec.hold&&pose!=='idle')begin('idle');
  }
 }
 draw();
 requestAnimationFrame(render);
}
window.DarkWarriorSprite={
 play,
 inspect:()=>({animation:pose,ready:loaded>0,loaded,errors,frame,dead,mode,total:mode==='v1'?32:SPEC[pose].count}),
 manifest:{character:'dark_warrior',version:'v2-combat',animations:SPEC}
};
requestAnimationFrame(render);
})();
