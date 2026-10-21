/* Kampfbilder: Idle, Angriff, Treffer, Tod. Nur Darstellung. Dichte Timings + starkes Cross-Fade für flüssigere Bewegung. */
(function(){
'use strict';
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const V='?v=e16';
function load(list){return list.map(src=>{const im=new Image();im.src=src+V;return im})}
function pack(frames,holds,loop,extra){return Object.assign({frames:load(frames),holds,loop,hold:false,ping:false,fade:40},extra||{})}
const H='assets/characters/dunkler-krieger/v3/';
const hero={
 idle:pack([H+'idle/idle_01.png',H+'idle/idle_02.png'],[480,480],true,{ping:true,fade:120}),
 attack:pack([H+'attack/attack_01.png',H+'attack/attack_02.png',H+'attack/attack_03.png',H+'attack/attack_04.png',H+'attack/attack_05.png',H+'attack/attack_06.png'],[45,50,55,70,55,45],false,{fade:25}),
 hit:pack([H+'hit/hit_01.png',H+'hit/hit_02.png'],[90,110],false,{fade:35}),
 death:pack([H+'death/death_01.png',H+'death/death_02.png',H+'death/death_03.png'],[100,130,220],false,{hold:true,fade:40})
};
const G='assets/enemies/goblin/anim/';
const K='assets/enemies/goblin-krieger/anim/';
function goblin(prefix){
 return {
  idle:pack([prefix+'idle_01.png',prefix+'idle_02.png'],[580,580],true,{ping:true,fade:280}),
  attack:pack([prefix+'attack_01.png',prefix+'attack_02.png'],[280,360],false,{fade:100}),
  hit:pack([prefix+'hit_01.png'],[420],false,{fade:120}),
  death:pack([prefix+'death_01.png',prefix+'death_02.png'],[380,520],false,{hold:true,fade:140})
 };
}
const foes={goblin:goblin(G),'goblin-krieger':goblin(K)};
function orderOf(def){
 const n=def.frames.length,order=[];
 if(def.loop&&def.ping&&n>1){for(let k=0;k<n;k++)order.push(k);for(let k=n-2;k>0;k--)order.push(k)}
 else for(let k=0;k<n;k++)order.push(k);
 return order;
}
function span(def){const order=orderOf(def);return order.reduce((sum,i)=>sum+(def.holds[i]||def.holds[0]),0)}
function cursor(def,started,now){
 const n=def.frames.length;
 if(reduced)return def.hold?n-1:0;
 const order=orderOf(def);
 let t=now-started;
 const total=span(def);
 if(def.loop)t%=total;
 else if(t>=total)return order[order.length-1];
 let acc=0;
 for(const i of order){const h=def.holds[i]||def.holds[0];if(t<acc+h)return i;acc+=h}
 return order[order.length-1];
}
function done(def,started,now){return !def.loop&&!def.hold&&(now-started)>=span(def)}
const canvas=document.getElementById('heroSprite'),fallback=document.getElementById('heroFallback');
const ctx=canvas&&canvas.getContext?canvas.getContext('2d',{alpha:true}):null;
let heroClip='idle',heroAt=performance.now(),heroShown=null,heroFrom=null,heroBlend=0,heroPriority=0;
const PRIORITY={idle:0,walk:1,attack:3,special:3,hit:4,death:5};
function playHero(name,force){
 if(!hero[name])return;
 if(!force&&heroClip==='death'&&name!=='idle')return;
 if(!force&&name!=='death'&&PRIORITY[name]<heroPriority&&(performance.now()-heroAt)<span(hero[heroClip])*0.45)return;
 heroClip=name;heroAt=performance.now();heroPriority=PRIORITY[name]||0;
 if(canvas&&canvas.parentElement)canvas.parentElement.classList.toggle('striking',name==='attack');
}
if(ctx){ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high'}
function paint(im,alpha){
 if(!im||!im.complete||!im.naturalWidth||alpha<=0)return false;
 const w=canvas.width,h=canvas.height,scale=Math.min(w/im.naturalWidth,h/im.naturalHeight);
 const dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;
 ctx.globalAlpha=alpha;ctx.drawImage(im,(w-dw)/2,h-dh,dw,dh);return true;
}
function drawHero(now){
 if(!ctx)return;
 if(done(hero[heroClip],heroAt,now)&&heroClip!=='death')playHero('idle',true);
 const def=hero[heroClip];
 const im=def.frames[cursor(def,heroAt,now)];
 if(!(im&&im.complete&&im.naturalWidth))return;
 if(im!==heroShown){heroFrom=heroShown;heroShown=im;heroBlend=now}
 if(fallback)fallback.style.display='none';
 canvas.style.display='block';
 const fade=def.fade||40,t=heroFrom?Math.min(1,(now-heroBlend)/fade):1;
 ctx.clearRect(0,0,canvas.width,canvas.height);
 if(t<1)paint(heroFrom,1-t);
 paint(heroShown,t<1?t:1);
 ctx.globalAlpha=1;
}
const img=document.getElementById('enemySprite');
let under=null,foeKind='',foeClip='idle',foeAt=0,foeFrame=-1,foeOn=false,foeLock=false;
function ensureUnder(){
 if(under||!img||!img.parentNode)return;
 under=document.createElement('img');
 under.id='enemySpriteUnder';
 under.alt='';
 under.draggable=false;
 img.parentNode.insertBefore(under,img);
}
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
 if(done(book[foeClip],foeAt,now)&&foeClip!=='death')playFoe('idle',true);
 const def=book[foeClip];
 const i=cursor(def,foeAt,now);
 if(i===foeFrame)return;
 const im=def.frames[i];
 if(!(im&&im.complete&&im.naturalWidth))return;
 ensureUnder();
 if(under&&img.getAttribute('src')){under.src=img.src;under.style.opacity='1'}
 foeFrame=i;
 img.style.transition='none';
 img.style.opacity='0';
 img.src=im.src;
 img.alt=foeKind;
 requestAnimationFrame(()=>{img.style.transition='opacity '+(def.fade||80)+'ms linear';img.style.opacity='1'});
}
function frame(now){drawHero(now);drawFoe(now);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
window.DarkWarriorSprite={play:playHero,inspect:()=>({animation:heroClip,dead:heroClip==='death',priority:heroPriority})};
window.EnemySprite={
 has:kind=>!!foes[kind],
 show(kind){if(foeLock)return;foeOn=true;if(kind!==foeKind||foeClip==='death'){foeKind=kind;playFoe('idle',true)}},
 play:name=>playFoe(name,false),
 die(kind){if(!foes[kind])return;foeOn=true;foeKind=kind;playFoe('death',true);foeLock=true;setTimeout(()=>{foeLock=false},2000)},
 release(){foeOn=false;foeKind='';foeClip='idle';foeLock=false;if(under)under.style.opacity='0'}
};
})();
