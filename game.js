/* Idle RPG V0.3 – Dunkler Krieger, vollständiges Kampfsystem */
(function(){
'use strict';
const KEY='idle-rpg-core-v01',FIELDS=['atk','hp','def','regen','speed','crit'];
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
 $('prestigeTree').innerHTML='<div class="prestige-wallet"><span>🪙 '+fmt(state.coins)+' Münzen</span><small>Wähle einen Knoten für den nächsten Bonus</small></div><div class="prestige-grid">'+branches.map(([branch,icon])=>'<section class="prestige-column"><h3>'+icon+' '+branch+'</h3>'+PRESTIGE.filter(n=>n.branch===branch).map((n,i)=>{
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
 }).join('')+'</section>').join('')+'</div>';
 const cap=1+prestigeBonus('speed');
 state.gameSpeed=clamp(Number(state.gameSpeed)||1,1,cap);
 $('prestigeSpeed').innerHTML='<label>⏩ Spieltempo: '+state.gameSpeed+'× (freigeschaltet bis '+cap+'×) <select onchange="setGameSpeed(this.value)">'+Array.from({length:cap},(_,i)=>i+1).map(v=>'<option value="'+v+'" '+(v===state.gameSpeed?'selected':'')+'>'+v+'×</option>').join('')+'</select></label>';
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
// Diminishing returns for repeated identical blessings: 100%, 67%, then 40% per extra stack.
const blessingPower=id=>{const n=blessingCount(id);return n<=1?n:n===2?1.67:1.67+(n-2)*.40;};
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
 hp:(rawHp+g.hp)*(1+.10*C(1)+.03*R(2,0)+.02*R(2,9)+g.hpPct)*(1+.20*blessingPower('vigor')),
 def:(rawDef+g.def)*(1+.05*C(2)+.03*R(2,2)+(.03*R(2,14)*(resolve()===5?1:0))),
 regen:(.5+.35*w.regen+.35*r.runUp.regen+g.regen)*(1+.10*C(4)+.04*R(2,8)),
 speed:Math.max(280,1100-24*(w.speed+r.runUp.speed))/(1+.10*blessingPower('swift'))/(1+prestigeBonus('tempo')/100)/(1+.05*C(3)+.02*R(0,2)+g.speed+(r.hp/Math.max(1,(rawHp+g.hp)*(1+.10*C(1)+.03*R(2,0)+.02*R(2,9)+g.hpPct))<.4&&R(0,12)? .15:0)+(expiring(fx.hungerUntil)?.02*R(0,16):0)),
 crit:clamp(5+w.crit+r.runUp.crit+5*C(5)+2*R(0,8)+g.crit*100,0,95),
 critMult:1.5+.10*C(6)+g.critDamage
 };
}
function enemyFor(w){
 const boss=w%10===0,zone=w%50===0,scale=Math.pow(1.055,w-1);
 return {wave:w,name:zone?'Zonenfürst':boss?'Wellenboss':w%5===0?'Waldwolf':w%3===0?'Goblin-Krieger':'Waldgoblin',icon:zone?'🐉':boss?'👹':w%5===0?'🐺':'👺',maxHp:Math.round((45+2*w)*scale*(zone?4.5:boss?3.5:1)),atk:Math.max(1,Math.round((4+w*.38)*Math.pow(1.045,w-1)*(zone?1.8:boss?1.6:1)*(boss?.65:1))),def:Math.floor(w/6),speed:zone?1650:boss?1700:1950};
}
let enemy=enemyFor(state.run.wave),enemyHp=state.run.enemyHp>0?Math.min(enemy.maxHp,state.run.enemyHp):enemy.maxHp;
let heroClock=Math.max(0,nval(state.run.heroClock)),enemyClock=Math.max(0,nval(state.run.enemyClock));
let last=performance.now(),renderClock=0,saveClock=0,message='Der Kampf beginnt.';
Warrior.earnThrough(Math.max(0,Math.floor(nval(state.best))-1)); // Nur nachweislich früher abgeschlossene Wellen übernehmen.
function save(){state.run.fx=fx;state.run.heroClock=heroClock;state.run.enemyClock=enemyClock;state.run.enemyHp=enemyHp;try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function heal(raw){const h=Math.max(0,raw*healingMult());state.run.hp=Math.min(stats().hp,state.run.hp+h)}
function debuffDuration(ms){return ms*(1+.03*R(1,2)+gear().curseDuration)}
function applyBleed(forced=false,normal=false){
 if(!forced&&(!normal||Math.random()>=.05*R(0,0)+gear().bleedChance))return false;
 const duration=debuffDuration(6000+1000*R(0,4));
 const total=stats().atk*.30*(1+.10*R(0,5))*(1+gear().bleed);
 fx.bleeds=fx.bleeds.filter(b=>b.end>fx.time&&b.remaining>0);
 if(fx.bleeds.length>=5+R(0,7))fx.bleeds.shift();
 fx.bleeds.push({end:fx.time+duration,remaining:total});return true;
}
function applyCorrupt(forced=false,normal=false){
 if(!forced&&(!normal||Math.random()>=.04*R(1,0)))return false;
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
function attack(power=1,kind='normal'){
 const s=stats(),isNormal=kind==='normal',base=kind==='base',wasBleeding=bleeds()>0,wasCorrupt=corrupt()>0;
 let defense=enemy.def*(expiring(fx.armorUntil)?1-(10+R(0,3)+R(1,3)+R(2,3))/100:1);
 let dmg=Math.max(1,s.atk*power*(1+.02*R(0,1)+.02*R(1,1)+(resolve()>=3?.02*R(2,15):0))-defense);
 const critical=Math.random()*100<s.crit;
 if(critical){
  dmg*=s.critMult+((wasCorrupt||wasBleeding||expiring(fx.armorUntil))?.02*R(1,7):0);
  if(R(0,10)){for(const b of fx.bleeds)b.end+=400*R(0,10)} // Nur Laufzeit, keine zusätzliche Gesamtschadensmenge.
 }
 dmg*= (1+.15*blessingPower('blood'))*(Math.random()<.10*blessingPower('storm')?.4+1:1)*damageMult()*executeMult()*(wasBleeding?1+.03*R(0,13):1)*(base&&wasCorrupt?1+.05*R(1,8):1);
 if(fx.revenge){dmg*=1+.06*R(0,14)+.04*R(2,13);fx.revenge=false}
 enemyHp-=dmg;heal(dmg*(.01*R(2,1)+gear().lifeSteal+.03*blessingPower('vamp')));
 if(base)fx.armorUntil=fx.time+debuffDuration(5000);
 if(isNormal)applyBleed(false,true);
 if(isNormal||expiring(fx.darkUntil))applyCorrupt(expiring(fx.darkUntil),isNormal);
 applyResolve();return dmg;
}
function counter(){
 const s=stats(),dmg=Math.max(1,.75*s.atk-enemy.def*(expiring(fx.armorUntil)?.75:1))*damageMult()*executeMult()*(1+.03*R(2,11)*resolve())*(expiring(fx.bastionUntil)?1.15:1)*(1+gear().counter);
 enemyHp-=dmg;heal(dmg*(.01*R(2,1)+gear().lifeSteal));return dmg;
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
function autoCast(){for(const skill of available()){if(state.settings.auto[skill.id]===true&&fx.cd[skill.id]<=fx.time&&skillAuto(skill.id)){cast(skill.id);break}}}
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
 enemy=enemyFor(r.wave);enemyHp=enemy.maxHp;heroClock=enemyClock=0;
 message=(boss?'👑 Boss besiegt! ':'')+'+'+fmt(gold)+' Gold'+(r.preview?' (Testmodus)':' · +'+fmt(coins)+' Münzen')+(milestone?' · ⭐ Hauptbaum-Punkt!':'')+(dropped?' · 🎁 '+dropped.name+(r.loot.inventory.some(x=>x.id===dropped.id)?'':' (liegt am Boden)'):'');
 save();
}
function finish(reason){
 const r=state.run;if(!r.active)return;
 r.active=false;r.paused=true;state.runs++;if(!r.preview)state.best=Math.max(state.best,r.highest);
 let souls=0;if(!r.claimed){r.claimed=true;if(!r.preview)souls=Warrior.awardSouls(r.highest,r.startBest)}
 $('summary').textContent=reason+' · Höchste Welle: '+fmt(r.highest)+' · Besiegte Gegner: '+fmt(r.kills)+' · Bosse: '+fmt(r.bosses)+' · Zeit: '+Math.floor(r.elapsed/60)+' Min. · '+(r.preview?'Testmodus – keine permanenten Belohnungen':'+'+souls+' Seelen · Gesamt: '+Warrior.load().souls);
 $('runEnd').classList.remove('hidden');message=reason;save();render();
}
function startRun(){
 recentLoot=null;
 Warrior.reload();
 try{const latest=JSON.parse(localStorage.getItem(KEY)||'null');if(latest){state.coins=nval(latest.coins,state.coins);state.work=Object.assign(blankUp(),latest.work||state.work);state.prestige=Object.assign({},latest.prestige||state.prestige);state.gameSpeed=latest.gameSpeed||state.gameSpeed}}catch{}
 state.run=defaultRun();state.run.startBest=state.best||1;state.run.build=Warrior.snapshot();state.run.preview=state.run.build.preview;
 // Der Snapshot wird zu Beginn fixiert und bleibt auch bei späteren Änderungen im Planer stabil.
 const b=state.run.build;
 snapshot.core=b.core;snapshot.specs=b.specs;
 fx=blankFx();inventoryOpen=false;selectedItemId=null;tab('run');enemy=enemyFor(1);enemyHp=enemy.maxHp;heroClock=enemyClock=0;
 state.run.hp=stats().hp;$('runEnd').classList.add('hidden');
 message=state.run.preview?'🧪 Test-Run – keine dauerhaften Belohnungen.':'Neuer Run gestartet!';
 save();render();
}
function togglePause(){const r=state.run;if(!r.active)return;r.paused=!r.paused;message=r.paused?'⏸ Pausiert':'▶️ Kampf läuft';save();render()}
function endRun(){if(state.run.active&&confirm('Run wirklich beenden? Gold und Level werden zurückgesetzt. Du erhältst Seelen für die höchste Welle.'))finish('Run freiwillig beendet')}
function cost(k,permanent){let lvl=permanent?state.work[k]:state.run.runUp[k];return Math.max(1,Math.round(BASE_COST[k]*(permanent?2:1)*Math.pow(permanent?1.25:1.5,lvl)*(permanent?1-prestigeBonus('discount')/100:1)))}
function upgrade(k,permanent){
 const c=cost(k,permanent);if(permanent){if(state.run.preview||state.coins<c)return;state.coins-=c;state.work[k]++}else{if(!state.run.active||state.run.gold<c)return;state.run.gold-=c;state.run.runUp[k]++}
 if(k==='hp')heal(15);state.run.hp=Math.min(state.run.hp,stats().hp);save();render();
}
function tick(dt){
 const r=state.run;if(!r.active||r.paused||r.blessingPending||inventoryOpen||document.hidden)return;
 r.elapsed+=dt/1000;dt*=clamp(Number(state.gameSpeed)||1,1,1+prestigeBonus('speed'));fx.time+=dt;const s=stats();
 heal(s.regen*dt/1000);
 fx.resolve=fx.resolve.filter(x=>x>fx.time);fx.corrupt=fx.corrupt.filter(x=>x>fx.time);
 let bleedDamage=0;for(const b of fx.bleeds){const left=Math.max(0,b.end-(fx.time-dt));const step=Math.min(dt,left);const dealt=left>0?b.remaining*step/left:0;b.remaining=Math.max(0,b.remaining-dealt);bleedDamage+=dealt}
 fx.bleeds=fx.bleeds.filter(b=>b.end>fx.time&&b.remaining>.00001);
 if(bleedDamage){const real=bleedDamage*damageMult()*executeMult()*(enemy.wave%10===0?1+.04*R(0,15):1);enemyHp-=real;heal(real*.01*R(0,9))}
 if(enemyHp<=0){win(bleedDamage>0);return}
 heroClock+=dt;enemyClock+=dt;
 if(heroClock>=s.speed){heroClock-=s.speed;attack();if(enemyHp<=0){win();return}}
 if(enemyClock>=enemy.speed*(corrupt()>0?1+.02*R(1,10):1)){
  enemyClock-=enemy.speed*(corrupt()>0?1+.02*R(1,10):1);
  let incoming=Math.max(1,enemy.atk*(corrupt()>0?1-.02*R(1,4):1)-stats().def);
  incoming*=Math.max(.1,1-.02*resolve())*(1-.05*C(7))*(1-.02*R(2,4))*(corrupt()>0?1-.02*R(1,14):1);
  if(r.hp/stats().hp<.4)incoming*=1-.02*R(2,10);
  if(expiring(fx.bastionUntil))incoming*=.7;
  incoming*=Math.pow(.90,blessingPower('guard'));incoming*=1-gear().reduction;incoming*=1-prestigeBonus('guard')/100;
  r.hp-=Math.max(1,incoming);
  if(r.hp<=0){r.hp=0;finish('💀 Besiegt');return}
  fx.revenge=true;
  if(specTotal(2)>0)applyResolve(true);
  if(Math.random()<.04*R(2,7))counter();
  if(enemyHp<=0){win();return}
 }
 autoCast();
}
function tab(id){inventoryOpen=id==='items';for(const x of ['run','shop','items','info']){$(x).classList.toggle('hidden',x!==id);$('tab'+x[0].toUpperCase()+x.slice(1)).classList.toggle('active',x===id)}if(inventoryOpen)renderInventory();save()}
function upgradeRows(permanent){return FIELDS.map(k=>{
 const lvl=permanent?state.work[k]:state.run.runUp[k],c=cost(k,permanent),can=(permanent?state.coins:state.run.gold)>=c;
 return '<div class="row item"><span>'+LABELS[k]+' <span class="muted">Stufe '+lvl+'</span></span><button '+(!can||(permanent&&state.run.preview)||(!permanent&&!state.run.active)?'disabled':'')+' onclick="upgrade(\''+k+'\','+permanent+')">'+(permanent?'🪙':'💰')+' '+fmt(c)+'</button></div>'
 }).join('')}

const safeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const itemOnclick=(fn,value)=>fn+'('+JSON.stringify(value)+')';
function inspectItem(id){selectedItemId=String(id);renderInventory()}
function dismissRecentLoot(){recentLoot=null;const notice=$('lootNotice');if(notice)notice.classList.add('hidden')}
function viewRecentLoot(){if(!recentLoot)return;const id=recentLoot.id;tab('items');selectedItemId=String(id);renderInventory();$('itemDetail').scrollIntoView({behavior:'smooth',block:'center'})}
function itemAction(action,id){
 const r=state.run,loot=r.loot,bag=loot.inventory,idText=String(id);
 if(action==='equip'){
  const i=bag.findIndex(x=>x.id===idText);if(i<0)return;
  const item=bag[i];if(item.required>r.level){message='Erfordert Heldenlevel '+item.required;render();return}
  bag.splice(i,1);const old=loot.equipment[item.slot];if(old)bag.push(old);
  loot.equipment[item.slot]=item;message='🛡️ '+item.name+' ausgerüstet';
 }else if(action==='unequip'){
  if(bag.length>=50)return;
  const item=loot.equipment[idText];if(!item)return;
  bag.push(item);loot.equipment[idText]=null;message='Ausrüstung abgelegt';
 }else if(action==='sell'){
  const i=bag.findIndex(x=>x.id===idText);if(i<0)return;
  const item=bag.splice(i,1)[0];r.gold+=item.sell;message='💰 '+fmt(item.sell)+' Gold durch Verkauf';
 }else if(action==='pickup'){
  if(bag.length>=50)return;
  const i=loot.ground.findIndex(x=>x.item.id===idText);if(i<0)return;
  bag.push(loot.ground.splice(i,1)[0].item);message='🎒 Beute aufgehoben';
 }else return;
 r.hp=Math.min(r.hp,stats().hp);
 if(action==='equip'||(recentLoot&&recentLoot.id===idText&&action==='sell'))dismissRecentLoot();
 selectedItemId=null;save();render();renderInventory();
}
function compareEquipment(item,equipment){
 const current=equipment[item.slot];
 if(current&&current.id===item.id)return '<div class="compare-title">✓ Bereits ausgerüstet</div>';
 const before=Loot.bonuses(equipment);
 const after=Loot.bonuses({...equipment,[item.slot]:item});
 const stats=Object.keys(Loot.stat);
 const rows=stats.map(k=>{
  const delta=(after[k]||0)-(before[k]||0);
  if(Math.abs(delta)<0.000001)return '';
  const spec=Loot.stat[k];
  const percent=spec.unit!=='flat'&&spec.unit!=='decimal';
  const formatted=percent?(Math.abs(delta)*100).toFixed(1).replace(/\\.0$/,'')+' %':spec.unit==='decimal'?Math.abs(delta).toFixed(2):Math.abs(delta).toFixed(1).replace(/\\.0$/,'');
  return '<div class="compare-row '+(delta>0?'compare-gain':'compare-loss')+'"><span>'+safeHtml(spec.name)+'</span><b>'+(delta>0?'▲ +':'▼ −')+formatted+'</b></div>';
 }).filter(Boolean).join('');
 const special=Object.keys(after).filter(k=>!stats.includes(k)&&k!=='sets'&&typeof after[k]==='number'&&Math.abs(after[k]-(before[k]||0))>0.000001).map(k=>{
  const d=after[k]-(before[k]||0);
  return '<div class="compare-row '+(d>0?'compare-gain':'compare-loss')+'"><span>'+safeHtml(k)+'</span><b>'+(d>0?'▲ +':'▼ −')+Math.abs(d*100).toFixed(1)+' %</b></div>';
 }).join('');
 const oldSets=new Set(before.sets.map(s=>s.name)),newSets=new Set(after.sets.map(s=>s.name));
 const setRows=[...after.sets.filter(s=>!oldSets.has(s.name)).map(s=>'<div class="compare-gain">▲ Setbonus: '+safeHtml(s.description)+'</div>'),...before.sets.filter(s=>!newSets.has(s.name)).map(s=>'<div class="compare-loss">▼ Setbonus verloren: '+safeHtml(s.description)+'</div>')].join('');
 return '<div class="item-compare"><div class="compare-title">⚖️ Vergleich mit '+(current?safeHtml(current.name):'leerem '+safeHtml(Loot.slots.find(s=>s.id===item.slot)?.name||'Slot'))+'</div>'+(rows+special+setRows||'<span class="muted">Keine Veränderung der Kampfwerte.</span>')+'</div>';
}
function renderInventory(){
 const r=state.run,loot=r.loot,bag=loot.inventory,bonus=gear();
 $('lootInfo').textContent='Inventar '+bag.length+'/50 · Am Boden '+loot.ground.length+(r.active?' · ⏸ Kampf pausiert':' · Run beendet');
 const color=item=>Loot.rarity[item.rarity]?.color||'#b5c6c0';
 $('gearSlots').innerHTML=Loot.slots.map(slot=>{
  const item=loot.equipment[slot.id];
  return '<button class="loot-slot" '+(item?'style="border-color:'+color(item)+'"':'')+" onclick='"+itemOnclick('inspectItem',item?item.id:slot.id)+"'>"+
    '<span>'+slot.icon+' '+slot.name+'</span><small>'+(item?safeHtml(item.name):'Leer')+'</small></button>';
 }).join('');
 $('inventoryGrid').innerHTML=Array.from({length:50},(_,i)=>{
  const item=bag[i];
  return '<button class="loot-cell" '+(item?'style="border-color:'+color(item)+'" onclick=\''+itemOnclick('inspectItem',item.id)+'\'':'disabled')+'>'+
    '<span>'+(item?Loot.slots.find(s=>s.id===item.slot)?.icon||'🎁':'·')+'</span><small>'+(item?safeHtml(item.name):'')+'</small></button>';
 }).join('');
 $('groundLoot').innerHTML=loot.ground.length?loot.ground.map(entry=>{
  const item=entry.item;
  return '<button class="loot-ground" style="border-color:'+color(item)+"' onclick='"+itemOnclick('inspectItem',item.id)+"'>"+
   safeHtml(item.name)+' · verfällt nach Welle '+(entry.dropWave+5)+'</button>';
 }).join(''):'<span class="muted">Keine Beute am Boden.</span>';
 $('setBonuses').textContent=bonus.sets.length?bonus.sets.map(x=>x.description).join(' · '):'Setbonus: Ab zwei legendären Gegenständen desselben Sets.';
 const item=bag.find(x=>x.id===selectedItemId)||Object.values(loot.equipment).find(x=>x&&x.id===selectedItemId)||loot.ground.find(x=>x.item.id===selectedItemId)?.item;
 if(!item){$('itemDetail').innerHTML='<span class="muted">Tippe einen Gegenstand an, um Werte, Seltenheit und Effekte zu sehen.</span>';return}
 const inBag=bag.some(x=>x.id===item.id),onGround=loot.ground.some(x=>x.item.id===item.id);
 const unique=Loot.uniqueById[item.unique];
 const desc='<b style="color:'+color(item)+'">'+safeHtml(item.name)+'</b>'+
 '<div class="muted">'+Loot.rarity[item.rarity].name+' · Itemlevel '+item.level+' · Benötigt Level '+item.required+'</div>'+
 '<div class="loot-attrs">'+item.affixes.map(a=>'<div>'+safeHtml(Loot.formatAffix(a))+'</div>').join('')+'</div>'+
 (unique?'<p class="legend-effect">✦ '+safeHtml(unique.description)+' · '+safeHtml(unique.set)+'-Set</p>':'')+compareEquipment(item,loot.equipment);
 const act=(fn,id,label,disabled=false,alt=false)=>'<button '+(alt?'class="alt" ':'')+(disabled?'disabled ':'')+"onclick='"+itemOnclick('itemAction',fn).replace(')',','+JSON.stringify(id)+')')+"'>"+label+'</button>';
 const actions=inBag?act('equip',item.id,'Ausrüsten',item.required>r.level)+' '+act('sell',item.id,'Verkaufen · '+fmt(item.sell)+' Gold',false,true):onGround?act('pickup',item.id,'Aufheben',bag.length>=50):act('unequip',item.slot,'Ablegen',bag.length>=50,true);
 $('itemDetail').innerHTML=desc+'<div class="loot-actions">'+actions+'</div>';
}
function render(){
 const r=state.run,s=stats(),f=available();
 const blessPanel=$('blessingPanel');blessPanel.classList.toggle('hidden',!r.active||!r.blessingPending);
 $('blessingChoices').innerHTML=(r.blessingChoices||[]).map(id=>{const b=BLESSINGS.find(x=>x.id===id);return b?'<button class="blessing-choice" onclick="chooseBlessing(\''+b.id+'\')"><strong>'+b.icon+' '+b.name+'</strong><small>'+b.desc+'</small></button>':''}).join('');
 $('blessingActive').textContent=r.blessings.length?'✨ Aktive Run-Segen: '+r.blessings.map(id=>BLESSINGS.find(x=>x.id===id)?.name||id).join(', '):'✨ Noch keine Run-Segen';
 const notice=$('lootNotice');
 if(recentLoot){
  const inBag=r.loot.inventory.some(x=>x.id===recentLoot.id),onGround=r.loot.ground.some(x=>x.item.id===recentLoot.id);
  if(!inBag&&!onGround)recentLoot=null;
 }
 if(recentLoot){
  const rarity=Loot.rarity[recentLoot.rarity];
  $('lootNoticeName').textContent=recentLoot.name;
  $('lootNoticeName').style.color=rarity?.color||'#e5d7b5';
  $('lootNoticeMeta').textContent=(rarity?.name||'Gegenstand')+' · '+(Loot.slots.find(x=>x.id===recentLoot.slot)?.name||'Ausrüstung')+(r.loot.ground.some(x=>x.item.id===recentLoot.id)?' · liegt am Boden':' · im Inventar');
  notice.classList.remove('hidden');
 }else notice.classList.add('hidden');
 $('wave').textContent='Welle '+fmt(r.wave)+(r.wave%50===0?' 👑 Zonenboss':r.wave%10===0?' 👑 Boss':'');
 $('money').textContent='💰 '+fmt(r.gold)+' · 🪙 '+fmt(state.coins)+' · 🔮 '+Warrior.load().souls;
 $('enemyIcon').textContent=enemy.icon;$('enemyIcon').className=r.wave%10===0?'boss':'';
 $('enemyName').textContent=enemy.name;$('hpBar').style.width=clamp(r.hp/s.hp*100,0,100)+'%';$('enemyBar').style.width=clamp(enemyHp/enemy.maxHp*100,0,100)+'%';
 $('hpText').textContent=fmt(r.hp)+' / '+fmt(s.hp)+' HP';$('enemyHpText').textContent=fmt(Math.max(0,enemyHp))+' / '+fmt(enemy.maxHp)+' HP';
 $('level').textContent='Level '+r.level+' · XP '+fmt(r.xp)+'/'+fmt(r.level*40);
 $('combatStats').textContent='⚔️ '+fmt(s.atk)+' · 🛡️ '+fmt(s.def);
 $('log').textContent=message;$('pauseBtn').textContent=r.paused?'▶️ Fortsetzen':'⏸ Pausieren';$('pauseBtn').disabled=!r.active;
 $('effects').textContent=(r.preview?'🧪 TESTMODUS · ':'')+'🩸 '+bleeds()+' Blutungen · 🌑 '+corrupt()+' Verderbnis · 🛡️ '+resolve()+' Entschlossenheit';
 $('skills').innerHTML=f.map(sk=>{const remaining=Math.max(0,Math.ceil((nval(fx.cd[sk.id])-fx.time)/1000));return '<div class="skill"><button '+(!r.active||r.paused||remaining?'disabled':'')+' onclick="cast(\''+sk.id+'\')">'+sk.name+(remaining?' · '+remaining+'s':'')+'</button><label class="auto"><input type="checkbox" '+(state.settings.auto[sk.id]?'checked':'')+' onchange="toggleAuto(\''+sk.id+'\')"> Auto</label></div>'}).join('');
 $('runUpgrades').innerHTML=upgradeRows(false);$('workshop').innerHTML=upgradeRows(true);renderPrestige();
}
if(!state.run.active){$('runEnd').classList.remove('hidden');$('summary').textContent='Letzter Run beendet. Höchste Welle: '+fmt(state.run.highest)+'. Starte einen neuen Run.'}else state.run.hp=clamp(state.run.hp,0,stats().hp);
window.inspectItem=inspectItem;window.itemAction=itemAction;window.viewRecentLoot=viewRecentLoot;window.dismissRecentLoot=dismissRecentLoot;
window.chooseBlessing=chooseBlessing;window.buyPrestige=buyPrestige;window.togglePrestige=togglePrestige;window.setGameSpeed=setGameSpeed;window.startRun=startRun;window.endRun=endRun;window.togglePause=togglePause;window.upgrade=upgrade;window.cast=cast;window.toggleAuto=toggleAuto;window.tab=tab;
render();document.addEventListener('visibilitychange',()=>{last=performance.now();save()});window.addEventListener('pagehide',save);window.addEventListener('pageshow',()=>{Warrior.reload();try{const latest=JSON.parse(localStorage.getItem(KEY)||'null');if(latest){state.coins=nval(latest.coins,state.coins);state.work=Object.assign(blankUp(),latest.work||state.work)}}catch{}render()});
function frame(now){const dt=clamp(now-last,0,100);last=now;tick(dt);renderClock+=dt;saveClock+=dt;if(renderClock>200){renderClock=0;render()}if(saveClock>2000){saveClock=0;save()}requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
