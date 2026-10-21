/* Idle RPG V0.3 – Dunkler Krieger, vollständiges Kampfsystem */
(function(){
'use strict';
const KEY='idle-rpg-core-v01',FIELDS=['atk','hp','def','regen','speed','crit'],RUN_FIELDS=['atk','hp'];
const LABELS={atk:'⚔️ Angriff',hp:'❤️ Max. Leben',def:'🛡️ Verteidigung',regen:'💚 Regeneration',speed:'⚡ Angriffstempo',crit:'🎯 Krit-Chance'};
const BASE_COST={atk:15,hp:15,def:22,regen:30,speed:40,crit:45};
const PRESTIGE=[
{id:'gold',name:'Goldrausch',icon:'💰',branch:'Reichtum',max:5,step:5,cost:55,desc:'Mehr Gold pro Gegner'},
{id:'coins',name:'Münzprägung',icon:'🪙',branch:'Reichtum',max:5,step:3,cost:95,req:'gold',desc:'Mehr permanente Münzen'},
{id:'discount',name:'Werkstattmeister',icon:'🔨',branch:'Reichtum',max:5,step:3,cost:135,req:'coins',desc:'Werkstattkosten sinken'},
{id:'xp',name:'Wissensdurst',icon:'📖',branch:'Entwicklung',max:5,step:5,cost:55,desc:'Mehr Erfahrung'},
{id:'loot',name:'Schatzinstinkt',icon:'🎁',branch:'Entwicklung',max:5,step:2,cost:95,req:'xp',desc:'Zusätzliche Beutechance'},
{id:'tempo',name:'Kampfmeister',icon:'⚔️',branch:'Meisterschaft',max:5,step:2,cost:75,desc:'Mehr Angriffstempo'},
{id:'guard',name:'Bollwerk',icon:'🛡️',branch:'Meisterschaft',max:5,step:2,cost:125,req:'tempo',desc:'Weniger erlittener Schaden'},
{id:'speed',name:'Zeitfluss',icon:'⏩',branch:'Meisterschaft',max:4,step:1,cost:180,req:'guard',desc:'Spieltempo bis 5×'}
];
const prestigeRank=id=>Math.max(0,Math.floor(Number(state.prestige[id])||0));
const prestigeBonus=id=>prestigeRank(id)*(PRESTIGE.find(n=>n.id===id)?.step||0);
const prestigePrice=n=>Math.round(n.cost*Math.pow(1.5,prestigeRank(n.id)));
function buyPrestige(id){
 const n=PRESTIGE.find(x=>x.id===id);
 if(!n||state.run.preview||prestigeRank(id)>=n.max||(n.req&&!prestigeRank(n.req))||state.coins<prestigePrice(n))return;
 state.coins-=prestigePrice(n);state.prestige[id]=prestigeRank(id)+1;save();render();
}
function renderPrestige(){
 const branches=[['Reichtum','💰'],['Entwicklung','🔮'],['Meisterschaft','⚡']];
 updateHtml('prestigeTree','<div class="prestige-wallet"><span>🪙 '+fmt(state.coins)+' Münzen</span><small>Wähle einen Knoten für den nächsten Bonus</small></div><div class="prestige-grid">'+branches.map(([branch,icon])=>'<section class="prestige-column"><h3>'+icon+' '+branch+'</h3>'+PRESTIGE.filter(n=>n.branch===branch).map((n,i)=>{
 const rank=prestigeRank(n.id),locked=!!(n.req&&!prestigeRank(n.req)),max=rank>=n.max,price=prestigePrice(n);
 const affordable=state.coins>=price,canBuy=!locked&&!max&&affordable&&!state.run.preview;
 const v=x=>n.id==='speed'?x+'×':x+' %';
 const current=n.id==='speed'?1+rank:rank*n.step,next=current+n.step;
 const status=max?'maxed':locked?'locked':canBuy?'ready':'waiting';
 const detailId='prestige-detail-'+n.id;
 const label=max?'Maximiert':locked?'Gesperrt':canBuy?'Kaufbereit':'Münzen fehlen';
 return (i?'<div class="prestige-path '+(locked?'prestige-path-locked':'')+'" aria-hidden="true"><span></span></div>':'')+
 '<article class="prestige-node prestige-'+status+'"><button type="button" class="prestige-node-top" aria-expanded="false" aria-controls="'+detailId+'" onclick="togglePrestige(\''+n.id+'\')"><span class="prestige-emblem">'+n.icon+'</span><span class="prestige-node-title"><strong>'+n.name+'</strong><small>Rang '+rank+'/'+n.max+'</small></span><span class="prestige-node-state">'+(max?'✓':locked?'🔒':canBuy?'✦':'◌')+'</span><span class="prestige-chevron">⌄</span></button>'+
 '<div class="prestige-progress" aria-label="Rang '+rank+' von '+n.max+'"><span style="width:'+(rank/n.max*100)+'%"></span></div>'+
 '<div class="prestige-summary"><span class="prestige-pill">'+label+'</span><span>'+ (max?'Vollständig': 'Nächster Rang: <b class="prestige-gain">+'+v(n.step)+'</b>')+'</span></div>'+
 '<div class="prestige-detail" id="'+detailId+'" hidden><p>'+n.desc+'</p><div class="prestige-stat">Aktuell <b>'+v(current)+'</b></div><div class="prestige-stat">Nächste Stufe <b class="prestige-gain">'+(max?'MAX':v(next)+' (+'+v(n.step)+')')+'</b></div>'+
 (locked?'<div class="prestige-requirement">🔒 Benötigt: '+PRESTIGE.find(x=>x.id===n.req).name+' Rang 1</div>':'')+
 '<button class="prestige-buy" '+(canBuy?'':'disabled')+' onclick="buyPrestige(\''+n.id+'\')">'+(max?'✓ Maximiert':state.run.preview?'Im Testmodus gesperrt':'🪙 '+fmt(price)+' Münzen · Kaufen')+'</button></div></article>';
 }).join('')+'</section>').join('')+'</div>');
 const cap=1+prestigeBonus('speed');
 state.gameSpeed=clamp(Number(state.gameSpeed)||1,1,cap);
 updateHtml('prestigeSpeed','<label>⏩ Spieltempo: '+state.gameSpeed+'× (freigeschaltet bis '+cap+'×) <select onchange="setGameSpeed(this.value)">'+Array.from({length:cap},(_,i)=>i+1).map(v=>'<option value="'+v+'" '+(v===state.gameSpeed?'selected':'')+'>'+v+'×</option>').join('')+'</select></label>');
 if(prestigeExpanded&&$('prestige-detail-'+prestigeExpanded)){
  const detail=$('prestige-detail-'+prestigeExpanded);detail.hidden=false;
  detail.closest('.prestige-node').classList.add('prestige-expanded');
  detail.closest('.prestige-node').querySelector('.prestige-node-top').setAttribute('aria-expanded','true');
 }
}
let prestigeExpanded=null;
function togglePrestige(id){prestigeExpanded=prestigeExpanded===id?null:id;renderPrestige()}
function setGameSpeed(v){state.gameSpeed=clamp(Number(v)||1,1,1+prestigeBonus('speed'));save();render()}
const SKILLS=[
{id:'base',name:'Vernichtender Hieb',cd:10000,tree:-1,idx:-1},
{id:'rush',name:'Blutiger Ansturm',cd:12000,tree:0,idx:6},
{id:'bloodbath',name:'Blutbad',cd:30000,tree:0,idx:17},
{id:'curse',name:'Schattenfluch',cd:15000,tree:1,idx:6},
{id:'dark',name:'Finsternis',cd:35000,tree:1,idx:17},
{id:'breaker',name:'Schildbrecher',cd:16000,tree:2,idx:6},
{id:'bastion',name:'Letzte Bastion',cd:40000,tree:2,idx:17}
];
const $=id=>document.getElementById(id);
const fmt=n=>Math.floor(n).toLocaleString('de-CH');
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const nval=(x,def=0)=>Number.isFinite(Number(x))?Number(x):def;
const blankUp=()=>Object.fromEntries(FIELDS.map(k=>[k,0]));
const emptyLoot=()=>Loot.emptyRun();
const blankFx=()=>({time:0,bleeds:[],corrupt:[],resolve:[],cd:{},armorUntil:0,darkUntil:0,bastionUntil:0,hungerUntil:0,soulUntil:0,revenge:false});
const defaultRun=()=>({wave:1,highest:1,level:1,xp:0,gold:0,hp:100,kills:0,bosses:0,runUp:blankUp(),paused:false,active:true,elapsed:0,enemyHp:0,claimed:false,preview:false,build:null,fx:blankFx(),heroClock:0,enemyClock:0,loot:emptyLoot(),blessings:[],blessingChoices:[],blessingPending:false});
const defaults=()=>({coins:0,work:blankUp(),runs:0,best:1,settings:{auto:{}},run:defaultRun()});
let state;try{state=Object.assign(defaults(),JSON.parse(localStorage.getItem(KEY)||'{}'));state.work=Object.assign(blankUp(),state.work||{});state.prestige=Object.assign({},state.prestige||{});state.settings=Object.assign({auto:{}},state.settings||{});state.settings.auto=state.settings.auto||{};state.run=Object.assign(defaultRun(),state.run||{});state.run.runUp=Object.assign(blankUp(),state.run.runUp||{});state.run.loot=Loot.repair(state.run.loot);state.run.blessings=Array.isArray(state.run.blessings)?state.run.blessings:[];state.run.blessingChoices=Array.isArray(state.run.blessingChoices)?state.run.blessingChoices:[];state.run.blessingPending=Boolean(state.run.blessingPending&&state.run.blessingChoices.length)}catch{state=defaults()}
if(!state.run.build){ // Übernahme früherer laufender Test-Runs, ohne gratis Talente permanent zu vergeben.
 const prior=(()=>{try{return JSON.parse(localStorage.getItem('idle-rpg-warrior-build-v1')||'null')}catch{return null}})();
 const s=Warrior.snapshot();
 if(state.run.active&&Array.isArray(prior)&&prior.length===3){s.specs=prior;s.core=Array(9).fill(1);s.preview=true}
 state.run.build=s;state.run.preview=s.preview;
}
let inventoryOpen=false,selectedItemId=null;
let recentLoot=null;
const gear=()=>Loot.bonuses(state.run.loot.equipment);
const BLESSINGS=[{id:'blood',name:'Blutdurst',icon:'⚔️',desc:'+15 % Angriffsschaden'},{id:'vamp',name:'Vampirismus',icon:'🩸',desc:'3 % Lebensraub'},{id:'storm',name:'Sturmklinge',icon:'⚡',desc:'10 % Chance auf 40 % Bonus-Blitzschaden'},{id:'swift',name:'Eile',icon:'💨',desc:'+10 % Angriffstempo'},{id:'guard',name:'Eiserne Haut',icon:'🛡️',desc:'10 % weniger erlittener Schaden'},{id:'vigor',name:'Lebenskraft',icon:'💚',desc:'+20 % maximales Leben und Heilung'}];
const blessingCount=id=>(state.run.blessings||[]).filter(x=>x===id).length;
function offerBlessings(){const pool=BLESSINGS.slice();const picks=[];while(picks.length<3){const i=Math.floor(Math.random()*pool.length);picks.push(pool.splice(i,1)[0].id)}state.run.blessingChoices=picks;state.run.blessingPending=true;message='✨ Wähle einen Run-Segen!';}
function chooseBlessing(id){const r=state.run;if(!r.active||!r.blessingPending||!r.blessingChoices.includes(id))return;const oldMax=stats().hp;r.blessings.push(id);r.blessingChoices=[];r.blessingPending=false;if(id==='vigor')r.hp=Math.min(stats().hp,r.hp+stats().hp-oldMax);message='✨ '+BLESSINGS.find(x=>x.id===id).name+' erhalten!';save();render()}

const savedFx=state.run.fx;
function repairFx(raw){const f=blankFx();if(!raw||typeof raw!=='object')return f;f.time=clamp(nval(raw.time),0,1e12);for(const k of ['armorUntil','darkUntil','bastionUntil','hungerUntil','soulUntil'])f[k]=clamp(nval(raw[k]),0,1e12);f.revenge=Boolean(raw.revenge);f.cd={};for(const sk of SKILLS)f.cd[sk.id]=clamp(nval(raw.cd&&raw.cd[sk.id]),0,1e12);f.corrupt=(Array.isArray(raw.corrupt)?raw.corrupt:[]).slice(0,3).filter(x=>Number.isFinite(x)&&x>f.time);f.resolve=(Array.isArray(raw.resolve)?raw.resolve:[]).slice(0,5).filter(x=>Number.isFinite(x)&&x>f.time);f.bleeds=(Array.isArray(raw.bleeds)?raw.bleeds:[]).slice(0,8).filter(x=>x&&x.end>f.time&&x.remaining>0&&Number.isFinite(x.remaining)).map(x=>({end:nval(x.end),remaining:nval(x.remaining)}));return f}
let fx=repairFx(savedFx);const snapshot=state.run.build;const R=(t,j)=>Math.floor(nval(snapshot.specs?.[t]?.[j]||0));const C=j=>Number(snapshot.core?.[j]||0);
const specTotal=t=>snapshot.specs?.[t]?.reduce((s,x)=>s+x,0)||0;
const available=()=>SKILLS.filter(s=>s.tree===-1||R(s.tree,s.idx)>0).slice(0,4);
const count=arr=>arr.filter(v=>v>fx.time).length;
const bleeds=()=>fx.bleeds.length,corrupt=()=>count(fx.corrupt),resolve=()=>count(fx.resolve);
const expiring=(x,after=0)=>x>fx.time+after;
const healingMult=()=> (1+.03*R(2,12))*(state.run.hp/stats().hp<.3?1+.05*R(2,16):1);
const damageMult=()=> (1+corrupt()*.03*(1+.02*R(1,12))*(1+gear().corruption))*(expiring(fx.darkUntil)?1.25:1)*(expiring(fx.soulUntil)?1+.04*R(1,13):1)*(enemy.wave%10===0&&corrupt()>0?1+.04*R(1,16):1);
const executeMult=()=> (enemyHp/enemy.maxHp<.35?1+.04*R(0,11):1)*(enemyHp/enemy.maxHp<.30&&C(8)?1.1:1);
function stats(){
 const r=state.run,w=state.work,g=gear();
 const rawAtk=10+2*w.atk+2*r.runUp.atk+2*(r.level-1);
 const rawHp=100+15*w.hp+15*r.runUp.hp+10*(r.level-1);
 const rawDef=2+w.def+r.runUp.def+Math.floor((r.level-1)/4);
 return {
 atk:(rawAtk+g.atk)*(1+.05*C(0)),
 hp:(rawHp+g.hp)*(1+.10*C(1)+.03*R(2,0)+.02*R(2,9)+g.hpPct)*(1+.20*blessingCount('vigor')),
 def:(rawDef+g.def)*(1+.05*C(2)+.03*R(2,2)+(.03*R(2,14)*(resolve()===5?1:0))),
 regen:(.5+.35*w.regen+.35*r.runUp.regen+g.regen)*(1+.10*C(4)+.04*R(2,8)),
 speed:Math.max(280,1100-24*(w.speed+r.runUp.speed))/(1+.10*blessingCount('swift'))/(1+prestigeBonus('tempo')/100)/(1+.05*C(3)+.02*R(0,2)+g.speed+(r.hp/Math.max(1,(rawHp+g.hp)*(1+.10*C(1)+.03*R(2,0)+.02*R(2,9)+g.hpPct))<.4&&R(0,12)? .15:0)+(expiring(fx.hungerUntil)?.02*R(0,16):0)),
 crit:clamp(5+w.crit+r.runUp.crit+5*C(5)+2*R(0,8)+g.crit*100,0,95),
 critMult:1.5+.10*C(6)+g.critDamage
 };
}
function enemyFor(w){
 const boss=w%10===0,zone=w%50===0,decade=Math.floor((w-1)/10);
 const kind=zone?'zonenfuerst':boss?'boss':w%5===0?'wolf':w%3===0?'goblin-krieger':'goblin';
 return {wave:w,name:zone?'Zonenfürst':boss?'Wellenboss':w%5===0?'Waldwolf':w%3===0?'Goblin-Krieger':'Waldgoblin',art:'assets/enemies/'+kind+'.png',kind,maxHp:Math.round((36+6*w)*(1+.16*decade)*(boss?3:1)*(zone?1.45:1)),atk:Math.max(1,Math.round((3+.42*w)*(1+.1*decade)*(boss?1.2:1)*(zone?1.15:1))),def:Math.floor((w-1)/15),speed:zone?1650:boss?1700:1950,boss,zone};
}
let enemy=enemyFor(state.run.wave),enemyHp=state.run.enemyHp>0?Math.min(enemy.maxHp,state.run.enemyHp):enemy.maxHp;
let heroClock=Math.max(0,nval(state.run.heroClock)),enemyClock=Math.max(0,nval(state.run.enemyClock)),bossPhase=0,strikeFlash=0;
let last=performance.now(),renderClock=0,saveClock=0,message='Der Kampf beginnt.';
Warrior.earnThrough(Math.max(0,Math.floor(nval(state.best))-1)); // Nur nachweislich früher abgeschlossene Wellen übernehmen.
function save(){state.run.fx=fx;state.run.heroClock=heroClock;state.run.enemyClock=enemyClock;state.run.enemyHp=enemyHp;try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function heal(raw){const h=Math.max(0,raw*healingMult());state.run.hp=Math.min(stats().hp,state.run.hp+h)}
function debuffDuration(ms){return ms*(1+.03*R(1,2)+gear().curseDuration)}
function applyBleed(forced=false,normal=false){
 const bleedChance=(R(0,0)>0?.20:0)+.05*R(0,0)+gear().bleedChance;
 if(!forced&&(!normal||Math.random()>=bleedChance))return false;
 const duration=debuffDuration(6000+1000*R(0,4));
 const total=stats().atk*.30*(1+.10*R(0,5))*(1+gear().bleed);
 fx.bleeds=fx.bleeds.filter(b=>b.end>fx.time&&b.remaining>0);
 if(fx.bleeds.length>=5+R(0,7))fx.bleeds.shift();
 fx.bleeds.push({end:fx.time+duration,remaining:total});return true;
}
function applyCorrupt(forced=false,normal=false){
 const corruptChance=(R(1,0)>0?.20:0)+.04*R(1,0);
 if(!forced&&(!normal||Math.random()>=corruptChance))return false;
 if(corrupt()>=3)fx.corrupt.shift();
 fx.corrupt.push(fx.time+debuffDuration(8000+600*R(1,15)));
 let damage=stats().atk*(.1+.02*R(1,9))*(1+.03*R(1,11))*(1+.04*R(1,5)); // Schattenimpuls beim Auftragen.
 damage*=damageMult()*executeMult()*(1+gear().shadow);
 enemyHp-=damage;return true;
}
function applyResolve(forced=false){
 if(specTotal(2)===0)return false;
 if(!forced&&Math.random()>=.05*R(2,5))return false;
 if(resolve()>=5)fx.resolve.shift();
 fx.resolve.push(fx.time+8000);return true;
}
function playHero(name,force){const s=window.DarkWarriorSprite;if(s&&s.play)s.play(name,!!force)}
function playFoe(name){const s=window.EnemySprite;if(!s)return;if(name==='death'){if(s.die)s.die(enemy.kind)}else if(s.has&&s.has(enemy.kind)&&s.play)s.play(name)}
function attack(power=1,kind='normal'){
 const s=stats(),isNormal=kind==='normal',base=kind==='base',wasBleeding=bleeds()>0,wasCorrupt=corrupt()>0;
 let defense=enemy.def*(expiring(fx.armorUntil)?1-(10+R(0,3)+R(1,3)+R(2,3))/100:1);
 let dmg=Math.max(1,s.atk*power*(1+.02*R(0,1)+.02*R(1,1)+(resolve()>=3?.02*R(2,15):0))-defense);
 const critical=Math.random()*100<s.crit;
 if(critical){
  dmg*=s.critMult+((wasCorrupt||wasBleeding||expiring(fx.armorUntil))?.02*R(1,7):0);
  if(R(0,10)){for(const b of fx.bleeds)b.end+=400*R(0,10)} // Nur Laufzeit, keine zusätzliche Gesamtschadensmenge.
 }
 dmg*= (1+.15*blessingCount('blood'))*(Math.random()<.10*blessingCount('storm')?.4+1:1)*damageMult()*executeMult()*(wasBleeding?1+.03*R(0,13):1)*(base&&wasCorrupt?1+.05*R(1,8):1);
 if(fx.revenge){dmg*=1+.06*R(0,14)+.04*R(2,13);fx.revenge=false}
 enemyHp-=dmg;heal(dmg*(.01*R(2,1)+gear().lifeSteal+.03*blessingCount('vamp')));
 if(base)fx.armorUntil=fx.time+debuffDuration(5000);
 if(isNormal)applyBleed(false,true);
 if(isNormal||expiring(fx.darkUntil))applyCorrupt(expiring(fx.darkUntil),isNormal);
 applyResolve();
 if(typeof playHero==='function'){playHero('attack');playFoe('hit')}
 return dmg;
}
function counter(){
 const s=stats(),dmg=Math.max(1,.75*s.atk-enemy.def*(expiring(fx.armorUntil)?.75:1))*damageMult()*executeMult()*(1+.03*R(2,11)*resolve())*(expiring(fx.bastionUntil)?1.15:1)*(1+gear().counter);
 enemyHp-=dmg;heal(dmg*(.01*R(2,1)+gear().lifeSteal));
 if(typeof playHero==='function'){playHero('attack');playFoe('hit')}
 return dmg;
}
function cast(id){
 const skill=available().find(x=>x.id===id);
 if(!skill||!state.run.active||state.run.paused||nval(fx.cd[id])>fx.time)return false;
 if(id==='base')attack(1.5,'base');
 if(id==='rush'){attack(1.8,'rush');applyBleed(true)}
 if(id==='bloodbath'){const remain=fx.bleeds.reduce((s,b)=>s+b.remaining,0);const bossMod=enemy.wave%10===0?1+.04*R(0,15):1;enemyHp-=remain*damageMult()*executeMult()*bossMod*(1+gear().bloodbath);fx.bleeds=[]}
 if(id==='curse')for(let n=0;n<3;n++)applyCorrupt(true);
 if(id==='dark')fx.darkUntil=fx.time+10000;
 if(id==='breaker'){attack(1.4,'breaker');for(let n=0;n<3;n++)applyResolve(true)}
 if(id==='bastion')fx.bastionUntil=fx.time+8000;
 fx.cd[id]=fx.time+skill.cd;
 message='✨ '+skill.name;
 if(enemyHp<=0)win();
 render();save();return true;
}
function skillAuto(id){
 if(id==='base')return !expiring(fx.armorUntil,500);
 if(id==='rush')return bleeds()<5+R(0,7);
 if(id==='bloodbath')return bleeds()>=3&&(enemy.wave%10===0||enemyHp/enemy.maxHp<.6);
 if(id==='curse')return corrupt()<2;
 if(id==='dark')return enemy.wave%10===0&&enemyHp/enemy.maxHp>.25;
 if(id==='breaker')return resolve()<3;
 if(id==='bastion')return state.run.hp/stats().hp<.6;
 return false;
}
function autoCast(){for(const skill of available()){if(skill.id==='base'&&Warrior.load().purchased<1)continue;if(state.settings.auto[skill.id]===true&&fx.cd[skill.id]<=fx.time&&skillAuto(skill.id)){cast(skill.id);break}}}
function toggleAuto(id){state.settings.auto[id]=!state.settings.auto[id];save();render()}
function gainLevel(){const r=state.run;while(r.xp>=r.level*40){r.xp-=r.level*40;r.level++;heal(10);message='⭐ Level '+r.level+' erreicht!'}}
function win(killedByBleed=false){
 const r=state.run,w=r.wave,boss=w%10===0,wasBleeding=bleeds()>0||killedByBleed,wasCorrupt=corrupt()>0;
 if(wasBleeding&&R(0,16))fx.hungerUntil=fx.time+6000;
 if(wasCorrupt&&R(1,13))fx.soulUntil=fx.time+5000;
 fx.bleeds=[];fx.corrupt=[];fx.armorUntil=0; // Eigene Buffs und Cooldowns laufen über die Wellen weiter.
 let gold=Math.round((8+w*2)*(boss?5:1)*(1+prestigeBonus('gold')/100)),coins=Math.max(1,Math.round((1+w*.1)*(boss?5:1)*(1+prestigeBonus('coins')/100)));
 r.gold+=gold;if(!r.preview)state.coins+=coins;
 r.xp+=Math.round((10+Math.round(w*1.6)*(boss?3:1))*(1+prestigeBonus('xp')/100));r.kills++;if(boss)r.bosses++;
 gainLevel();let dropped=Loot.award(r.loot,w,r.level,boss);if(!dropped&&Math.random()<prestigeBonus('loot')/100){const extra=Loot.roll({wave:w,level:r.level,boss:true,seq:++r.loot.seq});if(extra){dropped=extra;if(r.loot.inventory.length<50)r.loot.inventory.push(extra);else r.loot.ground.push({item:extra,dropWave:w})}}
 if(dropped)recentLoot={id:dropped.id,name:dropped.name,rarity:dropped.rarity,slot:dropped.slot,ground:!r.loot.inventory.some(x=>x.id===dropped.id)};
 r.wave++;Loot.expireGround(r.loot,r.wave);r.highest=Math.max(r.highest,r.wave);
 if(!r.preview)state.best=Math.max(state.best,r.highest);
 if(w%5===0)offerBlessings();
 const milestone=r.preview?0:Warrior.earnThrough(w);
 if(typeof playFoe==='function')playFoe('death');
 message=(boss?'🏆 ':'')+'Welle '+w+' geschafft! +'+fmt(gold)+' Gold · +'+fmt(coins)+' Münzen'+(milestone?' · +'+milestone+' Talentpunkt'+(milestone>1?'e':''):'');
 enemy=enemyFor(r.wave);enemyHp=enemy.maxHp;bossPhase=0;strikeFlash=0;
 save();render();
}
function lose(){
 const r=state.run;
 r.active=false;
 message='💀 Der Dunkle Krieger ist gefallen.';
 if(typeof playHero==='function')playHero('death',true);
 save();render();
}
function tick(dt){
 if(!state.run.active||state.run.paused||state.run.blessingPending)return;
 const speed=state.gameSpeed||1;
 dt*=speed;
 fx.time+=dt;
 const s=stats();
 // Regeneration
 if(s.regen>0)heal(s.regen*dt/1000);
 // Hero attack
 heroClock+=dt;
 if(heroClock>=s.speed){
  heroClock-=s.speed;
  const dmg=attack();
  if(enemyHp<=0){win();return}
 }
 // Enemy attack
 enemyClock+=dt;
 if(enemyClock>=enemy.speed){
  enemyClock-=enemy.speed;
  let edmg=Math.max(1,enemy.atk-s.def*(expiring(fx.bastionUntil)?.0.6:1));
  edmg*=(1-.10*blessingCount('guard'));
  if(expiring(fx.armorUntil))edmg*=0.85;
  state.run.hp-=edmg;
  if(typeof playFoe==='function')playFoe('attack');
  if(typeof playHero==='function')playHero('hit');
  if(state.run.hp<=0){lose();return}
 }
 // Bleed ticks
 for(const b of fx.bleeds){
  if(b.end>fx.time&&b.remaining>0){
   const tickDmg=b.remaining*dt/Math.max(1,b.end-fx.time);
   b.remaining-=tickDmg;
   enemyHp-=tickDmg;
  }
 }
 fx.bleeds=fx.bleeds.filter(b=>b.end>fx.time&&b.remaining>0);
 if(enemyHp<=0)win(true);
 // Auto skills
 autoCast();
}
function render(){
 const r=state.run,s=stats();
 updateHtml('wave','Welle '+r.wave);
 updateHtml('gold',fmt(r.gold)+' Gold');
 updateHtml('hpText',Math.max(0,Math.floor(r.hp))+' / '+Math.floor(s.hp)+' HP');
 const hpPct=Math.max(0,Math.min(100,r.hp/s.hp*100));
 if($('hpBar'))$('hpBar').style.width=hpPct+'%';
 updateHtml('enemyName',enemy.name);
 updateHtml('enemyHpText',Math.max(0,Math.floor(enemyHp))+' / '+enemy.maxHp+' HP');
 const ePct=Math.max(0,Math.min(100,enemyHp/enemy.maxHp*100));
 if($('enemyBar'))$('enemyBar').style.width=ePct+'%';
 if($('enemySprite'))$('enemySprite').src=enemy.art+'?v=e13';
 updateHtml('log',message);
 // Skills
 const skills=available();
 updateHtml('skills',skills.map(sk=>{
  const cd=Math.max(0,Math.ceil((nval(fx.cd[sk.id])-fx.time)/1000));
  const ready=cd<=0;
  const auto=state.settings.auto[sk.id];
  return '<div class="skill"><button '+(ready?'':'disabled')+' onclick="cast(\''+sk.id+'\')">'+sk.name+(ready?'':' ('+cd+'s)')+'</button><label class="auto"><input type="checkbox" '+(auto?'checked':'')+' onchange="toggleAuto(\''+sk.id+'\')"> Auto</label></div>';
 }).join(''));
 // Blessings
 if(r.blessingPending){
  updateHtml('blessingPanel','<h2>✨ Run-Segen wählen</h2><p class="run-note">Der Kampf läuft während deiner Wahl weiter. Alle Segen gelten nur für diesen Run; gleiche Segen können sich in späteren Wellen stapeln.</p><div class="blessing-grid">'+r.blessingChoices.map(id=>{const b=BLESSINGS.find(x=>x.id===id);return '<button class="blessing-choice" onclick="chooseBlessing(\''+id+'\')"><b>'+b.icon+' '+b.name+'</b><small>'+b.desc+'</small></button>'}).join('')+'</div>');
  $('blessingPanel').classList.remove('hidden');
 }else{
  if($('blessingPanel'))$('blessingPanel').classList.add('hidden');
 }
 renderPrestige();
 // Other UI updates as needed
}
function updateHtml(id,html){const el=$(id);if(el)el.innerHTML=html}
// Event listeners and start
document.addEventListener('DOMContentLoaded',()=>{
 // ... other listeners ...
 render();
});
function frame(now){const dt=clamp(now-last,0,100);last=now;tick(dt);renderClock+=dt;saveClock+=dt;if(renderClock>200){renderClock=0;render()}if(saveClock>2000){saveClock=0;save()}requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
