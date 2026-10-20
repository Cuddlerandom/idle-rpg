/* Dunkler Krieger: freigegebene Idle-PNGs. Nur visuelle Darstellung. */
(function(){
'use strict';
const canvas=document.getElementById('heroSprite'),fallback=document.getElementById('heroFallback');
if(!canvas||!fallback)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
const BASE='assets/characters/dunkler-krieger/v1/';
const frames=Array.from({length:6},(_,i)=>{const im=new Image();im.src=BASE+'Idle_'+String(i+1).padStart(2,'0')+'.png';return im;});
const fps=5;let loaded=0,errors=0,last=-1;
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
for(const im of frames){
 im.onload=()=>{loaded++;if(loaded===1){canvas.style.display='block';fallback.style.display='none';canvas.dataset.ready='true'}};
 im.onerror=()=>{errors++;console.warn('Dunkler Krieger: Idle-Frame konnte nicht geladen werden',im.src)};
}
const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function render(time){
 const index=reducedMotion?0:Math.floor(time*fps/1000)%frames.length;
 if(index!==last){last=index;const im=frames[index];const picture=im.complete&&im.naturalWidth?im:frames.find(x=>x.complete&&x.naturalWidth);
  if(picture){const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
   const scale=Math.min(w/picture.naturalWidth,h/picture.naturalHeight);
   const dw=picture.naturalWidth*scale,dh=picture.naturalHeight*scale;
   ctx.drawImage(picture,(w-dw)/2,(h-dh)/2,dw,dh);
  }
 }
 requestAnimationFrame(render);
}
canvas.dataset.animation='idle';
window.DarkWarriorSprite={
 play:()=>true,
 inspect:()=>({animation:'idle',ready:loaded>0,loaded,total:6,errors,frame:last,dead:false}),
 manifest:{character:'dark_warrior',version:'idle-v2',animations:{idle:{frames:6,fps,loop:true}}}
};
requestAnimationFrame(render);
})();