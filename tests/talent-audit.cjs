'use strict';
/* Browser-independent functional tests for the real index.html combat script.
   node tests/talent-audit.cjs  — the same suite can also run in a JavaScript isolate. */
function audit(gameHtml,plannerHtml){
 const match=gameHtml.match(/<script>([\s\S]*?)<\/script>/);
 if(!match)throw Error('Combat script missing');
 const m=plannerHtml.match(/const trees=([\s\S]*?);const (?:ranks|PROG_KEY)=/);
 if(!m)throw Error('Planner talent data missing');
 const trees=JSON.parse(m[1]),js=match[1];
 const init=new Function('localStorage','document','performance','requestAnimationFrame','window','confirm','Math',js+
 '\nreturn {stats,tick,addBleed,addCorrupt,addResolve,heroHit,cast,win,availableSkills,attackInterval,save,get state(){return state},get effects(){return effects},get enemy(){return enemy},get enemyHp(){return enemyHp},set enemyHp(v){enemyHp=v},set enemy(v){enemy=v},get build(){return build},get progress(){return progress}};');
 function spawn(t,j,enabled=false,rng=.99,coreIndex=-1){
  const prog={purchased:51,souls:0,milestones:[],core:Array(9).fill(0)};
  if(coreIndex>=0&&enabled)prog.core[coreIndex]=1;
  const memory={'idle-rpg-warrior-progression-v1':JSON.stringify(prog)};
  const storage={getItem:k=>memory[k]??null,setItem:(k,v)=>memory[k]=String(v)};
  const elems={};
  const document={hidden:false,addEventListener(){},getElementById:id=>elems[id]??(elems[id]={style:{},classList:{remove(){},toggle(){},add(){}},innerHTML:'',textContent:''})};
  const math=Object.create(Math);math.random=()=>rng;
  const a=init(storage,document,{now:()=>0},()=>{},{addEventListener(){}},()=>true,math);
  if(enabled&&coreIndex<0)a.build[t][j]=trees[t].nodes[j][1];
  a.enemy={...a.enemy,maxHp:100000,atk:12,def:0,speed:999999};a.enemyHp=80000;
  a.storage=storage;
  return a;
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
 a=>{a.state.run.wave=10;a.effects.bleeds=[{end:9999,remaining:100,dps:.1}];const before=a.enemyHp;a.tick(1000);return before-a.enemyHp},
 a=>{a.effects.bleeds=[{end:9999,remaining:100,dps:.01}];a.win();return a.effects.hungerUntil||0},
 a=>a.availableSkills().some(x=>x.id==='bloodbath')?1:0
 ],
 [
 a=>{a.addCorrupt();return a.effects.corrupt.length},
 a=>a.heroHit(),
 a=>{a.addCorrupt(true);return a.effects.corrupt[0]},
 a=>{a.enemy.def=5;a.cast(0);return a.heroHit()},
 a=>{a.addCorrupt(true);a.enemy.speed=1000;a.tick(1000);return a.state.run.hp},
 a=>{a.addCorrupt(true);const before=a.enemyHp;a.heroHit();return before-a.enemyHp},
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
 a=>{a.state.run.wave=10;a.addCorrupt(true);return a.heroHit()},
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
 const details=[];
 for(let t=0;t<3;t++)for(let j=0;j<18;j++){
   const name=trees[t].nodes[j][0],key=t+':'+j,roll=rng[key]??.99,probe=probes[t][j];
   let baseline,actual,pass=false,error='';
   try{
    baseline=probe(spawn(t,j,false,roll));actual=probe(spawn(t,j,true,roll));
    pass=Number.isFinite(baseline)&&Number.isFinite(actual)&&(decrease.has(key)?actual<baseline:actual>baseline);
    if(higherHp.has(key))pass=actual>baseline;
   }catch(e){error=String(e)}
   details.push({tree:trees[t].name,name,key,pass,baseline,actual,error});
 }
 const extras=[];
 function check(name,fn){try{const result=fn();extras.push({name,pass:!!result})}catch(e){extras.push({name,pass:false,error:String(e)})}}
 for(let i=0;i<9;i++){
   const probesCore=[
    a=>a.stats().atk,a=>a.stats().hp,a=>a.stats().def,a=>a.attackInterval(),a=>a.stats().regen,
    a=>a.stats().crit,a=>a.heroHit(),a=>{a.enemy.speed=1000;a.tick(1000);return a.state.run.hp},
    a=>{a.enemyHp=20000;return a.heroHit()}
   ];
   const roll=i===6?0:.99;
   let before=probesCore[i](spawn(0,0,false,roll,-1));
   let after=probesCore[i](spawn(0,0,true,roll,i));
   const downward=(i===3),good=(i===7?after>before:downward?after<before:after>before);
   extras.push({name:'Kern: '+['Brutale Stärke','Zäher Körper','Eisenhaut','Kampferfahrung','Lebenswille','Präziser Schlag','Tödliche Präzision','Unnachgiebig','Henker'][i],pass:good,baseline:before,actual:after});
 }
 check('Wellenwechsel bewahrt Cooldowns und Entschlossenheit',()=>{const a=spawn(0,0);a.cast(0);a.addResolve(true);const cd=a.effects.cooldowns[0];a.win();return cd>0&&a.effects.cooldowns[0]===cd&&a.effects.resolve.length===1});
 check('Wellenwechsel entfernt Gegner-Debuffs',()=>{const a=spawn(0,0);a.addBleed(true);a.addCorrupt(true);a.win();return a.effects.bleeds.length===0&&a.effects.corrupt.length===0});
 check('Keine kostenlosen Blutungen bei Spezialangriffen',()=>{const a=spawn(0,0,false,0);a.build[0][0]=5;a.cast(0);return a.effects.bleeds.length===0});
 check('Verderbnis verstärkt Blutungsschaden',()=>{const a=spawn(0,0);a.effects.bleeds=[{end:9000,remaining:100,dps:.1}];const b=a.enemyHp;a.tick(1000);const plain=b-a.enemyHp;const x=spawn(0,0);x.effects.bleeds=[{end:9000,remaining:100,dps:.1}];x.addCorrupt(true);const z=x.enemyHp;x.tick(1000);return z-x.enemyHp>plain});
 check('Schattenrüstung verringert Schaden',()=>{const probe=a=>{a.addCorrupt(true);a.enemy.speed=1000;a.tick(1000);return a.state.run.hp};return probe(spawn(1,14,true))>probe(spawn(1,14,false))});
 check('Core-Meilenstein erst nach Sieg über Welle 10',()=>{const a=spawn(0,0);a.state.run.wave=9;a.win();const early=a.progress.milestones.includes(10);a.win();return !early&&a.progress.milestones.includes(10)});
 check('Blutiger Ansturm verursacht garantierte Blutung und 12 s Cooldown',()=>{const a=spawn(0,6,true);const k=a.availableSkills().findIndex(x=>x.id==='rush');a.cast(k);return a.effects.bleeds.length===1&&a.effects.cooldowns[k]===12000});
 check('Blutbad verbraucht Blutungsschaden korrekt',()=>{const a=spawn(0,17,true);a.effects.bleeds=[{end:10000,remaining:80,dps:.008}];const before=a.enemyHp;const k=a.availableSkills().findIndex(x=>x.id==='bloodbath');a.cast(k);return Math.abs((before-a.enemyHp)-80)<.001&&a.effects.bleeds.length===0&&a.effects.cooldowns[k]===30000});
 check('Schattenfluch trägt drei Verderbnisstapel auf',()=>{const a=spawn(1,6,true);const k=a.availableSkills().findIndex(x=>x.id==='curse');a.cast(k);return a.effects.corrupt.length===3&&a.effects.cooldowns[k]===15000});
 check('Finsternis gewährt +25 % und garantiert Verderbnis auf Treffer',()=>{const base=spawn(1,17,true);base.state.run.hp=100;const before=base.heroHit();const a=spawn(1,17,true);const k=a.availableSkills().findIndex(x=>x.id==='dark');a.cast(k);const boosted=a.heroHit();return Math.abs(boosted-before*1.25)<.001&&a.effects.corrupt.length>0&&a.effects.cooldowns[k]===35000});
 check('Schildbrecher gewährt drei Entschlossenheitsstapel',()=>{const a=spawn(2,6,true);const k=a.availableSkills().findIndex(x=>x.id==='breaker');a.cast(k);return a.effects.resolve.length===3&&a.effects.cooldowns[k]===16000});
 check('Letzte Bastion gewährt 8 s Schutz und 40 s Cooldown',()=>{const a=spawn(2,17,true);const k=a.availableSkills().findIndex(x=>x.id==='bastion');a.cast(k);return a.effects.bastionUntil===8000&&a.effects.cooldowns[k]===40000});
 check('Dunkle Resonanz erhöht nicht die Krit-Chance',()=>{const a=spawn(1,7,true,.99);a.addCorrupt(true);const x=a.heroHit();const b=spawn(1,7,false,.99);b.addCorrupt(true);return Math.abs(x-b.heroHit())<.00001});
 check('Schwarze Magie verbessert Schatten-, nicht Direktschaden',()=>{const a=spawn(1,11,true,.99),b=spawn(1,11,false,.99);return Math.abs(a.heroHit()-b.heroHit())<.00001});
 check('Seelenfessel verändert nicht gegnerischen Angriffsschaden',()=>{const a=spawn(1,10,true),b=spawn(1,10,false);for(const x of [a,b]){x.addCorrupt(true);x.enemy.speed=1000;x.tick(3000)}return Math.abs(a.state.run.hp-b.state.run.hp)<.0001});
 check('Kern-Henker erhöht auch Blutungsschaden unter 30 %',()=>{const base=spawn(0,0,false,.99,-1),withCore=spawn(0,0,true,.99,8);for(const a of [base,withCore]){a.enemyHp=20000;a.effects.bleeds=[{end:9000,remaining:100,dps:.1}]}const before=base.enemyHp,other=withCore.enemyHp;base.tick(1000);withCore.tick(1000);return (other-withCore.enemyHp)>(before-base.enemyHp)*1.09});
 check('Speicherung bewahrt laufende Cooldowns',()=>{const a=spawn(0,0);a.cast(0);a.save();const saved=JSON.parse(a.storage.getItem('idle-rpg-core-v01'));return saved.run.effects.cooldowns[0]===10000});
 function plannerBoot({saved=null,active=false,coins=1000,purchased=51,souls=100}={}){
   const script=plannerHtml.match(/<script>([\\s\\S]*?)<\\/script>/)?.[1];
   if(!script)throw Error('Planner script missing');
   const data={
     'idle-rpg-warrior-build-v1':JSON.stringify(saved||[Array(18).fill(0),Array(18).fill(0),Array(18).fill(0)]),
     'idle-rpg-warrior-progression-v1':JSON.stringify({purchased,souls,core:Array(9).fill(0),milestones:[]}),
     'idle-rpg-core-v01':JSON.stringify({coins,run:{active}})
   };
   const storage={getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v)};
   const elems={},element=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},innerHTML:'',textContent:''});
   const doc={getElementById:id=>elems[id]??(elems[id]=element()),createElement:element};
   const plan=new Function('document','localStorage','confirm',script+'\\nreturn {ranks,spent,canAdd,change,buyPoint,progress,render};')(doc,storage,()=>true);
   return {plan,elems,storage};
 }
 check('Talentplaner stellt gespeicherten Build wieder her',()=>{
    const build=[Array(18).fill(0),Array(18).fill(0),Array(18).fill(0)];build[0][0]=5;build[1][1]=3;
    const x=plannerBoot({saved:build});return x.plan.spent()===8&&x.plan.ranks[0][0]===5&&x.plan.ranks[1][1]===3;
 });
 check('Punktekauf zieht Klassenseelen korrekt ab',()=>{
    const x=plannerBoot({purchased:0,souls:25});x.plan.buyPoint();const p=JSON.parse(x.storage.getItem('idle-rpg-warrior-progression-v1'));return p.souls===20&&p.purchased===1;
 });
 check('Skillen während aktivem Run gesperrt',()=>{
    const x=plannerBoot({active:true});const b=x.plan.canAdd(0,0);x.plan.change(0,0,1);return !b&&x.plan.spent()===0;
 });
 check('Rücksetzung kostet exakt 500 Münzen, gekaufte Punkte bleiben',()=>{
    const build=[Array(18).fill(0),Array(18).fill(0),Array(18).fill(0)];build[0][0]=5;
    const x=plannerBoot({saved:build,coins:900});x.elems.reset.onclick();
    const game=JSON.parse(x.storage.getItem('idle-rpg-core-v01'));const prog=JSON.parse(x.storage.getItem('idle-rpg-warrior-progression-v1'));
    return game.coins===400&&x.plan.spent()===0&&prog.purchased===51;
 });
 check('Rücksetzung bei zu wenigen Münzen gesperrt',()=>{
    const build=[Array(18).fill(0),Array(18).fill(0),Array(18).fill(0)];build[0][0]=5;
    const x=plannerBoot({saved:build,coins:499});x.elems.reset.onclick();
    return x.plan.spent()===5&&JSON.parse(x.storage.getItem('idle-rpg-core-v01')).coins===499;
 });
 check('Bastion und Finsternis laufen nach Wellenwechsel weiter',()=>{
    const a=spawn(1,17,true);a.cast(1);const d=a.effects.darkUntil;a.win();
    const b=spawn(2,17,true);b.cast(1);const x=b.effects.bastionUntil;b.win();
    return d===a.effects.darkUntil&&x===b.effects.bastionUntil;
 });
 const failures=[...details.filter(x=>!x.pass),...extras.filter(x=>!x.pass)];
 return {total:details.length,passed:details.filter(x=>x.pass).length,coreAndIntegration:extras.length,extraPassed:extras.filter(x=>x.pass).length,failures,details,extras};
}
if(typeof module!=='undefined'&&module.exports)module.exports=audit;
if(typeof require==='function'&&typeof module!=='undefined'&&require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const root=path.resolve(__dirname,'..');
 const report=audit(fs.readFileSync(path.join(root,'index.html'),'utf8'),fs.readFileSync(path.join(root,'talentplaner.html'),'utf8'));
 console.log('Talent tests:',report.passed+'/'+report.total,'Core/integration:',report.extraPassed+'/'+report.coreAndIntegration);
 for(const f of report.failures)console.error('FAIL',f.tree||'',f.name||f.key,f.baseline,'->',f.actual,f.error||'');
 if(report.failures.length)process.exitCode=1;
}
