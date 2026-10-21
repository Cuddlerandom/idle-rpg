/* Zone-based combat backgrounds. Loaded after the main game. */
(function(){
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
