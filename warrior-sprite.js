/* Dunkler Krieger V1.0: rein visuelle Spriteintegration.
   KEINE Eingriffe in Kampfregeln, Talentwerte, Eingaben, Spawns oder Savegames. */
(function(){
'use strict';
const canvas=document.getElementById('heroSprite');
const fallback=document.getElementById('heroFallback');
const atlases=window.DARK_WARRIOR_ATLASES;
if(!canvas||!fallback||!atlases)return;
const ctx=canvas.getContext('2d',{alpha:true});
if(!ctx)return;
ctx.imageSmoothingEnabled=false;
const FRAME_W=64,FRAME_H=96;
const ANIMS={
 idle:{frames:6,fps:5,loop:true},
 walk:{frames:8,fps:9,loop:true},
 attack:{frames:8,fps:11,loop:false},
 hit:{frames:4,fps:8,loop:false},
 death:{frames:6,fps:7,loop:false},
 special:{frames:8,fps:10,loop:false}
};
const images={};
let animation='idle',started=performance.now(),lockUntil=0,priority=0,lastFrame=-1;
let dead=false,ready=false,errorCount=0;
const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function duration(name){const x=ANIMS[name];return x.frames/x.fps*1000}
function play(name){
 if(!ANIMS[name])return false;
 if(dead&&name!=='idle'&&name!=='death')return false;
 const now=performance.now();
 const levels={idle:0,walk:1,attack:2,special:3,hit:4,death:5};
 if(name!=='death'&&now<lockUntil&&levels[name]<priority)return false;
 if(name==='death')dead=true;
 if(name==='idle'&&dead)dead=false;
 animation=name;priority=levels[name];started=now;
 lockUntil=name==='idle'?0:now+duration(name);
 lastFrame=-1;
 canvas.dataset.animation=name;
 return true;
}
function frame(now){
 const conf=ANIMS[animation],elapsed=Math.max(0,now-started);
 let frameIndex=Math.floor(elapsed/1000*conf.fps);
 if(reducedMotion&&conf.loop)frameIndex=0;
 if(frameIndex>=conf.frames){
  if(conf.loop)frameIndex%=conf.frames;
  else if(animation==='death')frameIndex=conf.frames-1;
  else{animation='idle';priority=0;started=now;lockUntil=0;frameIndex=0;canvas.dataset.animation='idle'}
 }
 if(frameIndex!==lastFrame){
  lastFrame=frameIndex;
  ctx.clearRect(0,0,FRAME_W,FRAME_H);
  const image=images[animation]&&images[animation].naturalWidth?images[animation]:images.idle;
  if(image&&image.naturalWidth>=FRAME_W){
   ctx.drawImage(image,frameIndex*FRAME_W,0,FRAME_W,FRAME_H,0,0,FRAME_W,FRAME_H);
  }
 }
 requestAnimationFrame(frame);
}
for(const [name,config] of Object.entries(ANIMS)){
 const image=new Image();
 images[name]=image;
 image.onload=()=>{
  if(image.naturalWidth!==config.frames*FRAME_W||image.naturalHeight!==FRAME_H){
   console.warn('Dunkler Krieger: Falsche Atlasabmessungen',name,image.naturalWidth,image.naturalHeight);
   errorCount++;return;
  }
  if(name==='idle'){ready=true;canvas.style.display='block';fallback.style.display='none';canvas.dataset.ready='true'}
 };
 image.onerror=()=>{
  errorCount++;
  console.warn('Dunkler Krieger: Spriteatlas nicht geladen',name);
 };
 image.src=atlases[name];
}
const waveNode=document.getElementById('wave');
const enemyNode=document.getElementById('enemyHpText');
const hpNode=document.getElementById('hpText');
const logNode=document.getElementById('log');
const runEndNode=document.getElementById('runEnd');
const numberBeforeSlash=node=>{
 const raw=(node&&node.textContent||'').split('/')[0].replace(/[^0-9]/g,'');
 return raw===''?null:Number(raw);
};
let prev={wave:waveNode?.textContent||'',enemy:numberBeforeSlash(enemyNode),hp:numberBeforeSlash(hpNode),log:logNode?.textContent||''};
function scan(){
 const current={wave:waveNode?.textContent||'',enemy:numberBeforeSlash(enemyNode),hp:numberBeforeSlash(hpNode),log:logNode?.textContent||''};
 const running=!runEndNode||runEndNode.classList.contains('hidden');
 if(!running&&current.hp===0){
  if(!dead)play('death');
 }else if(!running){
  if(dead)play('idle');
 }else{
  if(dead)play('idle');
  if(current.wave!==prev.wave&&prev.wave)play('walk');
  if(current.enemy!==null&&prev.enemy!==null&&current.enemy<prev.enemy)play('attack');
  if(current.log!==prev.log&&current.log.startsWith('✨ ')){
   play(current.log.includes('Vernichtender Hieb')?'attack':'special');
  }
  if(current.hp!==null&&prev.hp!==null&&current.hp<prev.hp)play('hit');
 }
 prev=current;
}
let pending=false;
const observer=new MutationObserver(()=>{
 if(pending)return;
 pending=true;
 queueMicrotask(()=>{pending=false;scan()});
});
const battle=document.getElementById('battle');
if(battle)observer.observe(battle,{childList:true,subtree:true,characterData:true});
if(runEndNode)observer.observe(runEndNode,{attributes:true,attributeFilter:['class']});
window.DarkWarriorSprite={
 play, inspect:()=>({animation,ready,errors:errorCount,frame:lastFrame,dead}),
 manifest:{character:'dark_warrior',version:'1.0-preview',frameWidth:FRAME_W,frameHeight:FRAME_H,footAnchor:{x:32,y:89},animations:ANIMS}
};
requestAnimationFrame(frame);
})();
