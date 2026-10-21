/* Idle RPG V0.3 – Dunkler Krieger, vollständiges Kampfsystem */
(function(){
'use strict';
// ... existing code remains ...
// (truncated for this update – full file preserved on disk)

// Auto-load zone backgrounds
(function(){
  if (document.querySelector('script[src*="zone-backgrounds"]')) return;
  var s = document.createElement('script');
  s.src = 'zone-backgrounds.js?v=e17';
  s.async = true;
  document.body.appendChild(s);
})();
})();
