/* Idle RPG V0.4 – temporäre Ausrüstung, Loot und Inventar. Keine Offline-Fortschritte. */
(function(root){
'use strict';
const SLOTS=[
 {id:'weapon',label:'Waffe',icon:'⚔️'},{id:'head',label:'Helm',icon:'🪖'},
 {id:'shoulders',label:'Schultern',icon:'🦴'},{id:'chest',label:'Brust',icon:'🛡️'},
 {id:'hands',label:'Handschuhe',icon:'🧤'},{id:'legs',label:'Hose',icon:'👖'},
 {id:'boots',label:'Stiefel',icon:'🥾'},{id:'ring',label:'Ring',icon:'💍'},
 {id:'amulet',label:'Amulett',icon:'📿'}
];
const RARITIES=[
 {name:'Gewöhnlich',color:'#b7bfc5',factor:1},
 {name:'Ungewöhnlich',color:'#73cc85',factor:1.22},
 {name:'Selten',color:'#76b9ff',factor:1.52},
 {name:'Episch',color:'#c99aff',factor:1.92},
 {name:'Legendär',color:'#ffb45e',factor:2.4}
];
const TEMPLATES=[
 {id:'rustblade',slot:'weapon',name:'Rostiges Langschwert',icon:'🗡️',stats:{atk:3}},
 {id:'bloodblade',slot:'weapon',name:'Klinge der offenen Ader',icon:'🩸',stats:{atk:2,bleedPower:.10,bleedChance:.035}},
 {id:'shadowblade',slot:'weapon',name:'Klinge der Dämmerung',icon:'🌑',stats:{atk:2,shadowPower:.10,corruptChance:.035}},
 {id:'bulwark',slot:'weapon',name:'Eiserner Kriegsbrecher',icon:'🔨',stats:{atk:2,def:2,resolveGuard:.006}},
 {id:'bonehelm',slot:'head',name:'Knochenhelm',icon:'🪖',stats:{hp:14,def:1}},
 {id:'nightcowl',slot:'head',name:'Kapuze der Nacht',icon:'🌘',stats:{hp:8,shadowPower:.05}},
 {id:'spikeshoulders',slot:'shoulders',name:'Dornenschultern',icon:'🦴',stats:{def:2,bleedPower:.045}},
 {id:'ironshoulders',slot:'shoulders',name:'Eisenplatten-Schultern',icon:'⚙️',stats:{def:3,hp:10}},
 {id:'bloodplate',slot:'chest',name:'Blutgehärteter Harnisch',icon:'🛡️',stats:{hp:24,def:2}},
 {id:'oathplate',slot:'chest',name:'Harnisch des Eides',icon:'🪨',stats:{hp:16,def:3,resolveGuard:.006}},
 {id:'vampgloves',slot:'hands',name:'Vampirhandschuhe',icon:'🧤',stats:{atk:1,lifesteal:.025}},
 {id:'bladegloves',slot:'hands',name:'Klingenfäuste',icon:'✊',stats:{atk:2,crit:1}},
 {id:'ironlegs',slot:'legs',name:'Eisengeflochtene Beinlinge',icon:'👖',stats:{def:3,hp:12}},
 {id:'hunterboots',slot:'boots',name:'Stiefel des Jägers',icon:'🥾',stats:{speedPct:.045,hp:6}},
 {id:'stoneboots',slot:'boots',name:'Stiefel des Standhaften',icon:'🥾',stats:{def:2,resolveGuard:.005}},
 {id:'ruby',slot:'ring',name:'Rubinring',icon:'💍',stats:{bleedPower:.07,critDamage:.04}},
 {id:'obsidian',slot:'ring',name:'Obsidianring',icon:'🔮',stats:{shadowPower:.07,crit:2}},
 {id:'oathring',slot:'ring',name:'Ring des Schwurs',icon:'💠',stats:{hp:12,resolveGuard:.007}},
 {id:'lifeamulet',slot:'amulet',name:'Amulett des Lebens',icon:'📿',stats:{hp:15,lifesteal:.012}},
 {id:'corruptamulet',slot:'amulet',name:'Amulett der Verderbnis',icon:'🌑',stats:{shadowPower:.09,corruptChance:.02}},
 {id:'bloodamulet',slot:'amulet',name:'Amulett der Jagd',icon:'🩸',stats:{bleedPower:.075,bleedChance:.02}},
 // Einzigartige Boss-Gegenstände. Effekt-Boni sind fest und keine zufälligen Affixe.
 {id:'boss-blood',slot:'weapon',name:'Herzspalter des Goblinfürsten',icon:'🩸',boss:true,stats:{atk:7,bleedPower:.16,bleedChance:.09}},
 {id:'boss-shadow',slot:'amulet',name:'Hexerauge der Finsternis',icon:'👁️',boss:true,stats:{shadowPower:.20,corruptChance:.09,critDamage:.06}},
 {id:'boss-guard',slot:'chest',name:'Schwurpanzer des Hauptmanns',icon:'🛡️',boss:true,stats:{hp:48,def:6,resolveGuard:.018}}
];
const TEMPLATE_BY_ID=Object.fromEntries(TEMPLATES.map(x=>[x.id,x]));
const STAT_ORDER=['atk','hp','def','regen','crit','critDamage','speedPct','bleedPower','shadowPower','bleedChance','corruptChance','resolveGuard','lifesteal'];
const STAT_LABELS={atk:'Angriff',hp:'Leben',def:'Rüstung',regen:'Regeneration',crit:'Krit-Chance',critDamage:'Krit-Schaden',speedPct:'Angriffstempo',bleedPower:'Blutungsschaden',shadowPower:'Schattenschaden',bleedChance:'Blutungschance',corruptChance:'Verderbnis-Chance',resolveGuard:'Schutz pro Entschlossenheitsstapel',lifesteal:'Lebensraub'};
const PERCENT=new Set(['critDamage','speedPct','bleedPower','shadowPower','bleedChance','corruptChance','resolveGuard','lifesteal']);
const blank=()=>({bag:[],gear:{},ground:[],nextId:1});
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const safeInt=(x,def=0)=>Number.isFinite(Number(x))?Math.floor(Number(x)):def;
function repairItem(raw){
 if(!raw||typeof raw!=='object'||!TEMPLATE_BY_ID[raw.template]||!Number.isSafeInteger(raw.uid)||raw.uid<1)return null;
 const t=TEMPLATE_BY_ID[raw.template],rarity=clamp(safeInt(raw.rarity),0,4),wave=clamp(safeInt(raw.wave,1),1,100000);
 const known=makeItem(t.id,rarity,wave,raw.uid);return known;
}
function repair(raw){
 const out=blank(),seen=new Set();if(!raw||typeof raw!=='object')return out;
 function register(x){const obj=repairItem(x);if(!obj||seen.has(obj.uid))return null;seen.add(obj.uid);return obj}
 out.bag=(Array.isArray(raw.bag)?raw.bag:[]).slice(0,50).map(register).filter(Boolean);
 for(const {id} of SLOTS){const item=register(raw.gear&&raw.gear[id]);if(item&&item.slot===id)out.gear[id]=item}
 out.ground=(Array.isArray(raw.ground)?raw.ground:[]).slice(0,80).map(record=>{
   const item=register(record&&record.item);return item?{item,expiresAt:clamp(safeInt(record.expiresAt,1),1,100000)}:null
 }).filter(Boolean);
 out.nextId=Math.max(safeInt(raw.nextId,1),1,...[...seen].map(x=>x+1));return out;
}
function makeItem(template,rarity,wave,uid){
 const t=TEMPLATE_BY_ID[template];if(!t)return null;
 const q=clamp(safeInt(rarity),0,4),w=clamp(safeInt(wave,1),1,100000);
 const level=Math.max(1,Math.ceil(w/6)),scaling=(1+Math.floor((w-1)/5)*.12)*RARITIES[q].factor;
 const stats={};for(const [k,v] of Object.entries(t.stats)){
  const value=v*scaling;
  stats[k]=PERCENT.has(k)?Math.round(value*10000)/10000:Math.max(1,Math.round(value*10)/10);
 }
 return {uid,template,slot:t.slot,rarity:q,wave:w,level,icon:t.icon,
   name:t.name,unique:!!t.boss,stats,value:Math.ceil((6+w*1.2)*RARITIES[q].factor*(t.boss?2:1))};
}
function quality(wave,random=Math.random,boss=false){
 const w=Math.max(1,safeInt(wave,1)),bonus=clamp(Math.floor(w/25)*.018,0,.12);
 let probs=[.63-bonus*2.6,.255+bonus,.09+bonus,.022+bonus*.4,.003+bonus*.2];
 const u=random();for(let i=0;i<probs.length;i++){if(u<probs[i])return boss?Math.max(2,i):i;u-=probs[i]}return boss?2:0;
}
function roll(wave,random=Math.random,group='any'){
 const w=Math.max(1,safeInt(wave,1));
 const pool=TEMPLATES.filter(t=>group==='boss'?t.boss:!t.boss&&(group==='weapon'?t.slot==='weapon':group==='armor'?['head','shoulders','chest','hands','legs','boots'].includes(t.slot):group==='accessory'?['ring','amulet'].includes(t.slot):true));
 if(!pool.length)return null;
 const t=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
 let rarity=quality(w,random,group==='boss');if(group==='boss')rarity=Math.max(3,rarity);
 return makeItem(t.id,rarity,w,0);
}
function addLoot(raw,item,defeatedWave){
 const e=raw,drop={...item,uid:e.nextId++};
 if(e.bag.length<50){e.bag.push(drop);return {item:drop,where:'bag'}}
 e.ground.push({item:drop,expiresAt:defeatedWave+5});return {item:drop,where:'ground'};
}
function onWin(raw,wave,random=Math.random){
 const e=raw,w=Math.max(1,safeInt(wave,1)),boss=w%10===0;
 // Nach fünf weiteren Wellen verschwindet liegen gebliebene Beute.
 e.ground=e.ground.filter(x=>x.expiresAt>w);
 let group=null;if(boss)group='boss';
 else if(w===1)group='weapon';else if(w===3)group='armor';else if(w===5)group='accessory';
 else if(random()<Math.min(.42,.20+w*.002))group='any';
 if(!group)return null;
 const item=roll(w,random,group);return addLoot(e,item,w);
}
function bonuses(raw){
 const all={};for(const {id} of SLOTS){const item=raw.gear&&raw.gear[id];if(!item)continue;for(const [k,v] of Object.entries(item.stats)){all[k]=(all[k]||0)+v}}
 return all;
}
function moveToGear(raw,uid,heroLevel){
 const index=raw.bag.findIndex(x=>x.uid===uid);if(index<0)return {ok:false,reason:'Nicht im Inventar'};
 const item=raw.bag[index];if(heroLevel<item.level)return {ok:false,reason:'Erfordert Heldenlevel '+item.level};
 raw.bag.splice(index,1);const old=raw.gear[item.slot];if(old)raw.bag.push(old);raw.gear[item.slot]=item;
 return {ok:true,item,replaced:old||null};
}
function removeGear(raw,slot){
 if(!SLOTS.some(s=>s.id===slot)||!raw.gear[slot])return {ok:false,reason:'Kein Gegenstand ausgerüstet'};
 if(raw.bag.length>=50)return {ok:false,reason:'Inventar voll (50/50)'};
 raw.bag.push(raw.gear[slot]);delete raw.gear[slot];return {ok:true};
}
function sell(raw,uid){
 const i=raw.bag.findIndex(x=>x.uid===uid);if(i<0)return {ok:false,reason:'Nicht im Inventar'};
 const [item]=raw.bag.splice(i,1);return {ok:true,item,gold:item.value};
}
function collect(raw,uid){
 const i=raw.ground.findIndex(x=>x.item.uid===uid);if(i<0)return {ok:false,reason:'Nicht mehr auf dem Boden'};
 if(raw.bag.length>=50)return {ok:false,reason:'Inventar voll (50/50)'};
 const [found]=raw.ground.splice(i,1);raw.bag.push(found.item);return {ok:true,item:found.item};
}
function describe(item){
 if(!item)return [];
 return STAT_ORDER.filter(k=>item.stats[k]).map(k=>{
  const v=item.stats[k],n=PERCENT.has(k)?(Math.round(v*10000)/100).toLocaleString('de-CH',{maximumFractionDigits:2})+' %':Number(v).toLocaleString('de-CH',{maximumFractionDigits:1});
  return '+ '+n+' '+STAT_LABELS[k];
 });
}
const api={SLOTS,RARITIES,TEMPLATES,blank,repair,makeItem,roll,quality,onWin,bonuses,moveToGear,removeGear,sell,collect,describe,STAT_LABELS};
root.Equipment=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
