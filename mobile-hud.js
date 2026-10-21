/* Mobile navigation layer; no combat/balance changes. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const main=document.querySelector('main'),battle=$('battle'),nav=document.querySelector('nav[aria-label="Spielnavigation"]');
if(!main||!battle||!nav)return;
document.body.classList.add('mobile-rpg');
const home=document.createElement('section');home.id='rpgHome';home.className='panel';home.innerHTML='<div class="rpg-home-symbol">⚔️</div><h2>Dunkler Krieger</h2><p>Bereite deinen nächsten Run vor.</p><div class="rpg-home-actions"><button type="button" id="rpgStart">▶ Run starten</button><button type="button" id="rpgWorkshop">🔨 Werkstatt & Prestige</button><a class="rpg-home-link" href="talentplaner.html">🌳 Talente & Spezialisierung</a><button type="button" id="rpgRules">📖 Spielregeln</button></div><p id="rpgHomeStats" class="muted"></p>';
main.insertBefore(home,battle);
const drawer=document.createElement('div');drawer.id='rpgDrawer';drawer.setAttribute('role','dialog');drawer.setAttribute('aria-label','Spielmenü');drawer.innerHTML='<div class="rpg-drawer-top"><strong id="rpgDrawerTitle">Menü</strong><button type="button" id="rpgClose" aria-label="Menü schliessen">✕ Schliessen</button></div><div id="rpgDrawerBody"></div>';
main.appendChild(drawer);
const content=$('rpgDrawerBody');
const sections=['run','shop','items','info'];
const originals={};
for(const id of sections){const el=$(id);originals[id]=el;content.appendChild(el);}
const heading=document.querySelector('.menu-heading');if(heading)heading.remove();
const labels={run:'Gold-Upgrades',shop:'Werkstatt & Prestige',items:'Inventar',info:'Spielregeln'};
let open=null,previousActive=null;
const read=()=>{try{return JSON.parse(localStorage.getItem('idle-rpg-core-v01')||'{}')}catch{return {}}};
function close(){open=null;drawer.classList.remove('open');document.body.classList.remove('rpg-drawer-open');}
function show(id){if(!sections.includes(id))return;open=id;for(const k of sections){originals[k].classList.toggle('hidden',k!==id);const btn=$('tab'+k[0].toUpperCase()+k.slice(1));if(btn)btn.classList.toggle('active',k===id);}if(id==='items'&&typeof window.tab==='function')window.tab('items');$('rpgDrawerTitle').textContent=labels[id];drawer.classList.add('open');document.body.classList.add('rpg-drawer-open');$('rpgDrawerBody').scrollTop=0;}
window.rpgShow=show;window.rpgClose=close;
for(const id of sections){const btn=$('tab'+id[0].toUpperCase()+id.slice(1));if(btn){btn.removeAttribute('onclick');btn.addEventListener('click',()=>show(id));}}
$('rpgClose').addEventListener('click',close);
$('rpgStart').addEventListener('click',()=>{close();window.startRun();sync();window.scrollTo(0,0);});
$('rpgWorkshop').addEventListener('click',()=>show('shop'));
$('rpgRules').addEventListener('click',()=>show('info'));
const originalTab=window.tab;
window.tab=function(id){if(typeof originalTab==='function')originalTab(id);if(sections.includes(id))showWithoutTab(id);};
function showWithoutTab(id){open=id;for(const k of sections)originals[k].classList.toggle('hidden',k!==id);$('rpgDrawerTitle').textContent=labels[id];drawer.classList.add('open');document.body.classList.add('rpg-drawer-open');}
function sync(){
 const data=read(),run=data.run||{},active=run.active!==false;
 if(active!==previousActive){previousActive=active;close();window.scrollTo(0,0);}
 document.body.classList.toggle('rpg-running',active);document.body.classList.toggle('rpg-home',!active);
 home.hidden=active;nav.hidden=!active;
 const end=$('runEnd');
 if(end&&!active&&!end.classList.contains('hidden')&&end.nextElementSibling!==home)home.before(end);
 $('rpgHomeStats').textContent='🪙 '+(data.coins||0)+' Münzen · Beste Welle: '+(data.best||1);
 const blessing=$('blessingPanel');if(blessing&&blessing.parentElement!==drawer&&active&&!blessing.classList.contains('hidden')){ /* blessing remains visible above battle */ }
}
const sort=$('rpgItemSort');if(sort)sort.addEventListener('change',()=>{const selected=document.querySelector('#inventoryGrid .loot-cell');if(typeof window.tab==='function')window.tab('items');});
const itemNote=$('items').querySelector('p.muted');if(itemNote)itemNote.textContent='Ausrüstung gilt nur für diesen Lauf. Solange die Beute offen ist, steht der Kampf.';
sync();setInterval(sync,350);
})();