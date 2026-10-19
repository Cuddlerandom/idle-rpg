/* Idle RPG V0.4 – run-only loot generation and equipment effects.
   Data and combat modifiers are deterministic given a supplied random function. */
(function(root){
'use strict';
const SLOT=[
 {id:'weapon',name:'Waffe',icon:'⚔️'},
 {id:'helm',name:'Helm',icon:'🪖'},
 {id:'shoulders',name:'Schultern',icon:'🦾'},
 {id:'chest',name:'Brust',icon:'🛡️'},
 {id:'gloves',name:'Handschuhe',icon:'🧤'},
 {id:'legs',name:'Hose',icon:'👖'},
 {id:'boots',name:'Stiefel',icon:'🥾'},
 {id:'ring',name:'Ring',icon:'💍'},
 {id:'amulet',name:'Amulett',icon:'📿'}
];
const SLOT_BY_ID=Object.fromEntries(SLOT.map(x=>[x.id,x]));
const RARITIES=[
 {id:'common',name:'Gewöhnlich',color:'#afb4b9',mult:1,affixes:1},
 {id:'uncommon',name:'Ungewöhnlich',color:'#69bb78',mult:1.25,affixes:2},
 {id:'rare',name:'Selten',color:'#72a9ff',mult:1.55,affixes:2},
 {id:'epic',name:'Episch',color:'#c68df9',mult:2.0,affixes:3},
 {id:'legendary',name:'Legendär',color:'#f5a957',mult:2.6,affixes:3}
];
const RARITY=Object.fromEntries(RARITIES.map(x=>[x.id,x]));
const BASE={
 weapon:['Verfluchtes Runenschwert','Sturmbrecher','Zweihänder der Nacht'],
 helm:['Verwitterter Ritterhelm','Dornenschädel','Helm des Jägers'],
 shoulders:['Dunkle Schulterplatten','Schulterpanzer des Wächters','Blutige Schulterplatten'],
 chest:['Schwarze Ritterrüstung','Panzer aus Grabstahl','Brustplatte des Vollstreckers'],
 gloves:['Eisenfäuste','Verwünschte Panzerhandschuhe','Handschuhe des Kämpfers'],
 legs:['Verfluchte Beinschienen','Wandererpanzer','Hose des Verfolgers'],
 boots:['Stahlstiefel','Schattenschritte','Stiefel der Vorhut'],
 ring:['Blutroter Siegelring','Geschwärzter Eisenring','Ring des Jägers'],
 amulet:['Amulett der Nacht','Verfluchtes Medaillon','Obsidiananhänger']
};
const STAT={
 atk:{name:'Angriff',unit:'flat'},
 hp:{name:'Leben',unit:'flat'},
 def:{name:'Rüstung',unit:'flat'},
 regen:{name:'Regeneration/s',unit:'decimal'},
 crit:{name:'Krit-Chance',unit:'percent'},
 speed:{name:'Angriffstempo',unit:'percent'},
 critDamage:{name:'Krit-Schaden',unit:'percent'},
 bleed:{name:'Blutungsschaden',unit:'percent'},
 shadow:{name:'Schattenschaden',unit:'percent'},
 lifeSteal:{name:'Lebensraub',unit:'percent'},
 hpPct:{name:'Max. Leben',unit:'percent'},
 reduction:{name:'Schadensreduktion',unit:'percent'}
};
const AFFIX=[
 {stat:'atk',slots:['weapon','gloves','ring','shoulders','amulet']},
 {stat:'hp',slots:['helm','shoulders','chest','legs','boots','ring','amulet']},
 {stat:'def',slots:['helm','shoulders','chest','gloves','legs','boots']},
 {stat:'regen',slots:['helm','chest','legs','amulet']},
 {stat:'crit',slots:['weapon','gloves','ring','amulet']},
 {stat:'speed',slots:['weapon','gloves','boots','ring']},
 {stat:'critDamage',slots:['weapon','gloves','ring','amulet']},
 {stat:'bleed',slots:['weapon','gloves','ring','amulet']},
 {stat:'shadow',slots:['weapon','helm','ring','amulet']},
 {stat:'lifeSteal',slots:['weapon','ring','amulet']},
 {stat:'hpPct',slots:['chest','legs','helm']},
 {stat:'reduction',slots:['chest','shoulders','legs']}
];
const UNIQUE=[
 {id:'bloodthirst',name:'Blutdurst',slot:'weapon',set:'Blutjäger',effect:'bloodbath',value:.30,description:'Blutbad verursacht 30 % mehr Schaden.'},
 {id:'slaughterer',name:'Rüstung des Schlächters',slot:'chest',set:'Blutjäger',effect:'bleed',value:.20,description:'20 % mehr Blutungsschaden.'},
 {id:'bloodhelm',name:'Blutjäger-Helm',slot:'helm',set:'Blutjäger',effect:'bleedChance',value:.08,description:'Normale Treffer: +8 Prozentpunkte Blutungschance.'},
 {id:'berserkergloves',name:'Handschuhe des Berserkers',slot:'gloves',set:'Blutjäger',effect:'speed',value:.12,description:'12 % Angriffstempo.'},
 {id:'damnation',name:'Klinge der Verdammnis',slot:'weapon',set:'Abgrund',effect:'shadow',value:.24,description:'24 % mehr Schattenschaden.'},
 {id:'lostsouls',name:'Amulett der verlorenen Seelen',slot:'amulet',set:'Abgrund',effect:'corruption',value:.15,description:'Verderbnis verstärkt eingehenden Schaden zusätzlich um 15 % ihres Bonuswertes.'},
 {id:'shadowhood',name:'Schattenkapuze',slot:'helm',set:'Abgrund',effect:'curseDuration',value:.25,description:'25 % längere gegnerische Schwächungen.'},
 {id:'abyssboots',name:'Stiefel des Abgrunds',slot:'boots',set:'Abgrund',effect:'shadow',value:.12,description:'12 % mehr Schattenschaden.'},
 {id:'immortalarmor',name:'Panzer des Unsterblichen',slot:'chest',set:'Bollwerk',effect:'hpPct',value:.16,description:'16 % maximales Leben.'},
 {id:'retribution',name:'Ring der Vergeltung',slot:'ring',set:'Bollwerk',effect:'counter',value:.30,description:'30 % mehr Gegenangriffsschaden.'},
 {id:'bulwarklegs',name:'Beinschienen des Bollwerks',slot:'legs',set:'Bollwerk',effect:'reduction',value:.08,description:'8 % weniger erlittener Schaden.'},
 {id:'steadfast',name:'Siegel der Standhaftigkeit',slot:'amulet',set:'Bollwerk',effect:'lifeSteal',value:.03,description:'3 % Lebensraub bei direkten Treffern.'}
];
const UNIQUE_BY_ID=Object.fromEntries(UNIQUE.map(x=>[x.id,x]));
const SET_BONUSES={
 Blutjäger:{count:2,stat:'bleed',value:.15,description:'2 Teile: +15 % Blutungsschaden.'},
 Abgrund:{count:2,stat:'shadow',value:.15,description:'2 Teile: +15 % Schattenschaden.'},
 Bollwerk:{count:2,stat:'reduction',value:.05,description:'2 Teile: −5 % erlittener Schaden.'}
};
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function one(items,random){return items[Math.floor(random()*items.length)]}
function emptyGear(){return Object.fromEntries(SLOT.map(s=>[s.id,null]))}
function emptyRun(){return {inventory:[],equipment:emptyGear(),ground:[],seq:0}}
function sanitizeItem(item){
 if(!item||typeof item!=='object'||!SLOT_BY_ID[item.slot]||!RARITY[item.rarity])return null;
 const affix=Array.isArray(item.affixes)?item.affixes.filter(a=>a&&STAT[a.stat]&&Number.isFinite(a.value)&&a.value>=0).slice(0,5).map(a=>({stat:a.stat,value:clamp(a.value,0,100000)})):[];
 return {id:String(item.id||''),slot:item.slot,name:String(item.name||'Gegenstand').slice(0,100),rarity:item.rarity,level:clamp(Math.floor(Number(item.level)||1),1,100000),required:clamp(Math.floor(Number(item.required)||1),1,100000),affixes:affix,unique:UNIQUE_BY_ID[item.unique]?item.unique:null,sell:clamp(Math.floor(Number(item.sell)||1),1,1e9)};
}
function repair(raw){
 const r=emptyRun();
 if(!raw||typeof raw!=='object')return r;
 const ids=new Set();
 const take=item=>{const s=sanitizeItem(item);if(!s||!s.id||ids.has(s.id))return null;ids.add(s.id);return s};
 if(Array.isArray(raw.inventory))for(const item of raw.inventory.slice(0,250)){const x=take(item);if(x&&r.inventory.length<50)r.inventory.push(x)}
 if(raw.equipment&&typeof raw.equipment==='object')for(const slot of SLOT){const x=take(raw.equipment[slot.id]);if(x&&x.slot===slot.id)r.equipment[slot.id]=x}
 if(Array.isArray(raw.ground))for(const entry of raw.ground.slice(0,300)){const x=take(entry&&entry.item);if(x){r.ground.push({item:x,dropWave:clamp(Math.floor(Number(entry.dropWave)||0),0,1000000)})}}
 r.seq=Math.max(0,Math.floor(Number(raw.seq)||0));
 return r;
}
function rarityFor(wave,boss,random){
 const boost=clamp((wave-1)/600,0,.25)+(boss?.10:0),n=random();
 if(n<.012+boost*.11)return 'legendary';
 if(n<.07+boost*.42)return 'epic';
 if(n<.25+boost*.9)return 'rare';
 if(n<.55+boost*.8)return 'uncommon';
 return 'common';
}
function attrValue(stat,wave,rarity,random){
 const r=RARITY[rarity],level=1+wave*.18;
 const variance=.8+random()*.4;
 const flat={atk:2+level*.6,hp:10+level*3,def:1+level*.25,regen:.2+level*.04};
 if(stat in flat)return stat==='regen'?Math.round(flat[stat]*r.mult*variance*100)/100:Math.max(1,Math.round(flat[stat]*r.mult*variance));
 const perc={crit:.012,speed:.02,critDamage:.04,bleed:.05,shadow:.05,lifeSteal:.012,hpPct:.035,reduction:.012};
 return Math.round((perc[stat]+wave*.000015)*r.mult*variance*1000)/1000;
}
function makeAffixes(slot,rarity,wave,random){
 const options=AFFIX.filter(x=>x.slots.includes(slot)).map(x=>x.stat),count=RARITY[rarity].affixes,chosen=[];
 for(let i=0;i<count&&options.length;i++){let j=Math.floor(random()*options.length),key=options.splice(j,1)[0];chosen.push({stat:key,value:attrValue(key,wave,rarity,random)})}
 return chosen;
}
function roll(options){
 const wave=Math.max(1,Math.floor(options.wave||1)),level=Math.max(1,Math.floor(options.level||1)),boss=!!options.boss;
 const random=typeof options.random==='function'?options.random:Math.random;
 const dropChance=clamp(.20+wave*.00065,0,.38);
 if(!boss&&random()>=dropChance)return null;
 const rarity=rarityFor(wave,boss,random),slot=one(SLOT,random).id;
 let chosenUnique=null;
 if(rarity==='legendary'&&random()<(boss?.7:.45)){chosenUnique=one(UNIQUE,random)}
 // Named uniques may use any of their nine valid item slots.
 const actualSlot=chosenUnique?chosenUnique.slot:slot;
 const itemLevel=Math.max(1,Math.floor(wave/2)+1);
 const required=Math.max(1,Math.floor(itemLevel/3)+1);
 const baseName=one(BASE[actualSlot],random),prefix=rarity==='epic'?'Erhabenes ':rarity==='rare'?'Seltenes ':rarity==='uncommon'?'Verstärktes ':'';
 return {id:'loot-'+Math.max(1,Math.floor(options.seq||1))+'-'+Math.floor(random()*1e9),
 slot:actualSlot,name:chosenUnique?chosenUnique.name:prefix+baseName,
 rarity,level:itemLevel,required,affixes:makeAffixes(actualSlot,rarity,wave,random),unique:chosenUnique?chosenUnique.id:null,
 sell:Math.max(1,Math.round((5+wave*1.8)*RARITY[rarity].mult*(chosenUnique?3:1)))};
}
function bonuses(equipment){
 const values={atk:0,hp:0,def:0,regen:0,crit:0,speed:0,critDamage:0,bleed:0,shadow:0,lifeSteal:0,hpPct:0,reduction:0,bloodbath:0,bleedChance:0,corruption:0,curseDuration:0,counter:0};
 const sets={};const activeSets=[];
 if(!equipment||typeof equipment!=='object')return {...values,sets:activeSets};
 for(const slot of SLOT){const item=equipment[slot.id];if(!item||item.slot!==slot.id)continue;
   for(const a of item.affixes||[]){if(a.stat in values&&Number.isFinite(a.value))values[a.stat]+=a.value}
   if(item.unique&&UNIQUE_BY_ID[item.unique]){
     const unique=UNIQUE_BY_ID[item.unique];if(unique.slot!==slot.id)continue;
     values[unique.effect]+=unique.value;sets[unique.set]=(sets[unique.set]||0)+1;
   }
 }
 for(const [set,count] of Object.entries(sets)){const bonus=SET_BONUSES[set];if(bonus&&count>=bonus.count){values[bonus.stat]+=bonus.value;activeSets.push({name:set,description:bonus.description})}}
 values.reduction=clamp(values.reduction,0,.65);values.lifeSteal=clamp(values.lifeSteal,0,.25);values.bleedChance=clamp(values.bleedChance,0,.2);
 return {...values,sets:activeSets};
}
function expireGround(run,currentWave){
 run.ground=run.ground.filter(entry=>currentWave<=entry.dropWave+5);
}
function award(run,wave,level,boss,random){
 const item=roll({wave,level,boss,random,seq:++run.seq});if(!item)return null;
 if(run.inventory.length<50)run.inventory.push(item);
 else run.ground.push({item,dropWave:wave});
 return item;
}
function formatAffix(a){
 const spec=STAT[a.stat];if(!spec)return '';
 if(spec.unit==='flat')return '+'+a.value+' '+spec.name;
 if(spec.unit==='decimal')return '+'+a.value.toFixed(2)+' '+spec.name;
 return '+'+(a.value*100).toFixed(1).replace(/\.0$/,'')+' % '+spec.name;
}
const api={slots:SLOT,rarities:RARITIES,rarity:RARITY,stat:STAT,uniques:UNIQUE,uniqueById:UNIQUE_BY_ID,sets:SET_BONUSES,emptyRun,repair,roll,bonuses,award,expireGround,formatAffix};
root.Loot=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
