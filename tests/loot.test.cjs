'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const warrior=fs.readFileSync('warrior-system.js','utf8'),loot=fs.readFileSync('loot-system.js','utf8'),game=fs.readFileSync('game.js','utf8');
function env(data={}){
 const db=new Map(Object.entries(data)),elems=new Map(),store={getItem:k=>db.get(k)??null,setItem:(k,v)=>db.set(k,String(v)),dump:k=>JSON.parse(db.get(k)||'null')};
 const root={localStorage:store,window:null,globalThis:null,document:{hidden:false,addEventListener(){},getElementById(id){if(!elems.has(id))elems.set(id,{innerHTML:'',textContent:'',style:{},classList:{add(){},remove(){},toggle(){}}});return elems.get(id)}},performance:{now:()=>0},requestAnimationFrame(fn){root.nextFrame=fn},confirm:()=>true,addEventListener(){},console,Math};
 root.window=root;root.globalThis=root;
 vm.runInNewContext(warrior,root);vm.runInNewContext(loot,root);vm.runInNewContext(game,root);
 return {loot:root.Loot,root,store,elems};
}
function item(id='test',slot='weapon',stat='atk',value=25){
 return {id,slot,name:'Testklinge',rarity:'rare',level:2,required:1,affixes:[{stat,value}],unique:null,sell:21};
}
function saved(gear){
 return {'idle-rpg-core-v01':JSON.stringify({coins:50,run:{wave:1,highest:1,level:1,xp:0,gold:0,hp:100,active:true,enemyHp:47,build:{core:Array(9).fill(0),specs:Array.from({length:3},()=>Array(18).fill(0)),preview:false},loot:gear,fx:{time:0,bleeds:[],corrupt:[],resolve:[],cd:{}}}})};
}
test('nine item slots, fifty bag cells, five rarities and twelve unique items',()=>{
 const {loot:l,elems,root}=env();root.tab('items');
 assert.equal(l.slots.length,9);assert.equal(l.rarities.length,5);assert.equal(l.uniques.length,12);
 assert.equal((elems.get('inventoryGrid').innerHTML.match(/loot-cell/g)||[]).length,50);
 assert.equal((elems.get('gearSlots').innerHTML.match(/loot-slot/g)||[]).length,9);
});
test('boss loot drops; wave level grows and minimum hero level is enforced',()=>{
 const l=env().loot;
 const low=l.roll({wave:10,level:5,boss:true,random:()=>.99,seq:1});
 const high=l.roll({wave:110,level:5,boss:true,random:()=>.99,seq:2});
 assert.ok(low&&high);assert.ok(high.level>low.level);assert.ok(high.required>5);
 assert.equal(l.roll({wave:1,level:1,boss:false,random:()=>.99,seq:3}),null);
});
test('legendary gear has a unique effect and two pieces activate set bonus',()=>{
 const l=env().loot,eq=l.emptyRun().equipment;
 eq.weapon={...item('b'),rarity:'legendary',unique:'bloodthirst',affixes:[]};
 eq.chest={...item('c','chest'),rarity:'legendary',unique:'slaughterer',affixes:[]};
 const x=l.bonuses(eq);
 assert.equal(x.bloodbath,.3);assert.ok(Math.abs(x.bleed-.35)<1e-9);
 assert.equal(x.sets.length,1);
 const unique=l.roll({wave:10,level:10,boss:true,random:()=>.01,seq:4});
 assert.equal(unique.rarity,'legendary');assert.ok(unique.unique);assert.equal(unique.affixes.length,3);
});
test('full bag creates ground loot that expires after five additional waves',()=>{
 const l=env().loot,r=l.emptyRun();
 for(let i=0;i<50;i++)l.award(r,i+1,2,true,()=>.99);
 assert.equal(r.inventory.length,50);
 l.award(r,51,2,true,()=>.99);assert.equal(r.ground.length,1);
 l.expireGround(r,56);assert.equal(r.ground.length,1);
 l.expireGround(r,57);assert.equal(r.ground.length,0);
});
test('equip/unequip/sell update combat strength, inventory and gold',()=>{
 const {root,store,elems}=env(saved({inventory:[item()],equipment:{},ground:[],seq:0}));
 assert.ok(elems.get('combatStats').textContent.includes('⚔️ 10'));
 root.tab('items');root.inspectItem('test');
 assert.ok(elems.get('itemDetail').innerHTML.includes('Ausrüsten'));
 root.itemAction('equip','test');assert.ok(elems.get('combatStats').textContent.includes('⚔️ 35'));
 assert.equal(store.dump('idle-rpg-core-v01').run.loot.equipment.weapon.id,'test');
 root.itemAction('unequip','weapon');root.itemAction('sell','test');
 assert.equal(store.dump('idle-rpg-core-v01').run.gold,21);
 assert.ok(elems.get('combatStats').textContent.includes('⚔️ 10'));
});
test('inventory freezes battle time while open and resumes after closing',()=>{
 const {root,store}=env();
 root.nextFrame(100);root.tab('items');
 root.nextFrame(200);root.nextFrame(300);
 root.tab('run');root.nextFrame(400);root.nextFrame(500);
 root.tab('items');
 const elapsed=store.dump('idle-rpg-core-v01').run.elapsed;
 assert.ok(Math.abs(elapsed-.3)<1e-9,'elapsed after resume: '+elapsed);
});
test('level requirements prevent equipping and new run discards equipment',()=>{
 const high=item('high');high.required=30;
 const {root,store}=env(saved({inventory:[high],equipment:{},ground:[],seq:0}));
 root.tab('items');root.itemAction('equip','high');
 assert.equal(store.dump('idle-rpg-core-v01').run.loot.inventory.length,1);
 root.endRun();root.startRun();
 const r=store.dump('idle-rpg-core-v01').run;
 assert.equal(r.loot.inventory.length,0);assert.equal(r.loot.equipment.weapon,null);
});
test('global soul balance survives gear actions and run reset',()=>{
 const g={inventory:[item()],equipment:{},ground:[],seq:0},data=saved(g);
 data['idle-rpg-souls-v1']=JSON.stringify({version:1,balance:37,migratedWarrior:true});
 const {root,store}=env(data);
 root.tab('items');root.itemAction('sell','test');root.endRun();root.startRun();
 assert.equal(store.dump('idle-rpg-souls-v1').balance,37);
});
