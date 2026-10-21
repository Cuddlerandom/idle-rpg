/* Kampfbilder: Idle, Angriff, Treffer, Tod. Nur Darstellung. */
(function(){
'use strict';
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const V='?v=e10';
function load(list){return list.map(src=>{const im=new Image();im.src=src+V;return im})}
function pack(frames,fps,loop,extra){return Object.assign({frames:load(frames),fps,loop,hold:false,ping:false},extra||{})}
const hero={
 idle:pack(['assets/characters/dunkler-krieger/v2/idle/idle_01.png','assets/characters/dunkler-krieger/v2/idle/idle_02.png','assets/characters/dunkler-krieger/v2/idle/idle_03.png','assets/characters/dunkler-krieger/v2/idle/idle_04.png'],6,true),
 attack:pack(['assets/characters/dunkler-krieger/v2/attack/attack_01.png','assets/characters/dunkler-krieger/v2/attack/attack_02.png','assets/characters/dunkler-krieger/v2/attack/attack_03.png','assets/characters/dunkler-krieger/v2/attack/attack_04.png','assets/characters/dunkler-krieger/v2/attack/attack_05.png'],12,false),
 hit:pack(['assets/characters/dunkler-krieger/v2/hit/hit_01.png','assets/characters/dunkler-krieger/v2/hit/hit_02.png','assets/characters/dunkler-krieger/v2/hit/hit_03.png'],10,false),
 death:pack(['assets/characters/dunkler-krieger/v2/death/death_01.png','assets/characters/dunkler-krieger/v2/death/death_02.png','assets/characters/dunkler-krieger/v2/death/death_03.png','assets/characters/dunkler-krieger/v2/death/death_04.png','assets/characters/dunkler-krieger/v2/death/death_05.png'],8,false,{hold:true})
};
const G='assets/enemies/goblin/anim/';
const K='assets/enemies/goblin-krieger/anim/';
const foes={
 goblin:{
  idle:pack([G+'idle_01.png',G+'idle_02.png'],3,true,{ping:true}),
  attack:pack([G+'attack_01.png',G+'attack_02.png'],7,false),
  hit:pack([G+'hit_01.png'],4,false),
  death:pack([G+'death_01.png',G+'death_02.png'],5,false,{hold:true})
 },
 'goblin-krieger':{
  idle:pack([K+'idle_01.png',K+'idle_02.png'],3,true,{ping:true}),
  attack:pack([K+'attack_01.png',K+'attack_02.png'],7,false),
  hit:pack([K+'hit_01.png'],4,false),
  death:pack([K+'death_01.png',K+'death_02.png'],5,false,{hold:true})
 }
};
function indexOf(def,started,now){
 const n=def.frames.length,step=1000/def.fps,i=Math.floor((now-started)/step);
 if(reduced)return def.hold?n-1:0;
 if(def.loop&&def.ping){const span=Math.max(1,(n-1)*2),t=i%span;return t<n?t:span-t}
 if(def.loop)return i%n;
 return Math.min(i,n-1);
}
function done(def,started,now){return !def.loop&&!def.hold&&(now-started)>=def.frames.length*(1000/def.fps)}
const canvas=document.getElementById('heroSprite'),fallback=document.getElementById('heroFallback');
const ctx=canvas&&canvas.getContext?canvas.getContext('2d',{alpha:true}):null;
let heroClip='idle',heroAt=performance.now(),heroFrame=-1;
function playHero(name,force){
 if(!hero[name])return;
 if(!force&&heroClip==='death')return;
 if(!force&&name==='hit'&&heroClip==='attack')return;
 if(!force&&name==='idle'&&heroClip==='idle')return;
 heroClip=name;heroAt=performance.now();heroFrame=-1;
}
if(ctx){ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high'}
function drawHero(now){
 if(!ctx)return;
 const def=hero[heroClip];
 if(done(def,heroAt,now))playHero('idle',true);
 const i=indexOf(hero[heroClip],heroAt,now);
 if(i===heroFrame)return;
 const im=hero[heroClip].frames[i];
 if(!(im&&im.complete&&im.naturalWidth))return;
 heroFrame=i;
 if(fallback)fallback.style.display='none';
 canvas.style.display='block';
 const w=canvas.width,h=canvas.height,scale=Math.min(w/im.naturalWidth,h/im.naturalHeight);
 const dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;
 ctx.clearRect(0,0,w,h);ctx.drawImage(im,(w-dw)/2,h-dh,dw,dh);
}
const img=document.getElementById('enemySprite');
let foeKind='',foeClip='idle',foeAt=0,foeFrame=-1,foeOn=false,foeLock=false;
function playFoe(name,force){
 const book=foes[foeKind];if(!book||!book[name])return;
 if(!force&&(foeLock||foeClip==='death'))return;
 if(!force&&name==='hit'&&foeClip==='attack')return;
 if(!force&&name==='idle'&&foeClip==='idle')return;
 foeClip=name;foeAt=performance.now();foeFrame=-1;
}
function drawFoe(now){
 if(!foeOn||!img)return;
 const book=foes[foeKind];if(!book)return;
 const def=book[foeClip];
 if(done(def,foeAt,now))playFoe('idle',true);
 const i=indexOf(book[foeClip],foeAt,now);
 if(i===foeFrame)return;
 const im=book[foeClip].frames[i];
 if(!(im&&im.complete&&im.naturalWidth))return;
 foeFrame=i;img.src=im.src;img.alt=foeKind;
}
function frame(now){drawHero(now);drawFoe(now);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
window.DarkWarriorSprite={play:playHero,inspect:()=>({animation:heroClip,dead:heroClip==='death'})};
window.EnemySprite={
 has:kind=>!!foes[kind],
 show(kind){if(foeLock)return;foeOn=true;if(kind!==foeKind||foeClip==='death'){foeKind=kind;playFoe('idle',true)}},
 play:name=>playFoe(name,false),
 die(kind){if(!foes[kind])return;foeOn=true;foeKind=kind;playFoe('death',true);foeLock=true;setTimeout(()=>{foeLock=false},1100)},
 release(){foeOn=false;foeKind='';foeClip='idle';foeLock=false}
};
})();
