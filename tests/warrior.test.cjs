'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const warriorCode=fs.readFileSync('warrior-system.js','utf8');
const gameCode=fs.readFileSync('game.js','utf8');
const equipmentCode=fs.readFileSync('equipment.js','utf8');
function storage(initial={}){
 const db=new Map(Object.entries(initial));return {getItem:k=>db.has(k)?db.get(k):null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k),dump:k=>JSON.parse(db.get(k)||'null')};
}
function environment(s=storage(),withGame=false){
 const elems=new Map();
 const dom={getElementById(id){if(!elems.has(id))elems.set(id,{id,style:{},classList:{add(){},remove(){},toggle(){}},textContent:'',innerHTML:'',disabled:false});return elems.get(id)},addEventListener(){},hidden:false};
 const sandbox={localStorage:s,window:null,document:dom,performance:{now:()=>0},requestAnimationFrame(fn){sandbox.nextFrame=fn},confirm:()=>true,Math,console};
 sandbox.window=sandbox;sandbox.addEventListener=()=>{};sandbox.globalThis=sandbox;
 vm.runInNewContext(warriorCode,sandbox,{filename:'warrior-system.js'});
 if(withGame){vm.runInNewContext(equipmentCode,sandbox,{filename:'equipment.js'});vm.runInNewContext(gameCode,sandbox,{filename:'game.js'})}
 return {s,w:sandbox.Warrior,game:sandbox,elems};
}
test('core is nine rank-one talents with permanent unique milestone awards',()=>{
 const {w}=environment();assert.equal(w.core.length,9);assert.equal(w.remainingCore(),0);
 assert.equal(w.earnThrough(9),0);assert.equal(w.earnThrough(10),1);assert.equal(w.earnThrough(10),0);
 assert.equal(w.earnThrough(50),8);assert.equal(w.remainingCore(),9);
 for(let i=0;i<9;i++)assert.equal(w.learnCore(i),true);
 assert.equal(w.learnCore(0),false);assert.equal(w.unlockedSpecs(),true);assert.equal(w.remainingCore(),0);
});
test('souls purchased progressively; free preview cannot grant paid points',()=>{
 const {w}=environment();assert.equal(w.soulReward(4),0);assert.equal(w.soulReward(5),1);assert.equal(w.soulReward(50),31);
 assert.equal(w.buy(),false);w.earnThrough(50);for(let i=0;i<9;i++)w.learnCore(i);
 assert.equal(w.buy(),false);w.awardSouls(50);assert.equal(w.buy(),true);
 assert.equal(w.load().purchased,1);assert.equal(w.load().souls,26);
 assert.equal(w.soulCost(0),5);assert.equal(w.soulCost(1),6);
});
test('specialization tier gates, prerequisites, three-active cap and respec',()=>{
 const {w}=environment();w.earnThrough(50);for(let i=0;i<9;i++)w.learnCore(i);
 w.setPreview(true);
 assert.equal(w.mutateSpec(0,6,1),false,'row 3 requires 10 points in branch');
 assert.equal(w.mutateSpec(0,0,1),true);
 assert.equal(w.mutateSpec(0,7,1),false,'row 3 unavailable');
 for(let i=0;i<4;i++)w.mutateSpec(0,0,1);
 for(let i=0;i<5;i++)w.mutateSpec(0,1,1);
 assert.equal(w.mutateSpec(0,6,1),true);
 assert.equal(w.mutateSpec(0,0,-1),false,'cannot strand row 3');
 assert.equal(w.resetPreview(),true);
 assert.equal(w.points(w.load().previewSpecs),0);
 w.setPreview(false);assert.equal(w.mutateSpec(0,0,1),false,'must purchase points');
});
test('all 54 spec talents have engine implementations, plus 9 core passives',()=>{
 for(let i=0;i<3;i++)for(let j=0;j<18;j++){
  const represented= new RegExp('R\\('+i+','+j+'\\)').test(gameCode)||[6,17].includes(j)&&gameCode.includes("tree:"+i+",idx:"+j);
  assert.ok(represented,'Missing specialization '+i+'/'+j);
 }
 for(let i=0;i<9;i++)assert.ok(gameCode.includes('C('+i+')'),'Missing core '+i);
});
test('cooldown survives wave switch and game reload without offline passage',()=>{
 const saved={coins:0,best:1,run:{wave:1,highest:1,level:1,xp:0,gold:0,hp:100,kills:0,bosses:0,runUp:{},paused:false,active:true,elapsed:0,enemyHp:1,preview:true,claimed:false,build:{core:Array(9).fill(1),specs:Array.from({length:3},()=>Array(18).fill(0)),preview:true},fx:{time:1000,bleeds:[],corrupt:[],resolve:[],cd:{base:8000}},heroClock:1090,enemyClock:0}};
 const s=storage({'idle-rpg-core-v01':JSON.stringify(saved)});
 const e=environment(s,true);e.game.nextFrame(100);e.game.nextFrame(200);
 let state=s.dump('idle-rpg-core-v01');assert.equal(state.run.wave,2);assert.equal(state.run.fx.cd.base,8000);
 let f=environment(s,true);assert.equal(f.elems.get('skills').innerHTML.includes('Vernichtender Hieb · 7s'),true);
 assert.equal(s.dump('idle-rpg-core-v01').run.fx.time,1100);
});
test('preview win has no permanent coin income; preview finish earns no souls',()=>{
 const saved={coins:50,best:1,run:{wave:1,highest:1,level:1,xp:0,gold:0,hp:100,active:true,preview:true,enemyHp:1,build:{core:Array(9).fill(1),specs:Array.from({length:3},()=>Array(18).fill(0)),preview:true},fx:{time:0,cd:{},bleeds:[],corrupt:[],resolve:[]},heroClock:1090}};
 const s=storage({'idle-rpg-core-v01':JSON.stringify(saved)});
 const e=environment(s,true);e.game.nextFrame(100);e.game.nextFrame(200);
 assert.equal(s.dump('idle-rpg-core-v01').coins,50);e.game.endRun();
 assert.equal(e.w.load().souls,0);
});
test('normal run completion awards repeatable class souls exactly once',()=>{
 const saved={coins:0,best:5,run:{wave:5,highest:5,level:1,xp:0,gold:0,hp:100,active:true,preview:false,enemyHp:50,build:{core:Array(9).fill(0),specs:Array.from({length:3},()=>Array(18).fill(0)),preview:false},fx:{time:0,cd:{},bleeds:[],corrupt:[],resolve:[]}}};
 const s=storage({'idle-rpg-core-v01':JSON.stringify(saved)});
 const e=environment(s,true);e.game.endRun();assert.equal(e.w.load().souls,1);
 e.game.endRun();assert.equal(e.w.load().souls,1);
});


