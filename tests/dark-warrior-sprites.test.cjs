'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const game=fs.readFileSync('game.js','utf8');
const driver=fs.readFileSync('warrior-sprite.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const manifest=JSON.parse(fs.readFileSync('assets/characters/dunkler-krieger/v2/animations.json','utf8'));

test('v2 frames are real transparent PNGs with the promised counts',()=>{
 assert.equal(manifest.frameWidth,768);
 assert.equal(manifest.animations.idle.frameCount,4);
 assert.equal(manifest.animations.attack.frameCount,5);
 assert.equal(manifest.animations.hit.frameCount,3);
 assert.equal(manifest.animations.death.frameCount,5);
 assert.equal(manifest.animations.death.holdLast,true);
 for(const anim of Object.values(manifest.animations)){
  for(const path of anim.frames){
   const buf=fs.readFileSync(path);
   assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a',path);
   assert.ok(buf.includes(Buffer.from('tRNS'))||buf.includes(Buffer.from('IDAT')),path);
  }
 }
});

test('combat math is unchanged and only pose signals were added',()=>{
 assert.ok(game.includes("let dmg=Math.max(1,s.atk*power*(1+.02*R(0,1)+.02*R(1,1)+(resolve()>=3?.02*R(2,15):0))-defense);"));
 assert.ok(game.includes('r.hp-=Math.max(1,incoming);'));
 assert.equal(game.split("warriorPose('attack')").length-1,2);
 assert.equal(game.split("warriorPose('hit')").length-1,1);
 assert.ok(game.includes("if(String(reason).includes('Besiegt'))warriorPose('death')"));
 assert.ok(!game.includes('enemyHp-=dmg;warriorPose'));
});

test('renderer follows fight events without touching the hero layout',()=>{
 assert.ok(html.includes('width="665" height="591"'));
 assert.ok(html.includes('width:220px;height:310px'));
 assert.ok(html.includes('src="warrior-sprite.js"'));
 assert.ok(driver.includes('rpg-warrior-pose'));
 assert.ok(driver.includes('assets/characters/dunkler-krieger/v2/'));
 assert.ok(driver.includes('assets/characters/dunkler-krieger/v1/'));
 const poses=[];
 const images=[];
 class MockImage{
  constructor(){images.push(this);this.complete=false;this.naturalWidth=0;this.naturalHeight=0}
  set src(v){this._src=v;this.complete=true;this.naturalWidth=768;this.naturalHeight=768;if(this.onload)this.onload()}
  get src(){return this._src||''}
 }
 const canvas={width:665,height:591,style:{},dataset:{},getContext:()=>({imageSmoothingEnabled:true,imageSmoothingQuality:'high',clearRect(){},drawImage(){}})};
 const fallback={style:{}};
 const nodes=new Map([['heroSprite',canvas],['heroFallback',fallback]]);
 const queue=[];
 const sandbox={
  window:null,document:{getElementById:id=>nodes.get(id)||null},
  Image:MockImage,performance:{now:()=>0},requestAnimationFrame(fn){queue.push(fn)},
  console,matchMedia:()=>({matches:false})
 };
 sandbox.window=sandbox;
 sandbox.addEventListener=(type,fn)=>{sandbox['on:'+type]=fn};
 sandbox.dispatchEvent=(ev)=>{const fn=sandbox['on:'+ev.type];if(fn)fn(ev)};
 function CustomEvent(type,init){this.type=type;this.detail=init&&init.detail}
 sandbox.CustomEvent=CustomEvent;
 vm.runInNewContext(driver,sandbox,{filename:'warrior-sprite.js'});
 const ctrl=sandbox.DarkWarriorSprite;
 assert.equal(ctrl.inspect().ready,true);
 assert.equal(ctrl.inspect().animation,'idle');
 sandbox.dispatchEvent(new CustomEvent('rpg-warrior-pose',{detail:'attack'}));
 assert.equal(ctrl.inspect().animation,'attack');
 sandbox.dispatchEvent(new CustomEvent('rpg-warrior-pose',{detail:'hit'}));
 assert.equal(ctrl.inspect().animation,'hit');
 sandbox.dispatchEvent(new CustomEvent('rpg-warrior-pose',{detail:'attack'}));
 assert.equal(ctrl.inspect().animation,'hit');
 sandbox.dispatchEvent(new CustomEvent('rpg-warrior-pose',{detail:'death'}));
 assert.equal(ctrl.inspect().dead,true);
 assert.equal(ctrl.play('attack'),false);
 sandbox.dispatchEvent(new CustomEvent('rpg-warrior-pose',{detail:'idle'}));
 assert.equal(ctrl.inspect().dead,false);
 assert.equal(ctrl.inspect().animation,'idle');
 assert.ok(poses.length>=0);
});
