/* Shared, class-neutral fantasy icon system. Visual only. */
(function(){
'use strict';
const paths={
swords:'<path d="M4 20 14 10M14 10l-3-3 6-5 5 5-5 6-3-3M2 17l5 5M20 20 10 10M10 10l3-3-6-5-5 5 5 6 3-3M22 17l-5 5"/>',
shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 6v12M8 10h8"/>',
tree:'<path d="M12 22v-7M12 15 6 9M12 15l6-6M6 9V4M18 9V4M4 4h4M16 4h4M9 22h6"/>',
hammer:'<path d="m14 7 3 3M4 20l10-10M11 4l4-2 7 7-4 4-7-7zM2 22l4-1"/>',
bag:'<path d="M5 8h14l2 13H3L5 8ZM9 8V6a3 3 0 0 1 6 0v2M9 13h6"/>',
book:'<path d="M12 5c-3-2-7-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 1ZM12 5v15"/>',
upgrade:'<path d="M12 20V4M6 10l6-6 6 6M4 20h16"/>',
chest:'<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 13h18M6 9V6a6 6 0 0 1 12 0v3M10 13v4h4v-4"/>',
scroll:'<path d="M7 3h12a3 3 0 0 1 0 6H7v11a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3h3ZM7 9h11v12H4M10 13h5M10 17h5"/>',
spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',
coin:'<circle cx="12" cy="12" r="9"/><path d="M9 9h5a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h5M12 6v12"/>',
soul:'<path d="M12 2 5 10l7 12 7-12-7-8ZM5 10h14M12 2v20"/>',
heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
pause:'<path d="M8 5v14M16 5v14"/>',
play:'<path d="m8 5 12 7-12 7V5Z"/>',
skull:'<path d="M4 12a8 8 0 1 1 16 0v5h-3v4h-3v-4h-4v4H7v-4H4v-5ZM9 12h1M14 12h1"/>'
};
const svg=name=>'<svg class="rpg-icon" viewBox="0 0 24 24" aria-hidden="true">'+(paths[name]||paths.spark)+'</svg>';
window.RPGIcon=svg;
function decorate(root){
 for(const el of root.querySelectorAll('[data-rpg-icon]')){const name=el.dataset.rpgIcon;if(el.dataset.iconReady===name)continue;el.innerHTML=svg(name);el.dataset.iconReady=name;}
}
function swapHome(){
 const home=document.getElementById('rpgHome');if(!home)return;
 const emblem=home.querySelector('.rpg-home-symbol');if(emblem&&!emblem.dataset.iconReady){emblem.innerHTML=svg('swords');emblem.dataset.iconReady='1'}
 const actions=home.querySelectorAll('.rpg-home-actions > *');
 for(const [i,name] of ['play','hammer','tree','book'].entries()){const el=actions[i];if(!el||el.dataset.iconReady)continue;el.innerHTML=svg(name)+' '+el.textContent.replace(/^[^\\p{L}\\p{N}]+/u,'');el.dataset.iconReady='1'}
}
decorate(document);swapHome();
})();
