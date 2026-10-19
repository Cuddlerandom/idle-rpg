'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../equipment.js');
const warriorCode=fs.readFileSync('warrior-system.js','utf8');
const equipmentCode=fs.readFileSync('equipment.js','utf8');
const gameCode=fs.readFileSync('game.js','utf8');
function storage(initial={}){const data=new Map(Object.entries(initial));return {getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),dump:k=>JSON.parse(data.get(k)||'null')}}
function boot(store=storage()){
 const els=new Map(),doc={hidden:false,addEventListener(){},getElementById(id){if(!els.has(id))els.set(id,{id,style:{},classList:{add(){},remove(){},toggle(){}},innerHTML:'',textContent:'',disabled:false});return els.get(id)}};
 const ctx={document:doc,localStorage:store,Math,console,performance:{now:()=>0},confirm:()=>true,requestAnimationFrame:fn=>{ctx.nextFrame=fn},addEventListener(){}};
 ctx.window=ctx;ctx.globalThis=ctx;
 for(const [name,code] of [['warrior-system.js',warriorCode],['equipment.js',equipmentCode],['game.js',gameCode]])vm.runInNewContext(code,ctx,{filename:name});
 return {ctx,els,store,Equipment:ctx.Equipment,Warrior:ctx.Warrior};
}
test('9 Ausrüstungsplätze, 50 Inventarplätze, fünf Seltenheiten',()=>{
 assert.equal(E.SLOTS.length,9);assert.equal(new Set(E.SLOTS.map(x=>x.id)).size,9);assert.equal(E.RARITIES.length,5);
 assert.ok(E.TEMPLATES.length>=24);
});
test('garantierte Starter-Beute und erste Bosswaffe',()=>{
 const e=E.blank();assert.equal(E.onWin(e,1,()=>.5).item.slot,'weapon');
 assert.ok(['head','shoulders','chest','hands','legs','boots'].includes(E.onWin(e,3,()=>.5).item.slot));
 assert.ok(['ring','amulet'].includes(E.onWin(e,5,()=>.5).item.slot));
 const boss=E.onWin(e,10,()=>.5).item;assert.equal(boss.unique,true);assert.equal(boss.slot,'weapon');assert.ok(boss.rarity>=3);
});
test('zufällige Affixe bleiben beim Neuladen erhalten',()=>{
 const item=E.roll(20,()=>.5,'any'),e=E.blank();const assigned=E.addLoot?E.addLoot(e,item,20):E.onWin(e,1,()=>.5);
 // Die serialisierte Beute muss dieselben Attribute rekonstruieren.
 const p=E.repair(JSON.parse(JSON.stringify(e)));
 assert.deepEqual(p.bag.map(x=>x.stats),e.bag.map(x=>x.stats));
 assert.deepEqual(p.bag.map(x=>x.name),e.bag.map(x=>x.name));
});
test('alle neun Slots lassen sich ausrüsten, Werte zählen',()=>{
 const e=E.blank();for(const slot of E.SLOTS){const t=E.TEMPLATES.find(x=>x.slot===slot.id&&!x.boss);const it=E.makeItem(t.id,0,1,e.nextId++);e.bag.push(it);assert.equal(E.moveToGear(e,it.uid,1).ok,true)}
 assert.equal(e.bag.length,0);assert.equal(Object.keys(e.gear).length,9);const mods=E.bonuses(e);assert.ok(mods.atk>0&&mods.hp>0);
});
test('Levelvoraussetzung und Gold-Verkauf',()=>{
 const e=E.blank(),item=E.makeItem('bloodblade',2,30,e.nextId++);e.bag.push(item);
 assert.equal(E.moveToGear(e,item.uid,1).ok,false);
 assert.equal(E.moveToGear(e,item.uid,5).ok,true);
 assert.equal(E.removeGear(e,'weapon').ok,true);
 const sold=E.sell(e,item.uid);assert.equal(sold.ok,true);assert.equal(sold.gold,item.value);
});
test('voller 50er Beutel führt zu Bodenbeute; Ablauf nach fünf folgenden Siegen',()=>{
 const e=E.blank();for(let i=0;i<50;i++)e.bag.push(E.makeItem('rustblade',0,1,e.nextId++));
 const drop=E.onWin(e,10,()=>.5);assert.equal(drop.where,'ground');assert.equal(e.bag.length,50);assert.equal(e.ground.length,1);
 assert.equal(E.collect(e,drop.item.uid).ok,false);
 E.sell(e,e.bag[0].uid);assert.equal(E.collect(e,drop.item.uid).ok,true);
 const other=E.onWin(e,11,()=>.0); // 50/50, auf dem Boden
 if(other){assert.equal(other.where,'ground');for(let w=12;w<=16;w++)E.onWin(e,w,()=>1);assert.equal(e.ground.some(x=>x.item.uid===other.item.uid),false)}
});
test('besonderes Waffenmodell bleibt erhalten und Schmiedestufe ist dauerhaft',()=>{
 const a=E.blankArsenal();assert.equal(E.unlock(a,'boss-blood'),true);assert.equal(E.unlock(a,'boss-blood'),false);
 assert.equal(E.forgeCost(a,'boss-blood'),80);
 const before=E.starter(a),result=E.improve(a,'boss-blood',100);assert.equal(result.ok,true);assert.equal(result.cost,80);
 const save=E.repairArsenal(JSON.parse(JSON.stringify(a))),after=E.starter(save);
 assert.equal(save.unlocked.length,1);assert.ok(after.stats.atk>before.stats.atk);assert.equal(save.levels['boss-blood'],1);
});
test('Starter-Arsenal gibt keine permanenten Run-Gegenstände mit',()=>{
 const a=E.blankArsenal();E.unlock(a,'boss-guard');const r1=E.blank();r1.gear.weapon=E.starter(a);r1.nextId=2;
 const r2=E.blank();r2.gear.weapon=E.starter(a);r2.nextId=2;
 assert.deepEqual(r1.gear.weapon.stats,r2.gear.weapon.stats);assert.equal(r1.bag.length,0);assert.equal(r2.bag.length,0);
});
test('Inventar öffnet und pausiert Kampf ohne Run dauerhaft zu pausieren',()=>{
 const {ctx,store}=boot();let f=ctx.nextFrame;f(100);const before=store.dump('idle-rpg-core-v01')?.run?.fx?.time||0;
 ctx.tab('inventory');f(200);f(300);ctx.tab('run');f(400);
 const after=store.dump('idle-rpg-core-v01')?.run?.fx?.time||0;assert.ok(after>=before);
});
test('Ausrüsten verändert wirkliche Kampfwerte und Item bleibt gespeichert',()=>{
 const e=E.blank();const item=E.makeItem('rustblade',0,1,e.nextId++);e.bag.push(item);
 const store=storage({'idle-rpg-core-v01':JSON.stringify({run:{active:true,wave:1,highest:1,level:1,hp:100,equipment:e}})});
 const {ctx,els}=boot(store);const before=els.get('combatStats').textContent;
 ctx.tab('inventory');ctx.equipItem(item.uid);const after=els.get('combatStats').textContent;
 assert.notEqual(before,after);const gear=store.dump('idle-rpg-core-v01').run.equipment.gear;assert.equal(gear.weapon.template,'rustblade');
});
test('Bosswaffen werden normal dauerhaft freigeschaltet, nicht im Testmodus',()=>{
 const e=E.blank();
 const store=storage({'idle-rpg-core-v01':JSON.stringify({run:{active:true,preview:false,wave:10,highest:10,level:4,hp:120,enemyHp:1,equipment:e}})});
 const {ctx}=boot(store);ctx.cast('base');
 const arsenal=store.dump('idle-rpg-core-v01').arsenal;
 assert.equal(arsenal.unlocked.length,1);assert.equal(arsenal.selected,arsenal.unlocked[0]);
 const testStore=storage({'idle-rpg-core-v01':JSON.stringify({run:{active:true,preview:true,wave:10,highest:10,level:4,hp:120,enemyHp:1,equipment:E.blank()}})});
 const {ctx:testCtx}=boot(testStore);testCtx.cast('base');assert.equal(testStore.dump('idle-rpg-core-v01').arsenal.unlocked.length,0);
});
test('Auswahl und Schmieden gesperrt im Run; nach dem Run persistieren sie',()=>{
 const a=E.blankArsenal();E.unlock(a,'boss-blood');E.unlock(a,'boss-shadow');
 const s=storage({'idle-rpg-core-v01':JSON.stringify({coins:200,arsenal:a,run:{active:false,hp:100}})});
 const {ctx}=boot(s);ctx.tab('inventory');ctx.chooseArsenal('boss-shadow');ctx.forgeArsenal('boss-shadow');
 let save=s.dump('idle-rpg-core-v01');assert.equal(save.coins,120);assert.equal(save.arsenal.selected,'boss-shadow');assert.equal(save.arsenal.levels['boss-shadow'],1);
 ctx.startRun();save=s.dump('idle-rpg-core-v01');
 assert.equal(save.run.equipment.gear.weapon.template,'boss-shadow');assert.equal(save.run.equipment.gear.weapon.forge,1);
 ctx.chooseArsenal('boss-blood');assert.equal(s.dump('idle-rpg-core-v01').arsenal.selected,'boss-shadow');
});
