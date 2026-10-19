'use strict';
/* Browser-independent functional tests for the real index.html combat script.
   node tests/talent-audit.cjs  — the same suite can also run in a JavaScript isolate. */
function audit(warriorCode,gameCode,equipmentCode){
 const trees=JSON.parse(warriorCode.slice(warriorCode.indexOf('const TREES=')+12,warriorCode.indexOf(';\nconst CORE=')));
 const transformed=gameCode.replace('(function(){','const game=(function(){').replace('requestAnimationFrame(frame);\n})();',"requestAnimationFrame(frame);\nreturn {stats,tick,attack,cast,applyBleed,applyCorrupt,applyResolve,win,available,save,get state(){return state},get fx(){return fx},get snapshot(){return snapshot},get enemy(){return enemy},set enemy(v){enemy=v},get enemyHp(){return enemyHp},set enemyHp(v){enemyHp=v}};\n})();");
 const boot=new Function('globalThis','localStorage','document','window','Math','performance','requestAnimationFrame','confirm',warriorCode+'\nconst Warrior=globalThis.Warrior;\n'+equipmentCode+'\nconst Equipment=globalThis.Equipment;\n'+transformed+'\nreturn {Warrior,game};');
 function spawn(t,j,enabled=false,rng=.99,coreIndex=-1){
  const db={},storage={getItem:k=>db[k]??null,setItem:(k,v)=>db[k]=String(v)};
  const root={addEventListener(){}},elems={};
  const document={hidden:false,addEventListener(){},getElementById:id=>elems[id]??(elems[id]={textContent:'',style:{},innerHTML:'',disabled:false,classList:{remove(){},toggle(){},add(){}}})};
  const math=Object.create(Math);math.random=()=>rng;
  const obj=boot(root,storage,document,root,math,{now:()=>0},()=>{},()=>true),g=obj.game;
  if(enabled&&coreIndex<0)g.snapshot.specs[t][j]=typeof enabled==='number'?enabled:trees[t].nodes[j][1];
  if(coreIndex>=0&&enabled)g.snapshot.core[coreIndex]=1;
  g.enemy={...g.enemy,maxHp:100000,atk:12,def:0,speed:999999};g.enemyHp=80000;
  Object.defineProperty(g.fx,'cooldowns',{get:()=>g.available().map(s=>g.fx.cd[s.id]||0)});
  return {stats:()=>g.stats(),tick:dt=>g.tick(dt),heroHit:(power=1,base=false,normal=true)=>g.attack(power,base?'base':normal?'normal':'rush'),
    cast:k=>{const sk=g.available()[k];return sk?g.cast(sk.id):false},availableSkills:()=>g.available(),
    addBleed:(force=false)=>g.applyBleed(force,!force),addCorrupt:(force=false)=>g.applyCorrupt(force,!force),
    addResolve:force=>g.applyResolve(force),win:()=>g.win(),save:()=>g.save(),attackInterval:()=>g.stats().speed,
    get state(){return g.state},get effects(){return g.fx},get enemy(){return g.enemy},
    set enemy(v){g.enemy=v},get enemyHp(){return g.enemyHp},set enemyHp(v){g.enemyHp=v},
    get build(){return g.snapshot.specs},get progress(){return obj.Warrior.load()},storage};
 }
 const probes=[
 [
 a=>{a.addBleed();return a.effects.bleeds.length},
 a=>a.heroHit(),
 a=>a.attackInterval(),
 a=>{a.enemy.def=5;a.cast(0);return a.heroHit()},
 a=>{a.addBleed(true);return a.effects.bleeds[0].end},
 a=>{a.addBleed(true);return a.effects.bleeds[0].remaining},
 a=>a.availableSkills().some(x=>x.id==='rush')?1:0,
 a=>{for(let i=0;i<12;i++)a.addBleed(true);return a.effects.bleeds.length},
 a=>a.heroHit(),
 a=>{a.state.run.hp=40;a.effects.bleeds=[{end:9999,remaining:100,dps:.1}];a.tick(1000);return a.state.run.hp},
 a=>{a.effects.bleeds=[{end:9999,remaining:100,dps:.1}];a.heroHit();return a.effects.bleeds[0].end},
 a=>{a.enemyHp=30000;return a.heroHit()},
 a=>{a.state.run.hp=30;return a.attackInterval()},
 a=>{a.effects.bleeds=[{end:9999,remaining:100,dps:.01}];return a.heroHit()},
 a=>{a.effects.revenge=true;return a.heroHit()},
 a=>{a.state.run.wave=10;a.enemy.wave=10;a.effects.bleeds=[{end:9999,remaining:100,dps:.1}];const before=a.enemyHp;a.tick(1000);return before-a.enemyHp},
 a=>{a.effects.bleeds=[{end:9999,remaining:100,dps:.01}];a.win();return a.effects.hungerUntil||0},
 a=>a.availableSkills().some(x=>x.id==='bloodbath')?1:0
 ],
 [
 a=>{a.addCorrupt();return a.effects.corrupt.length},
 a=>a.heroHit(),
 a=>{a.addCorrupt(true);return a.effects.corrupt[0]},
 a=>{a.enemy.def=5;a.cast(0);return a.heroHit()},
 a=>{a.addCorrupt(true);a.enemy.speed=1000;a.tick(1000);return a.state.run.hp},
 a=>{a.addCorrupt(true);const before=a.enemyHp;a.addCorrupt(true);return before-a.enemyHp},
 a=>a.availableSkills().some(x=>x.id==='curse')?1:0,
 a=>{a.addCorrupt(true);return a.heroHit()},
 a=>{a.addCorrupt(true);const before=a.enemyHp;a.cast(0);return before-a.enemyHp},
 a=>{const before=a.enemyHp;a.addCorrupt(true);return before-a.enemyHp},
 a=>{a.addCorrupt(true);a.enemy.speed=1000;a.tick(1000);return a.state.run.hp},
 a=>{a.build[1][9]=1;const before=a.enemyHp;a.addCorrupt(true);return before-a.enemyHp},
 a=>{a.addCorrupt(true);return a.heroHit()},
 a=>{a.addCorrupt(true);a.win();return a.effects.soulUntil||0},
 a=>{a.addCorrupt(true);a.enemy.speed=1000;a.tick(1000);return a.state.run.hp},
 a=>{a.addCorrupt(true);return a.effects.corrupt[0]},
 a=>{a.state.run.wave=10;a.enemy.wave=10;a.addCorrupt(true);return a.heroHit()},
 a=>a.availableSkills().some(x=>x.id==='dark')?1:0
 ],
 [
 a=>a.stats().hp,
 a=>{a.state.run.hp=20;a.heroHit();return a.state.run.hp},
 a=>a.stats().def,
 a=>{a.enemy.def=5;a.cast(0);return a.heroHit()},
 a=>{a.enemy.speed=1000;a.tick(1000);return a.state.run.hp},
 a=>{a.addResolve();return a.effects.resolve.length},
 a=>a.availableSkills().some(x=>x.id==='breaker')?1:0,
 a=>{a.enemy.speed=1000;const before=a.enemyHp;a.tick(1000);return before-a.enemyHp},
 a=>{a.state.run.hp=50;a.tick(1000);return a.state.run.hp},
 a=>a.stats().hp,
 a=>{a.state.run.hp=30;a.enemy.speed=1000;a.tick(1000);return a.state.run.hp},
 a=>{a.build[2][7]=5;a.effects.resolve=[9000,9000,9000];a.enemy.speed=1000;const before=a.enemyHp;a.tick(1000);return before-a.enemyHp},
 a=>{a.build[2][1]=1;a.state.run.hp=20;a.heroHit();return a.state.run.hp},
 a=>{a.effects.revenge=true;return a.heroHit()},
 a=>{a.effects.resolve=[9000,9000,9000,9000,9000];return a.stats().def},
 a=>{a.effects.resolve=[9000,9000,9000];return a.heroHit()},
 a=>{a.build[2][1]=1;a.state.run.hp=20;a.heroHit();return a.state.run.hp},
 a=>{a.build[2][7]=5;const k=a.availableSkills().findIndex(x=>x.id==='bastion');if(k>=0)a.cast(k);a.effects.resolve=[9000,9000,9000];a.enemy.speed=1000;const before=a.enemyHp;a.tick(1000);return before-a.enemyHp}
 ]];
 const rng={ '0:0':.1,'0:8':.1,'0:10':0,'1:0':.1,'1:7':0,'2:5':.1,'2:7':0,'2:11':0,'2:17':0 };
 // All tests assert a real effect in the intended scenario.
 const decrease=new Set(['0:2','0:12']);
 const higherHp=new Set(['1:4','1:10','1:14','2:4','2:10']);
 const details=[];let rankChecks=0;
 for(let t=0;t<3;t++)for(let j=0;j<18;j++){
   const name=trees[t].nodes[j][0],key=t+':'+j,roll=rng[key]??.99,probe=probes[t][j];
   let baseline,actual,pass=false,error='';
   try{
    baseline=probe(spawn(t,j,false,roll));actual=probe(spawn(t,j,true,roll));
    pass=Number.isFinite(baseline)&&Number.isFinite(actual)&&(decrease.has(key)?actual<baseline:actual>baseline);
    if(higherHp.has(key))pass=actual>baseline;
    if(pass){let previous=baseline;for(let r=1;r<=trees[t].nodes[j][1];r++){const current=probe(spawn(t,j,r,roll));rankChecks++;const downward=decrease.has(key);const monotonic=downward?current<=previous+.0000001:current>=previous-.0000001;if(!monotonic||!Number.isFinite(current)){pass=false;error='Effect does not scale monotonically at rank '+r;break}previous=current}}
   }catch(e){error=String(e)}
   details.push({tree:trees[t].name,name,key,pass,baseline,actual,error});
 }
 const extras=[];
 function check(name,fn){try{extras.push({name,pass:!!fn()})}catch(e){extras.push({name,pass:false,error:String(e)})}}
 for(let i=0;i<9;i++){
   const coreProbes=[a=>a.stats().atk,a=>a.stats().hp,a=>a.stats().def,a=>a.attackInterval(),a=>a.stats().regen,a=>a.stats().crit,a=>a.heroHit(),a=>{a.enemy.speed=1000;a.tick(1000);return a.state.run.hp},a=>{a.enemyHp=20000;return a.heroHit()}];
   const rng=i===6?0:.99,base=coreProbes[i](spawn(0,0,false,rng,-1)),enhanced=coreProbes[i](spawn(0,0,true,rng,i));
   extras.push({name:'Core: '+i,pass:i===3?enhanced<base:enhanced>base,baseline:base,actual:enhanced});
 }
 check('Cooldowns bleiben über Wellen bestehen',()=>{const a=spawn(0,0);a.cast(0);const cd=a.effects.cd.base;a.win();return cd===10000&&a.effects.cd.base===cd});
 check('Gegner-Debuffs verschwinden; Spieler-Buffs bleiben',()=>{const a=spawn(1,17,true);a.cast(1);a.addCorrupt(true);a.addBleed(true);a.win();return a.effects.corrupt.length===0&&a.effects.bleeds.length===0&&a.effects.darkUntil===10000});
 check('Rüstungsbruch verschwindet beim Wellenwechsel',()=>{const a=spawn(0,0);a.cast(0);a.win();return a.effects.armorUntil===0});
 check('Keine gratis Entschlossenheit ohne Tank-Talente',()=>{const a=spawn(0,0);a.enemy.speed=1000;a.tick(1000);return a.effects.resolve.length===0});
 check('Fluchkunde verlängert auch Rüstungsbruch',()=>{const a=spawn(1,2,true);a.cast(0);return a.effects.armorUntil>5000});
 check('Blutiger Ansturm: garantierte Blutung',()=>{const a=spawn(0,6,true);a.cast(1);return a.effects.bleeds.length===1&&a.effects.cd.rush===12000});
 check('Schattenfluch: drei Verderbnisstapel',()=>{const a=spawn(1,6,true);a.cast(1);return a.effects.corrupt.length===3&&a.effects.cd.curse===15000});
 check('Schildbrecher: drei Entschlossenheitsstapel',()=>{const a=spawn(2,6,true);a.cast(1);return a.effects.resolve.length===3&&a.effects.cd.breaker===16000});
 check('Letzte Bastion: Dauer und Cooldown',()=>{const a=spawn(2,17,true);a.cast(1);return a.effects.bastionUntil===8000&&a.effects.cd.bastion===40000});
 check('Finsternis: Dauer und Cooldown',()=>{const a=spawn(1,17,true);a.cast(1);return a.effects.darkUntil===10000&&a.effects.cd.dark===35000});
 check('Blutbad entlädt Restschaden und beendet Blutungen',()=>{const a=spawn(0,17,true);a.effects.bleeds=[{end:6000,remaining:80}];const old=a.enemyHp;a.cast(1);return Math.abs(old-a.enemyHp-80)<.00001&&a.effects.bleeds.length===0&&a.effects.cd.bloodbath===30000});
 check('Schadensverstärkung nur gegen verderbte Bosse',()=>{const a=spawn(1,16,true);a.enemy.wave=10;const plain=a.heroHit();const b=spawn(1,16,true);b.enemy.wave=10;b.addCorrupt(true);const cursed=b.heroHit();return cursed>plain});
 check('Unstillbarer Hunger wirkt auch beim tödlichen letzten Blutungstick',()=>{const a=spawn(0,16,true);a.enemyHp=5;a.effects.bleeds=[{end:1000,remaining:20}];a.tick(1000);return a.state.run.wave===2&&a.effects.hungerUntil===7000});
 const failures=[...details.filter(x=>!x.pass),...extras.filter(x=>!x.pass)];
 return {total:details.length,passed:details.filter(x=>x.pass).length,rankChecks,coreAndIntegration:extras.length,extraPassed:extras.filter(x=>x.pass).length,failures,details,extras};
}
if(typeof module!=='undefined'&&module.exports)module.exports=audit;
if(typeof require==='function'&&typeof module!=='undefined'&&require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const root=path.resolve(__dirname,'..');
 const report=audit(fs.readFileSync(path.join(root,'warrior-system.js'),'utf8'),fs.readFileSync(path.join(root,'game.js'),'utf8'),fs.readFileSync(path.join(root,'equipment.js'),'utf8'));
 console.log('Talent tests:',report.passed+'/'+report.total,'Core/integration:',report.extraPassed+'/'+report.coreAndIntegration);
 for(const f of report.failures)console.error('FAIL',f.tree||'',f.name||f.key,f.baseline,'->',f.actual,f.error||'');
 if(report.failures.length)process.exitCode=1;
}
