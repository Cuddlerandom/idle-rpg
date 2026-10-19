/* Idle RPG V0.3 – Dunkler Krieger, vollständiges Kampfsystem */
(function(){
'use strict';
const KEY='idle-rpg-core-v01',FIELDS=['atk','hp','def','regen','speed','crit'];
const LABELS={atk:'⚔️ Angriff',hp:'❤️ Max. Leben',def:'🛡️ Verteidigung',regen:'💚 Regeneration',speed:'⚡ Angriffstempo',crit:'🎯 Krit-Chance'};
const BASE_COST={atk:15,hp:15,def:22,regen:30,speed:40,crit:45};
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
const blankFx=()=>({time:0,bleeds:[],corrupt:[],resolve:[],cd:{},armorUntil:0,darkUntil:0,bastionUntil:0,hungerUntil:0,soulUntil:0,revenge:false});
const defaultRun=()=>({equipment:Equipment.blank(),wave:1,highest:1,level:1,xp:0,gold:0,hp:100,kills:0,bosses:0,runUp:blankUp(),paused:false,active:true,elapsed:0,enemyHp:0,claimed:false,preview:false,build:null,fx:blankFx(),heroClock:0,enemyClock:0});
const defaults=()=>({arsenal:Equipment.blankArsenal(),coins:0,work:blankUp(),runs:0,best:1,settings:{auto:{}},run:defaultRun()});
let state;try{state=Object.assign(defaults(),JSON.parse(localStorage.getItem(KEY)||'{}'));state.work=Object.assign(blankUp(),state.work||{});state.settings=Object.assign({auto:{}},state.settings||{});state.settings.auto=state.settings.auto||{};state.run=Object.assign(defaultRun(),state.run||{});state.run.runUp=Object.assign(blankUp(),state.run.runUp||{})}catch{state=defaults()}
state.arsenal=Equipment.repairArsenal(state.arsenal);
state.run.equipment=Equipment.repair(state.run.equipment);
if(!state.run.build){ // Übernahme früherer laufender Test-Runs, ohne gratis Talente permanent zu vergeben.
 const prior=(()=>{try{return JSON.parse(localStorage.getItem('idle-rpg-warrior-build-v1')||'null')}catch{return null}})();
 const s=Warrior.snapshot();
 if(state.run.active&&Array.isArray(prior)&&prior.length===3){s.specs=prior;s.core=Array(9).fill(1);s.preview=true}
 state.run.build=s;state.run.preview=s.preview;
}
let inventoryOpen=false,chosenItem=null,invDirty=true;
let itemMods=Equipment.bonuses(state.run.equipment);
function refreshItems(){itemMods=Equipment.bonuses(state.run.equipment);invDirty=true}
const savedFx=state.run.fx;
function repairFx(raw){const f=blankFx();if(!raw||typeof raw!=='object')return f;f.time=clamp(nval(raw.time),0,1e12);for(const k of ['armorUntil','darkUntil','bastionUntil','hungerUntil','soulUntil'])f[k]=clamp(nval(raw[k]),0,1e12);f.revenge=Boolean(raw.revenge);f.cd={};for(const sk of SKILLS)f.cd[sk.id]=clamp(nval(raw.cd&&raw.cd[sk.id]),0,1e12);f.corrupt=(Array.isArray(raw.corrupt)?raw.corrupt:[]).slice(0,3).filter(x=>Number.isFinite(x)&&x>f.time);f.resolve=(Array.isArray(raw.resolve)?raw.resolve:[]).slice(0,5).filter(x=>Number.isFinite(x)&&x>f.time);f.bleeds=(Array.isArray(raw.bleeds)?raw.bleeds:[]).slice(0,8).filter(x=>x&&x.end>f.time&&x.remaining>0&&Number.isFinite(x.remaining)).map(x=>({end:nval(x.end),remaining:nval(x.remaining)}));return f}
let fx=repairFx(savedFx);const snapshot=state.run.build;const R=(t,j)=>Math.floor(nval(snapshot.specs?.[t]?.[j]||0));const C=j=>Number(snapshot.core?.[j]||0);
const specTotal=t=>snapshot.specs?.[t]?.reduce((s,x)=>s+x,0)||0;
const available=()=>SKILLS.filter(s=>s.tree===-1||R(s.tree,s.idx)>0).slice(0,4);
const count=arr=>arr.filter(v=>v>fx.time).length;
const bleeds=()=>fx.bleeds.length,corrupt=()=>count(fx.corrupt),resolve=()=>count(fx.resolve);
const expiring=(x,after=0)=>x>fx.time+after;
const healingMult=()=> (1+.03*R(2,12))*(state.run.hp/stats().hp<.3?1+.05*R(2,16):1);
const damageMult=()=> (1+corrupt()*.03*(1+.02*R(1,12)))*(expiring(fx.darkUntil)?1.25:1)*(expiring(fx.soulUntil)?1+.04*R(1,13):1)*(enemy.wave%10===0&&corrupt()>0?1+.04*R(1,16):1);
const executeMult=()=> (enemyHp/enemy.maxHp<.35?1+.04*R(0,11):1)*(enemyHp/enemy.maxHp<.30&&C(8)?1.1:1);
function stats(){
 const r=state.run,w=state.work;
 const rawAtk=10+2*w.atk+2*r.runUp.atk+2*(r.level-1)+(itemMods.atk||0);
 const rawHp=100+15*w.hp+15*r.runUp.hp+10*(r.level-1)+(itemMods.hp||0);
 const rawDef=2+w.def+r.runUp.def+Math.floor((r.level-1)/4)+(itemMods.def||0);
 return {
 atk:rawAtk*(1+.05*C(0)),
 hp:rawHp*(1+.10*C(1)+.03*R(2,0)+.02*R(2,9)),
 def:rawDef*(1+.05*C(2)+.03*R(2,2)+(.03*R(2,14)*(resolve()===5?1:0))),
 regen:(.5+.35*w.regen+.35*r.runUp.regen+(itemMods.regen||0))*(1+.10*C(4)+.04*R(2,8)),
 speed:Math.max(280,Math.max(280,1100-24*(w.speed+r.runUp.speed))/(1+(itemMods.speedPct||0)+.05*C(3)+.02*R(0,2)+(r.hp/Math.max(1,rawHp*(1+.10*C(1)+.03*R(2,0)+.02*R(2,9)))<.4&&R(0,12)? .15:0)+(expiring(fx.hungerUntil)?.02*R(0,16):0))),
 crit:clamp(5+w.crit+r.runUp.crit+5*C(5)+2*R(0,8)+(itemMods.crit||0),0,95),
 critMult:1.5+.10*C(6)+(itemMods.critDamage||0)
 };
}
function enemyFor(w){
 const boss=w%10===0,zone=w%50===0,scale=Math.pow(1.055,w-1);
 return {wave:w,name:zone?'Zonenfürst':boss?'Wellenboss':w%5===0?'Waldwolf':w%3===0?'Goblin-Krieger':'Waldgoblin',icon:zone?'🐉':boss?'👹':w%5===0?'🐺':'👺',maxHp:Math.round((45+2*w)*scale*(zone?8:boss?4:1)),atk:Math.round((4+w*.38)*Math.pow(1.045,w-1)*(zone?2.2:boss?1.6:1)),def:Math.floor(w/6),speed:zone?1650:boss?1700:1950};
}
let enemy=enemyFor(state.run.wave),enemyHp=state.run.enemyHp>0?Math.min(enemy.maxHp,state.run.enemyHp):enemy.maxHp;
let heroClock=Math.max(0,nval(state.run.heroClock)),enemyClock=Math.max(0,nval(state.run.enemyClock));
let last=performance.now(),renderClock=0,saveClock=0,message='Der Kampf beginnt.';
Warrior.earnThrough(Math.max(0,Math.floor(nval(state.best))-1)); // Nur nachweislich früher abgeschlossene Wellen übernehmen.
function save(){state.run.fx=fx;state.run.heroClock=heroClock;state.run.enemyClock=enemyClock;state.run.enemyHp=enemyHp;try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function heal(raw){const h=Math.max(0,raw*healingMult());state.run.hp=Math.min(stats().hp,state.run.hp+h)}
function debuffDuration(ms){return ms*(1+.03*R(1,2))}
function applyBleed(forced=false,normal=false){
 if(!forced&&(!normal||Math.random()>=.05*R(0,0)+(itemMods.bleedChance||0)))return false;
 const duration=debuffDuration(6000+1000*R(0,4));
 const total=stats().atk*.30*(1+.10*R(0,5))*(1+(itemMods.bleedPower||0));
 fx.bleeds=fx.bleeds.filter(b=>b.end>fx.time&&b.remaining>0);
 if(fx.bleeds.length>=5+R(0,7))fx.bleeds.shift();
 fx.bleeds.push({end:fx.time+duration,remaining:total});return true;
}
function applyCorrupt(forced=false,normal=false){
 if(!forced&&(!normal||Math.random()>=.04*R(1,0)+(itemMods.corruptChance||0)))return false;
 if(corrupt()>=3)fx.corrupt.shift();
 fx.corrupt.push(fx.time+debuffDuration(8000+600*R(1,15)));
 let damage=stats().atk*(.1+.02*R(1,9))*(1+.03*R(1,11))*(1+.04*R(1,5)); // Schattenimpuls beim Auftragen.
 damage*=damageMult()*executeMult()*(1+(itemMods.shadowPower||0));
 enemyHp-=damage;return true;
}
function applyResolve(forced=false){
 if(specTotal(2)===0&&!(itemMods.resolveGuard>0))return false;
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
 dmg*=damageMult()*executeMult()*(wasBleeding?1+.03*R(0,13):1)*(base&&wasCorrupt?1+.05*R(1,8):1);
 if(fx.revenge){dmg*=1+.06*R(0,14)+.04*R(2,13);fx.revenge=false}
 enemyHp-=dmg;heal(dmg*(.01*R(2,1)+(itemMods.lifesteal||0)));
 if(base)fx.armorUntil=fx.time+debuffDuration(5000);
 if(isNormal)applyBleed(false,true);
 if(isNormal||expiring(fx.darkUntil))applyCorrupt(expiring(fx.darkUntil),isNormal);
 applyResolve();return dmg;
}
function counter(){
 const s=stats(),dmg=Math.max(1,.75*s.atk-enemy.def*(expiring(fx.armorUntil)?.75:1))*damageMult()*executeMult()*(1+.03*R(2,11)*resolve())*(expiring(fx.bastionUntil)?1.15:1);
 enemyHp-=dmg;heal(dmg*.01*R(2,1));return dmg;
}
function cast(id){
 const skill=available().find(x=>x.id===id);
 if(!skill||!state.run.active||state.run.paused||inventoryOpen||nval(fx.cd[id])>fx.time)return false;
 if(id==='base')attack(1.5,'base');
 if(id==='rush'){attack(1.8,'rush');applyBleed(true)}
 if(id==='bloodbath'){const remain=fx.bleeds.reduce((s,b)=>s+b.remaining,0);const bossMod=enemy.wave%10===0?1+.04*R(0,15):1;enemyHp-=remain*damageMult()*executeMult()*bossMod;fx.bleeds=[]}
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
 let gold=Math.round((8+w*2)*(boss?5:1)),coins=Math.max(1,Math.round((1+w*.1)*(boss?5:1)));
 r.gold+=gold;if(!r.preview)state.coins+=coins;
 const drop=Equipment.onWin(r.equipment,w,Math.random);
 const newlyUnlocked=drop&&drop.item.unique&&drop.item.slot==='weapon'&&!r.preview?Equipment.unlock(state.arsenal,drop.item.template):false;
 r.xp+=10+Math.round(w*1.6)*(boss?3:1);r.kills++;if(boss)r.bosses++;
 gainLevel();r.wave++;r.highest=Math.max(r.highest,r.wave);
 if(!r.preview)state.best=Math.max(state.best,r.highest);
 const milestone=r.preview?0:Warrior.earnThrough(w);
 enemy=enemyFor(r.wave);enemyHp=enemy.maxHp;heroClock=enemyClock=0;
 message=(boss?'👑 Boss besiegt! ':'')+'+'+fmt(gold)+' Gold'+(r.preview?' (Testmodus)':' · +'+fmt(coins)+' Münzen')+(milestone?' · ⭐ Hauptbaum-Punkt!':'')+(drop?' · 🎒 '+drop.item.name+(drop.where==='ground'?' (Boden)':''):'')+(newlyUnlocked?' · ⚒️ Bosswaffe dauerhaft freigeschaltet!':'');
 invDirty=true;save();
}
function finish(reason){
 const r=state.run;if(!r.active)return;
 r.active=false;r.paused=true;r.equipment=Equipment.blank();refreshItems();chosenItem=null;state.runs++;if(!r.preview)state.best=Math.max(state.best,r.highest);
 let souls=0;if(!r.claimed){r.claimed=true;if(!r.preview)souls=Warrior.awardSouls(r.highest)}
 $('summary').textContent=reason+' · Höchste Welle: '+fmt(r.highest)+' · Besiegte Gegner: '+fmt(r.kills)+' · Bosse: '+fmt(r.bosses)+' · Zeit: '+Math.floor(r.elapsed/60)+' Min. · '+(r.preview?'Testmodus – keine permanenten Belohnungen':'+'+souls+' Seelen · Gesamt: '+Warrior.load().souls);
 $('runEnd').classList.remove('hidden');message=reason;save();render();
}
function startRun(){
 Warrior.reload();
 try{const latest=JSON.parse(localStorage.getItem(KEY)||'null');if(latest){state.coins=nval(latest.coins,state.coins);state.work=Object.assign(blankUp(),latest.work||state.work)}}catch{}
 state.run=defaultRun();const startWeapon=Equipment.starter(state.arsenal);if(startWeapon){state.run.equipment.gear.weapon=startWeapon;state.run.equipment.nextId=2}refreshItems();inventoryOpen=false;chosenItem=null;state.run.build=Warrior.snapshot();state.run.preview=state.run.build.preview;
 // Der Snapshot wird zu Beginn fixiert und bleibt auch bei späteren Änderungen im Planer stabil.
 const b=state.run.build;
 snapshot.core=b.core;snapshot.specs=b.specs;
 fx=blankFx();enemy=enemyFor(1);enemyHp=enemy.maxHp;heroClock=enemyClock=0;
 state.run.hp=stats().hp;$('runEnd').classList.add('hidden');
 message=state.run.preview?'🧪 Test-Run – keine dauerhaften Belohnungen.':'Neuer Run gestartet!';tab('run');
 save();render();
}
function togglePause(){const r=state.run;if(!r.active)return;r.paused=!r.paused;message=r.paused?'⏸ Pausiert':'▶️ Kampf läuft';save();render()}
function endRun(){if(state.run.active&&confirm('Run wirklich beenden? Gold und Level werden zurückgesetzt. Du erhältst Seelen für die höchste Welle.'))finish('Run freiwillig beendet')}
function cost(k,permanent){let lvl=permanent?state.work[k]:state.run.runUp[k];return Math.round(BASE_COST[k]*(permanent?10:1)*Math.pow(permanent?1.32:1.5,lvl))}
function upgrade(k,permanent){
 const c=cost(k,permanent);if(permanent){if(state.run.preview||state.coins<c)return;state.coins-=c;state.work[k]++}else{if(!state.run.active||state.run.gold<c)return;state.run.gold-=c;state.run.runUp[k]++}
 if(k==='hp')heal(15);state.run.hp=Math.min(state.run.hp,stats().hp);save();render();
}
function tick(dt){
 const r=state.run;if(!r.active||r.paused||inventoryOpen||document.hidden)return;
 r.elapsed+=dt/1000;fx.time+=dt;const s=stats();
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
  incoming*=Math.max(.1,1-(.02+(itemMods.resolveGuard||0))*resolve())*(1-.05*C(7))*(1-.02*R(2,4))*(corrupt()>0?1-.02*R(1,14):1);
  if(r.hp/stats().hp<.4)incoming*=1-.02*R(2,10);
  if(expiring(fx.bastionUntil))incoming*=.7;
  r.hp-=Math.max(1,incoming);
  if(r.hp<=0){r.hp=0;finish('💀 Besiegt');return}
  fx.revenge=true;
  if(specTotal(2)>0||itemMods.resolveGuard>0)applyResolve(true);
  if(Math.random()<.04*R(2,7))counter();
  if(enemyHp<=0){win();return}
 }
 autoCast();
}
function tab(id){inventoryOpen=id==='inventory';invDirty=inventoryOpen;for(const x of ['run','inventory','shop','info']){$(x).classList.toggle('hidden',x!==id);$('tab'+x[0].toUpperCase()+x.slice(1)).classList.toggle('active',x===id)}render()}
function upgradeRows(permanent){return FIELDS.map(k=>{
 const lvl=permanent?state.work[k]:state.run.runUp[k],c=cost(k,permanent),can=(permanent?state.coins:state.run.gold)>=c;
 return '<div class="row item"><span>'+LABELS[k]+' <span class="muted">Stufe '+lvl+'</span></span><button '+(!can||(permanent&&state.run.preview)||(!permanent&&!state.run.active)?'disabled':'')+' onclick="upgrade(\''+k+'\','+permanent+')">'+(permanent?'🪙':'💰')+' '+fmt(c)+'</button></div>'
 }).join('')}
function itemAtSelection(){
 if(!chosenItem)return null;
 const e=state.run.equipment;
 if(chosenItem.kind==='bag')return e.bag.find(x=>x.uid===chosenItem.key)||null;
 if(chosenItem.kind==='gear')return e.gear[chosenItem.key]||null;
 if(chosenItem.kind==='ground')return e.ground.find(x=>x.item.uid===chosenItem.key)?.item||null;
 return null;
}
function inspectItem(kind,key){
 if(!inventoryOpen)return;
 if(!['bag','gear','ground'].includes(kind))return;
 chosenItem={kind,key};invDirty=true;renderInventory();
}
function equipItem(uid){
 if(!state.run.active||!inventoryOpen)return;
 const before=stats().hp,done=Equipment.moveToGear(state.run.equipment,uid,state.run.level);
 if(!done.ok){$('itemDetail').textContent=done.reason;return}
 refreshItems();state.run.hp=Math.min(stats().hp,state.run.hp+Math.max(0,stats().hp-before));
 chosenItem={kind:'gear',key:done.item.slot};message='⚔️ '+done.item.name+' ausgerüstet';save();render();
}
function unequipSlot(slot){
 if(!state.run.active||!inventoryOpen)return;
 const result=Equipment.removeGear(state.run.equipment,slot);
 if(!result.ok){$('itemDetail').textContent=result.reason;return}
 refreshItems();state.run.hp=Math.min(state.run.hp,stats().hp);
 chosenItem=null;message='Ausrüstung abgelegt';save();render();
}
function sellItem(uid){
 if(!state.run.active||!inventoryOpen)return;
 const result=Equipment.sell(state.run.equipment,uid);
 if(!result.ok){$('itemDetail').textContent=result.reason;return}
 state.run.gold+=result.gold;chosenItem=null;invDirty=true;
 message='💰 '+result.item.name+' verkauft: +'+fmt(result.gold)+' Gold';save();render();
}
function collectItem(uid){
 if(!state.run.active||!inventoryOpen)return;
 const result=Equipment.collect(state.run.equipment,uid);
 if(!result.ok){$('itemDetail').textContent=result.reason;return}
 chosenItem={kind:'bag',key:uid};invDirty=true;message='🎒 '+result.item.name+' eingesammelt';save();render();
}
function chooseArsenal(id){
 if(state.run.active||!Equipment.select(state.arsenal,id))return;
 invDirty=true;message='⚒️ '+Equipment.TEMPLATES.find(t=>t.id===id).name+' als Startwaffe gewählt';save();render();
}
function forgeArsenal(id){
 if(state.run.active||state.run.preview)return;
 const result=Equipment.improve(state.arsenal,id,state.coins);
 if(!result.ok){$('itemDetail').textContent=result.reason;return}
 state.coins-=result.cost;invDirty=true;
 message='⚒️ '+Equipment.TEMPLATES.find(t=>t.id===id).name+' verbessert auf Stufe '+result.level;save();render();
}
function itemCardText(item){
 if(!item)return '';
 const rarity=Equipment.RARITIES[item.rarity];
 const requirements=state.run.level<item.level?' · Erfordert Level '+item.level:'';
 return '<h3 style="color:'+rarity.color+'">'+item.icon+' '+item.name+'</h3>'+
 '<div class="item-tag">'+rarity.name+' · Gegenstandsstufe '+item.level+requirements+
 (item.unique?' · Einzigartiger Bossgegenstand':'')+'</div><div class="equip-stat">'+
 Equipment.describe(item).map(x=>'<div>'+x+'</div>').join('')+'</div>';
}
function renderInventory(){
 if(!inventoryOpen)return;
 invDirty=false;
 const e=state.run.equipment,arsenal=state.arsenal,active=state.run.active;
 $('gearSlots').innerHTML=Equipment.SLOTS.map(slot=>{
   const it=e.gear[slot.id],rarity=it?Equipment.RARITIES[it.rarity]:null;
   return '<button class="gear-slot"'+(it?' style="border-color:'+rarity.color+'"':'')+
     (it?' onclick="inspectItem(\'gear\',\''+slot.id+'\')"':' disabled')+'>'+
     (it?it.icon:slot.icon)+'<b>'+slot.label+'</b><span>'+(it?it.name:'Leer')+'</span></button>';
 }).join('');
 $('itemPower').textContent='⚔️ +'+fmt(itemMods.atk||0)+' · 🛡️ +'+fmt(itemMods.def||0);
 $('bagCount').textContent=e.bag.length+'/50';
 $('bag').innerHTML=Array.from({length:50},(_,i)=>{
   const it=e.bag[i];if(!it)return '<button class="inventory-cell" disabled aria-label="Leerer Inventarplatz '+(i+1)+'">·</button>';
   const rarity=Equipment.RARITIES[it.rarity];
   return '<button class="inventory-cell filled" style="border-color:'+rarity.color+'" title="'+it.name+
   '" onclick="inspectItem(\'bag\','+it.uid+')">'+it.icon+'<em>Lv '+it.level+'</em></button>';
 }).join('');
 $('groundLoot').innerHTML=e.ground.length?e.ground.map(x=>{
  const rarity=Equipment.RARITIES[x.item.rarity];
  return '<div class="loot-row"><span style="color:'+rarity.color+'">'+x.item.icon+' '+x.item.name+
    ' <span class="muted">(bis Welle '+x.expiresAt+')</span></span><button class="smallbtn"'+(e.bag.length>=50?' disabled':'')+
    ' onclick="collectItem('+x.item.uid+')">Aufheben</button></div>';
 }).join(''):'<p class="muted">Keine Beute auf dem Boden.</p>';
 const it=itemAtSelection();
 if(it){
   let actions='';
   if(chosenItem.kind==='bag')actions='<button class="smallbtn" onclick="equipItem('+it.uid+')"'+(!active||state.run.level<it.level?' disabled':'')+'>Ausrüsten</button>'+
     '<button class="smallbtn alt" onclick="sellItem('+it.uid+')"'+(!active?' disabled':'')+'>Verkaufen · '+fmt(it.value)+' 💰</button>';
   if(chosenItem.kind==='gear')actions='<button class="smallbtn alt" onclick="unequipSlot(\''+it.slot+'\')"'+(!active||e.bag.length>=50?' disabled':'')+'>Ablegen</button>';
   if(chosenItem.kind==='ground')actions='<button class="smallbtn" onclick="collectItem('+it.uid+')"'+(!active||e.bag.length>=50?' disabled':'')+'>Aufheben</button>';
   $('itemDetail').innerHTML=itemCardText(it)+'<div class="item-actions">'+actions+'</div>';
 }else $('itemDetail').textContent='Tippe auf einen Inventarplatz oder ausgerüsteten Gegenstand, um Werte zu vergleichen und ihn auszurüsten oder zu verkaufen.';
 $('arsenal').innerHTML=Equipment.BOSS_WEAPONS.map(id=>{
   const template=Equipment.TEMPLATES.find(x=>x.id===id),unlocked=arsenal.unlocked.includes(id),level=arsenal.levels[id]||0;
   if(!unlocked)return '<div class="armory-item">🔒 <b>'+template.name+'</b><div class="muted">Besondere Waffe – durch Boss-Beute freischaltbar</div></div>';
   const sample=Equipment.makeItem(id,0,1,0,-1,5,level),selected=arsenal.selected===id,price=Equipment.forgeCost(arsenal,id);
   const priceLabel=Number.isFinite(price)?fmt(price)+' 🪙':'Maximalstufe';
   return '<div class="armory-item"><b>'+template.icon+' '+template.name+' · Schmiedestufe '+level+'/5</b>'+
     '<div class="equip-stat">'+Equipment.describe(sample).join(' · ')+'</div><div class="item-actions">'+
     '<button class="smallbtn" onclick="chooseArsenal(\''+id+'\')"'+(selected||active?' disabled':'')+'>'+(selected?'✓ Gewählt':'Für nächsten Run wählen')+'</button>'+
     '<button class="smallbtn alt" onclick="forgeArsenal(\''+id+'\')"'+(active||state.run.preview||state.coins<price||!Number.isFinite(price)?' disabled':'')+
     '>Verbessern · '+priceLabel+'</button></div></div>';
 }).join('');
}
function render(){
 const r=state.run,s=stats(),f=available();
 $('wave').textContent='Welle '+fmt(r.wave)+(r.wave%50===0?' 👑 Zonenboss':r.wave%10===0?' 👑 Boss':'');
 $('money').textContent='💰 '+fmt(r.gold)+' · 🪙 '+fmt(state.coins)+' · 🔮 '+Warrior.load().souls;
 $('enemyIcon').textContent=enemy.icon;$('enemyIcon').className=r.wave%10===0?'boss':'';
 $('enemyName').textContent=enemy.name;$('hpBar').style.width=clamp(r.hp/s.hp*100,0,100)+'%';$('enemyBar').style.width=clamp(enemyHp/enemy.maxHp*100,0,100)+'%';
 $('hpText').textContent=fmt(r.hp)+' / '+fmt(s.hp)+' HP';$('enemyHpText').textContent=fmt(Math.max(0,enemyHp))+' / '+fmt(enemy.maxHp)+' HP';
 $('level').textContent='Level '+r.level+' · XP '+fmt(r.xp)+'/'+fmt(r.level*40);
 $('combatStats').textContent='⚔️ '+fmt(s.atk)+' · 🛡️ '+fmt(s.def);
 $('log').textContent=message;$('pauseBtn').textContent=inventoryOpen?'🎒 Inventar pausiert':r.paused?'▶️ Fortsetzen':'⏸ Pausieren';$('pauseBtn').disabled=!r.active||inventoryOpen;
 $('effects').textContent=(r.preview?'🧪 TESTMODUS · ':'')+'🩸 '+bleeds()+' Blutungen · 🌑 '+corrupt()+' Verderbnis · 🛡️ '+resolve()+' Entschlossenheit';
 $('skills').innerHTML=f.map(sk=>{const remaining=Math.max(0,Math.ceil((nval(fx.cd[sk.id])-fx.time)/1000));return '<div class="skill"><button '+(!r.active||r.paused||remaining?'disabled':'')+' onclick="cast(\''+sk.id+'\')">'+sk.name+(remaining?' · '+remaining+'s':'')+'</button><label class="auto"><input type="checkbox" '+(state.settings.auto[sk.id]?'checked':'')+' onchange="toggleAuto(\''+sk.id+'\')"> Auto</label></div>'}).join('');
 $('runUpgrades').innerHTML=upgradeRows(false);$('workshop').innerHTML=upgradeRows(true);if(inventoryOpen&&invDirty)renderInventory();
}
if(!state.run.active){$('runEnd').classList.remove('hidden');$('summary').textContent='Letzter Run beendet. Höchste Welle: '+fmt(state.run.highest)+'. Starte einen neuen Run.'}else state.run.hp=clamp(state.run.hp,0,stats().hp);
window.inspectItem=inspectItem;window.equipItem=equipItem;window.unequipSlot=unequipSlot;window.sellItem=sellItem;window.collectItem=collectItem;window.chooseArsenal=chooseArsenal;window.forgeArsenal=forgeArsenal;window.startRun=startRun;window.endRun=endRun;window.togglePause=togglePause;window.upgrade=upgrade;window.cast=cast;window.toggleAuto=toggleAuto;window.tab=tab;
render();document.addEventListener('visibilitychange',()=>{last=performance.now();save()});window.addEventListener('pagehide',save);window.addEventListener('pageshow',()=>{Warrior.reload();try{const latest=JSON.parse(localStorage.getItem(KEY)||'null');if(latest){state.coins=nval(latest.coins,state.coins);state.work=Object.assign(blankUp(),latest.work||state.work)}}catch{}render()});
function frame(now){const dt=clamp(now-last,0,100);last=now;tick(dt);renderClock+=dt;saveClock+=dt;if(renderClock>200){renderClock=0;render()}if(saveClock>2000){saveClock=0;save()}requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