test('blood skills build a guaranteed bleed and Bloodbath consumes it',()=>{
 const specs=Array.from({length:3},()=>Array(18).fill(0));specs[0][6]=1;specs[0][17]=1;
 const saved={coins:0,run:{wave:1,highest:1,level:1,hp:100,active:true,preview:true,enemyHp:1000,build:{core:Array(9).fill(1),specs,preview:true},fx:{time:0,cd:{},bleeds:[],corrupt:[],resolve:[]}}};
 const s=storage({'idle-rpg-core-v01':JSON.stringify(saved)}),e=environment(s,true);
 assert.equal(e.game.cast('rush'),true);assert.equal(s.dump('idle-rpg-core-v01').run.fx.bleeds.length,1);
 assert.equal(e.game.cast('bloodbath'),true);assert.equal(s.dump('idle-rpg-core-v01').run.fx.bleeds.length,0);
 assert.equal(e.game.cast('bloodbath'),false,'cast on cooldown must fail');
});
test('corruption and resolve abilities create status stacks, without resetting other CDs',()=>{
 const specs=Array.from({length:3},()=>Array(18).fill(0));specs[1][6]=1;specs[2][5]=1;specs[2][6]=1;
 const saved={coins:0,run:{wave:2,highest:2,level:1,hp:100,active:true,preview:true,enemyHp:1000,build:{core:Array(9).fill(1),specs,preview:true},fx:{time:0,cd:{},bleeds:[],corrupt:[],resolve:[]}}};
 const s=storage({'idle-rpg-core-v01':JSON.stringify(saved)}),e=environment(s,true);
 assert.equal(e.game.cast('curse'),true);assert.equal(s.dump('idle-rpg-core-v01').run.fx.corrupt.length,3);
 assert.equal(e.game.cast('breaker'),true);assert.ok(s.dump('idle-rpg-core-v01').run.fx.resolve.length>=3);
 assert.equal(e.game.cast('curse'),false);
});
test('core passives change maximum HP and attack stats instead of just the planner',()=>{
 const specs=Array.from({length:3},()=>Array(18).fill(0));
 const saved={coins:0,run:{wave:1,highest:1,level:1,hp:100,active:true,preview:false,enemyHp:50,build:{core:[1,1,1,1,1,1,1,1,1],specs,preview:false},fx:{time:0,cd:{},bleeds:[],corrupt:[],resolve:[]}}};
 const e=environment(storage({'idle-rpg-core-v01':JSON.stringify(saved)}),true);
 assert.ok(e.elems.get('hpText').textContent.includes('/ 110 HP'));
 assert.ok(e.elems.get('combatStats').textContent.includes('⚔️ 10'),'Core +5 % must affect attack base of 10');
});
test('auto skill automation is saved and independently toggleable',()=>{
 const saved={coins:0,settings:{auto:{}},run:{wave:1,highest:1,level:1,hp:100,active:true,preview:false,enemyHp:50,build:{core:Array(9).fill(0),specs:Array.from({length:3},()=>Array(18).fill(0)),preview:false},fx:{time:0,cd:{},bleeds:[],corrupt:[],resolve:[]}}};
 const s=storage({'idle-rpg-core-v01':JSON.stringify(saved)}),e=environment(s,true);
 e.game.toggleAuto('base');assert.equal(s.dump('idle-rpg-core-v01').settings.auto.base,true);
 e.game.nextFrame(100);e.game.nextFrame(200);
 assert.ok(s.dump('idle-rpg-core-v01').run.fx.cd.base>=10000,'Base skill should cast automatically');
});

