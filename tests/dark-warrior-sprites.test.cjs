'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const base='assets/characters/dunkler-krieger/v1/';
const config=JSON.parse(fs.readFileSync(base+'manifest.runtime.json','utf8'));
const atlasCode=fs.readFileSync(base+'warrior-atlases.js','utf8');
const driverCode=fs.readFileSync('warrior-sprite.js','utf8');
const html=fs.readFileSync('index.html','utf8');
function readAtlas(){
 const scope={window:{}};
 vm.runInNewContext(atlasCode,scope,{filename:'warrior-atlases.js'});
 return scope.window.DARK_WARRIOR_ATLASES;
}
function dims(src){
 assert.ok(src.startsWith('data:image/webp;base64,'));
 const bin=Buffer.from(src.slice('data:image/webp;base64,'.length),'base64');
 assert.equal(bin.toString('ascii',0,4),'RIFF');
 assert.equal(bin.toString('ascii',8,12),'WEBP');
 assert.equal(bin.toString('ascii',12,16),'VP8X');
 assert.equal(bin.readUInt32LE(4)+8,bin.length,'WebP RIFF size must be complete');
 const width=1+bin[24]+(bin[25]<<8)+(bin[26]<<16);
 const height=1+bin[27]+(bin[28]<<8)+(bin[29]<<16);
 return {width,height,bytes:bin.length};
}
test('six sequences contain exactly 40 source-derived frames with correct atlas dimensions',()=>{
 const atlas=readAtlas();let sum=0;
 assert.deepEqual(Object.keys(atlas).sort(),['attack','death','hit','idle','special','walk'].sort());
 for(const [name,anim] of Object.entries(config.animations)){
   const d=dims(atlas[name]);
   assert.deepEqual({width:d.width,height:d.height},{width:anim.frames*128,height:192},name);
   assert.ok(d.bytes>10000,name+' must use real image data');
   sum+=anim.frames;
 }
 assert.equal(sum,40);
 assert.equal(config.source.frame.width,448);assert.equal(config.source.frame.height,672);
});
test('all poses honor expected looping and animation metadata',()=>{
 for(const pose of ['idle','walk'])assert.equal(config.animations[pose].loop,true);
 for(const pose of ['attack','hit','death','special'])assert.equal(config.animations[pose].loop,false);
 assert.deepEqual(config.runtime.footAnchor,{x:64,y:179});
 assert.ok(driverCode.includes('imageSmoothingEnabled=false'));
 assert.ok(html.includes('image-rendering:pixelated'));
});
test('battle UI includes responsive sprite canvas, fallback and correct script ordering',()=>{
 assert.ok(html.includes('id="heroSprite"'));
 assert.ok(html.includes('id="heroFallback"'));
 const before=['src="warrior-system.js"','src="loot-system.js"','src="game.js"','src="'+base+'warrior-atlases.js"','src="warrior-sprite.js"'];
 const offsets=before.map(k=>html.indexOf(k));
 assert.ok(offsets.every((i,n)=>i>=0&&(n===0||i>offsets[n-1])));
});
test('gameplay, skills, loot and class progression byte-for-byte unchanged on visual branch',()=>{
 const baselines={
 'game.js':'c90976cefd365fc61c0f6abbe097351113933cda',
 'warrior-system.js':'d7a2316ec44426d2c1326e72bedea5a1b6fd2ac1',
 'loot-system.js':'2951a3f7165a5c2d9373fa6f7961ca0864d94d23'
 };
 for(const [path,expected]of Object.entries(baselines)){
  const bytes=fs.readFileSync(path),prefix=Buffer.from('blob '+bytes.length+'\0');
  const hash=crypto.createHash('sha1').update(prefix).update(bytes).digest('hex');
  assert.equal(hash,expected,path+' changed unexpectedly');
 }
});
test('renderer boots, can replay six animation modes and retains emoji fallback protection',()=>{
 const atlas=readAtlas();
 let current=1000;
 const draw=[];
 const nodes=new Map();
 const classList=()=>({contains:()=>true});
 function node(id){
   if(nodes.has(id))return nodes.get(id);
   let x={id,textContent:id==='wave'?'Welle 1':id==='enemyHpText'?'47 / 47':id==='hpText'?'100 / 100':'',style:{},dataset:{},classList:classList()};
   if(id==='heroSprite'){x.getContext=()=>({imageSmoothingEnabled:true,clearRect(){},drawImage(...args){draw.push(args)}})}
   nodes.set(id,x);return x;
 }
 class MockImage{
  constructor(){this.onload=null;this.onerror=null;this.naturalWidth=0;this.naturalHeight=0}
  set src(url){
   const d=dims(url);this.naturalWidth=d.width;this.naturalHeight=d.height;if(this.onload)this.onload();
  }
 }
 let onObserve=0;
 class MO{constructor(handler){this.handler=handler}observe(){onObserve++}}
 const queue=[];
 const sandbox={window:null,document:{getElementById:node},Image:MockImage,MutationObserver:MO,requestAnimationFrame(fn){queue.push(fn)},performance:{now:()=>current},console,queueMicrotask(fn){fn()}};
 sandbox.window=sandbox;sandbox.DARK_WARRIOR_ATLASES=atlas;
 vm.runInNewContext(driverCode,sandbox,{filename:'warrior-sprite.js'});
 const ctrl=sandbox.DarkWarriorSprite;
 assert.ok(ctrl.inspect().ready);
 assert.equal(node('heroSprite').dataset.ready,'true');
 assert.equal(node('heroFallback').style.display,'none');
 assert.equal(onObserve,2);
 for(const pose of Object.keys(config.animations)){
  current+=1100;
  ctrl.play('idle');
  ctrl.play(pose);
  assert.equal(ctrl.inspect().animation,pose);
  const fn=queue.shift();fn(current+100);
 }
 assert.ok(draw.length>=5);
 ctrl.play('death');assert.equal(ctrl.inspect().dead,true);
 assert.equal(ctrl.play('attack'),false);
 ctrl.play('idle');assert.equal(ctrl.inspect().dead,false);
});
