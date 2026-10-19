/* Dunkler Krieger V1.0 – ausschliesslich visueller Sprite-Renderer.
   Die Spiellogik, Speicherstände, Kampftimer und Schadensberechnung bleiben unberührt. */
(()=>{'use strict';
const ROOT='assets/characters/dark-warrior/v1/';
const ANIMS={
 idle:{frames:6,fps:5,loop:true},walk:{frames:8,fps:9,loop:true},
 attack:{frames:8,fps:11},hit:{frames:4,fps:8},
 death:{frames:6,fps:7},special:{frames:8,fps:10}
};
const W=448,H=672,ANCHOR_X=224,ANCHOR_Y=626;
let state='idle',started=performance.now(),lockUntil=0,lastWave='',lastHp='',lastEnemyHp='',dead=false,loaded=false;
const sprite=document.getElementById('darkWarriorSprite'),fallback=document.getElementById('warriorFallback');
if(!sprite||!fallback)return;
const sheets={};
let alive=true;
for(const [name,info] of Object.entries(ANIMS)){
 const img=new Image();
 img.onload=()=>{sheets[name]=img;loaded=true;fallback.hidden=true;sprite.hidden=false};
 img.onerror=()=>{delete sheets[name];if(!loaded){fallback.hidden=false;sprite.hidden=true}};
 img.src=ROOT+'sheets/'+name+'.png';
}
function animate(name,priority=false){
 if(!ANIMS[name]||(!priority&&performance.now()<lockUntil))return;
 state=name;started=performance.now();
 if(!ANIMS[name].loop)lockUntil=started+ANIMS[name].frames*1000/ANIMS[name].fps;
 else lockUntil=0;
}
function frame(now){
 if(!alive)return;
 const a=ANIMS[state],elapsed=Math.max(0,now-started);
 let index=Math.floor(elapsed*a.fps/1000);
 if(a.loop)index%=a.frames;
 else if(index>=a.frames){
  if(state==='death')index=a.frames-1;
  else{state='idle';started=now;lockUntil=0;index=0}
 }
 const image=sheets[state]||sheets.idle;
 if(image){
  sprite.style.backgroundImage='url("'+image.src+'")';
  sprite.style.backgroundPosition=(-index*W)+'px 0px';
  sprite.style.backgroundSize=(a.frames*W)+'px '+H+'px';
  // All sheets use identical frame dimensions and the same foot anchor.
 }
 requestAnimationFrame(frame);
}
const watch=()=>{
 const wave=document.getElementById('wave')?.textContent||'';
 const hp=document.getElementById('hpText')?.textContent||'';
 const enemyHp=document.getElementById('enemyHpText')?.textContent||'';
 const runEnd=document.getElementById('runEnd');
 if(wave!==lastWave&&lastWave){animate('walk',true);setTimeout(()=>animate('idle'),800)}
 else if(hp!==lastHp&&lastHp&&parseFloat(hp)<parseFloat(lastHp))animate('hit',true);
 else if(enemyHp!==lastEnemyHp&&lastEnemyHp&&parseFloat(enemyHp)<parseFloat(lastEnemyHp))animate('attack');
 if(runEnd&&!runEnd.classList.contains('hidden')&&!dead){dead=true;animate('death',true)}
 if(runEnd&&runEnd.classList.contains('hidden')&&dead){dead=false;animate('idle',true)}
 lastWave=wave;lastHp=hp;lastEnemyHp=enemyHp;
};
const observer=new MutationObserver(watch);
for(const id of ['wave','hpText','enemyHpText','runEnd']){
 const el=document.getElementById(id);if(el)observer.observe(el,{childList:true,subtree:true,characterData:true,attributes:id==='runEnd',attributeFilter:id==='runEnd'?['class']:undefined});
}
document.getElementById('skills')?.addEventListener('click',e=>{
 if(e.target.closest('button'))animate('special',true);
});
window.addEventListener('pagehide',()=>{alive=false;observer.disconnect()});
requestAnimationFrame(frame);
})();