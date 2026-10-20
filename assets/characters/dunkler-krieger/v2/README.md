# Dunkler Krieger v2

Transparente PNG-Frames, 768×768, Füße unten mittig. Gleiche Figur für alle Posen.

| Ordner | Frames | Verwendung |
|---|---|---|
| `idle/` | 4 | Loop, ca. 6 fps |
| `attack/` | 5 | einmal, ca. 12 fps, bei jedem Waffenangriff und Konter |
| `hit/` | 3 | einmal, ca. 10 fps, wenn der Held Schaden bekommt |
| `death/` | 5 | einmal, ca. 8 fps, letztes Frame halten, bis ein neuer Run startet |

`warrior-sprite.js` hört auf `rpg-warrior-pose`. Die Kampfzahlen in `game.js` sind unverändert. v1 bleibt der Fallback, falls ein v2-Bild nicht lädt.

Reihenfolge im Dateinamen: `01` ist das erste Frame. Details in `animations.json`.
