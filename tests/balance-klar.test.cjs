'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const game=fs.readFileSync('game.js','utf8');
const start=game.indexOf('function enemyFor');
const enemyFor=vm.runInNewContext(game.slice(start,game.indexOf('let enemy=',start))+'\nenemyFor');
const warrior=require('../warrior-system.js');

test('wave 10 boss is a readable spike, not a fourfold sponge',()=>{
 const normal=enemyFor(9),boss=enemyFor(10),later=enemyFor(30);
 assert.equal(boss.boss,true);
 assert.ok(boss.maxHp<normal.maxHp*4,'boss should stay under four times the previous wave');
 assert.ok(boss.maxHp>normal.maxHp*2);
 assert.ok(boss.atk<normal.atk*1.6);
 assert.ok(later.maxHp<5000,'wave 30 must stay in a range gold, talents and loot can reach');
});

test('run gold only buys attack and life',()=>{
 assert.ok(game.includes("RUN_FIELDS=['atk','hp']"));
 assert.ok(game.includes("if(!permanent&&k!=='atk'&&k!=='hp')return;"));
 assert.ok(game.includes('Schwerer Schlag'));
 assert.ok(game.includes('Es fehlte Angriff oder Leben'));
});

test('the first talent points stay cheap and only later points compound',()=>{
 warrior.resetForTests();
 assert.equal(warrior.soulCost(0),5);
 assert.equal(warrior.soulCost(1),6);
 assert.equal(warrior.soulCost(9),14);
 assert.equal(warrior.soulCost(10),14);
 assert.ok(warrior.soulCost(11)>warrior.soulCost(10));
 assert.ok(warrior.soulCost(20)>warrior.soulCost(11)*1.5);
});