test('talent cache reload sees point purchases and global Seelen from another page',()=>{
 const s=storage();const {w}=environment(s);
 assert.equal(w.load().souls,0);assert.equal(w.load().purchased,0);
 const saved=w.load();saved.purchased=1;
 s.setItem('idle-rpg-warrior-progression-v03',JSON.stringify(saved));
 const bank=s.dump('idle-rpg-souls-v1');bank.balance=123;
 s.setItem('idle-rpg-souls-v1',JSON.stringify(bank));
 assert.equal(w.load().purchased,0,'Krieger-Talentpunkte müssen bis Reload gecacht bleiben');
 assert.equal(w.load().souls,123,'Seelenkonto zeigt frische Balance anderer Klassen');
 assert.equal(w.reload().purchased,1);
 assert.equal(w.load().souls,123);
});


test('class souls migrate to accountwide Seelen exactly once',()=>{
 const raw={version:3,earnedCore:9,core:Array(9).fill(1),souls:31,purchased:0,specs:Array.from({length:3},()=>Array(18).fill(0)),previewMode:false,previewSpecs:Array.from({length:3},()=>Array(18).fill(0))};
 const s=storage({'idle-rpg-warrior-progression-v03':JSON.stringify(raw)});
 let e=environment(s);
 assert.equal(e.w.load().souls,31);
 assert.equal(s.dump('idle-rpg-souls-v1').balance,31);
 assert.equal(s.dump('idle-rpg-souls-v1').migratedWarrior,true);
 e.w.reload();assert.equal(e.w.load().souls,31);
 e=environment(s);assert.equal(e.w.load().souls,31);
 assert.equal(e.w.buy(),true);
 assert.equal(e.w.load().souls,26);
 assert.equal(s.dump('idle-rpg-souls-v1').balance,26);
 assert.equal(s.dump('idle-rpg-warrior-progression-v03').purchased,1);
});
test('existing shared soul bank adds legacy warrior currency once',()=>{
 const raw={souls:12,purchased:0,earnedCore:9,core:Array(9).fill(1)};
 const s=storage({'idle-rpg-warrior-progression-v03':JSON.stringify(raw),
  'idle-rpg-souls-v1':JSON.stringify({version:1,balance:40})});
 const e=environment(s);
 assert.equal(e.w.load().souls,52);
 assert.equal(e.w.reload().souls,52);
 assert.equal(s.dump('idle-rpg-souls-v1').balance,52);
});
test('talent purchase reads shared souls granted by another class',()=>{
 const s=storage();const e=environment(s);
 e.w.earnThrough(50);for(let i=0;i<9;i++)assert.equal(e.w.learnCore(i),true);
 assert.equal(e.w.buy(),false);
 const bank=s.dump('idle-rpg-souls-v1');
 s.setItem('idle-rpg-souls-v1',JSON.stringify({...bank,balance:25}));
 assert.equal(e.w.buy(),true);
 assert.equal(e.w.load().souls,20);
 assert.equal(s.dump('idle-rpg-souls-v1').balance,20);
});
test('run end rewards normal shared souls and never duplicates on second finish',()=>{
 const saved={coins:0,best:5,run:{wave:5,highest:5,level:1,xp:0,gold:0,hp:100,active:true,preview:false,enemyHp:50,build:{core:Array(9).fill(0),specs:Array.from({length:3},()=>Array(18).fill(0)),preview:false},fx:{time:0,cd:{},bleeds:[],corrupt:[],resolve:[]}}};
 const s=storage({'idle-rpg-core-v01':JSON.stringify(saved)});
 const e=environment(s,true);e.game.endRun();e.game.endRun();
 assert.equal(s.dump('idle-rpg-souls-v1').balance,1);
 assert.match(e.elems.get('summary').textContent,/Seelen/);
 assert.doesNotMatch(e.elems.get('summary').textContent,/Klassenseelen/);
});
