/* Zone-based combat backgrounds with injected styles. */
(function(){
  var css = document.createElement('style');
  css.textContent = [
    '#battleScene.zone-1 { background: radial-gradient(ellipse at 50% 110%, #2a3d28 0%, transparent 45%), linear-gradient(#0f1a14 0 60%, #2c3d2a 60% 72%, #141c12 72%); border-color: #4a6a4a; }',
    '#battleScene.zone-2 { background: radial-gradient(ellipse at 50% 110%, #3a2a20 0%, transparent 45%), linear-gradient(#1a1210 0 58%, #4a3428 58% 70%, #1c1410 70%); border-color: #8a5a3a; }',
    '#battleScene.zone-boss { box-shadow: inset 0 0 40px #8a2a2a66, inset 0 0 0 1px #4a1a1a; }'
  ].join('\n');
  document.head.appendChild(css);

  function update(){
    var scene = document.getElementById('battleScene');
    if (!scene) return;
    var waveEl = document.getElementById('wave');
    var text = waveEl ? waveEl.textContent : '';
    var m = text.match(/(\d+)/);
    var wave = m ? parseInt(m[1], 10) : 1;
    var zone = Math.floor((wave - 1) / 50) + 1;
    scene.classList.remove('zone-1','zone-2','zone-boss');
    scene.classList.add(zone >= 2 ? 'zone-2' : 'zone-1');
    if (wave % 50 === 0) scene.classList.add('zone-boss');
  }
  setInterval(update, 600);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();
