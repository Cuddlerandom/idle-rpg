# ⚔️ Dunkler Krieger V1.0 – Technische Übergabe für das Designstudio

**Stand:** 19.10.2026 · **Status:** Technische Arbeitsreferenz, **nicht** endgültige Designfreigabe  
**Repository:** `Cuddlerandom/idle-rpg`  
**Arbeitsbranch:** `feature/dunkler-krieger-v1-animation-preview` · [Pull Request #10](https://github.com/Cuddlerandom/idle-rpg/pull/10)  
**Verbindliche Projektregeln:** [GAME_DESIGN.md](../../../../GAME_DESIGN.md). **`main` bleibt ohne Freigabe des Nutzers unverändert.**

> **Wozu dieses Dokument dient:** Gemeinsame technische Grundlage für Design-Chat und Code-Chat. Es trennt **verifizierten Ist-Stand**, **Recherche aus Primärquellen**, **erkannte Fehler** und **Empfehlungen für die nächste Grafiklieferung**. Eine technische Empfehlung ist keine automatische Designfreigabe.

## 1. Verifizierter Ist-Stand des V1.0-Testpakets

| Eigenschaft | Befund |
|---|---|
| ZIP | `Dunkler_Krieger_V1_0_Testpaket(1).zip`, 56 Einträge |
| Einzelbilder | 40 echte transparente RGBA-PNGs |
| Quellformat **jedes** Einzelbilds | **448 × 672 px**, Seitenverhältnis **2:3** |
| Quell-Fussanker | **(224, 626)**, gemessen vom linken oberen Rand des 448×672-Frames |
| Original-Spritesheets | 6 PNG-Sheets; Frameraster und Einzelbilder geprüft |
| Mobil-Preview-Atlanten | WebP-basierte Data-URI-Atlanten in `warrior-atlases.js`; **128 × 192 px pro Frame** |
| Runtime-Fussanker | **(64, 179)**, proportional zum Quellanker |
| Technik | HTML/CSS + Canvas 2D + JavaScript, keine zusätzliche Engine |
| Darstellung | Sprite ersetzt visuell das Hero-Emoji; bei Bildfehlern Emoji-Fallback |
| Gameplay | `game.js`, `warrior-system.js`, `loot-system.js` unverändert; rein visueller Code im Branch |

Animationen gemäss `manifest.runtime.json`:

| ID | Frames | FPS | Dauer | Verhalten |
|---|---:|---:|---:|---|
| `idle` | 6 | 5 | 1,20 s | Wiederholen |
| `walk` | 8 | 9 | ~0,89 s | Wiederholen |
| `attack` | 8 | 11 | ~0,73 s | Einmal; dann Idle |
| `hit` | 4 | 8 | 0,50 s | Einmal; dann Idle |
| `death` | 6 | 7 | ~0,86 s | Einmal; letzten Frame halten |
| `special` | 8 | 10 | 0,80 s | Einmal; dann Idle |

**Wichtig:** FPS und Frameanzahl entsprechen dem *derzeit implementierten* Playback; es ist keine unabhängige künstlerische Freigabe der Bewegungsrhythmen. Original-PNGs bleiben im angelieferten ZIP unverändert; die mobilen WebP-Atlanten sind abgeleitete Laufzeitdateien, keine neu gezeichneten Ersatzbilder.

## 2. Recherche: Was der Browser beim Sprite-Code wirklich macht

### A. Spritesheet-Ausschnitt korrekt berechnen (MDN Canvas `drawImage`)

Bei einem horizontalen Atlas mit festem Frameraster muss der Quellausschnitt pro Frame exakt dessen Breite und Höhe verwenden:

~~~js
const frameW = 128, frameH = 192;
const sourceX = frameIndex * frameW;
ctx.drawImage(atlas, sourceX, 0, frameW, frameH, 0, 0, frameW, frameH);
~~~

Die Parameter `sx, sy, sWidth, sHeight` beschreiben die **Quellregion** im Bild; `dx, dy, dWidth, dHeight` das Ziel auf dem Canvas. Der komplette Atlas einer Animation mit N Frames muss im vorliegenden Layout genau **N × 128 px breit** und **192 px hoch** sein.

**Quelle:** [MDN – CanvasRenderingContext2D.drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage).

### B. Animation zeitbasiert, nicht nach Browser-Bildschirmframes (MDN `requestAnimationFrame`)

Die Bildwiederholrate kann je nach Display/Browser 60, 120 Hz oder anders ausfallen. Deshalb die Pose per Zeitstempel bestimmen, **nicht** jedes `requestAnimationFrame`-Callback als nächsten Spielframe zählen:

~~~js
const elapsedSeconds = (now - animationStart) / 1000;
const index = Math.floor(elapsedSeconds * fps) % frameCount; // für Loop-Animationen
~~~

`requestAnimationFrame` pausiert üblicherweise in versteckten Tabs. **Keine Offline-Fortschritte** daraus ableiten. Bei Zustandswechseln die Animationsuhr neu starten.

**Quelle:** [MDN – Window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).

### C. Pixelschärfe ist eine Frage von Canvas **und** CSS (MDN)

~~~js
ctx.imageSmoothingEnabled = false;
~~~

~~~css
canvas { image-rendering: pixelated; }
~~~

Damit verhindert man bewusstes Weichzeichnen. **Aber:** Wenn ein 128×192-Canvas auf **104×156 CSS-Pixel** verkleinert wird, ist der Faktor **0,8125** und somit **nicht ganzzahlig**. Die native CSS-Skalierung kann Kanten ungleichmässig abbilden, obwohl Smoothing deaktiviert ist. Auch das separate Vorschaufenster skaliert 128×192 auf 192×288 (**1,5×**). Eine sauber entworfene Zielgrösse und Pixelraster-Tests sind daher wichtig; `imageSmoothingEnabled=false` allein garantiert keine perfekten Einzelpixel auf jedem iPhone.

**Quellen:** [MDN – imageSmoothingEnabled](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled), [MDN – Crisp pixel art](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look).

### D. Aseprite/LibreSprite: exportierbare Arbeitsdatei + deterministischer Atlas

Das Designstudio sollte neben PNGs nach Möglichkeit **editierbare Quelldateien** bewahren. Aseprite unterstützt Animationstags, Frames mit separater Dauer, Export von Sprite-Sheets und JSON-Metadaten; mit Slices lassen sich **Pivot-/Ankerangaben** dokumentieren. Das Werkzeug ist nicht vorgeschrieben; entscheidend ist, dass die Exporte die Schnittstelle erfüllen.

Für unseren **aktuellen horizontalen Frame-Renderer** gilt:

- Alle Frames derselben Pose auf **identischer Canvasgrösse** exportieren, ohne wechselnden Zuschnitt.
- Export mit **echtem Alpha**, ohne Schachbrett-Hintergrund.
- Keine automatische Trimmung/`trim`, **solange** der Runtime-Renderer keine individuellen Trim-Offsets und Pivot-Informationen aus JSON anwendet.
- Eindeutige Namen (`attack_00.png`, `attack_01.png` ...), lückenlose Reihenfolge, dazu horizontales Sprite-Sheet und Manifest mit `frames`, `fps`, `loop`, `frameWidth`, `frameHeight`, `footAnchor`.
- Rotglühende Risse, Verfluchung, Dornenplatten, Umhang und Schwert dürfen an den Framekanten nicht abgeschnitten werden; bei Ausladungen **Canvas und Anker gemeinsam konsistent** anpassen statt einzelne Posen zurechtzustutzen.
- **Körper-/Kopf-/Fuss-Proportionen und Perspektive** müssen zwischen allen sechs Animationen übereinstimmen. Das Vergrössern eines kleinen Frames im Browser ersetzt keine konsistent gezeichnete Figur.

**Quellen:** [Aseprite – Sprite sheets](https://www.aseprite.org/docs/sprite-sheet/), [Tags](https://www.aseprite.org/docs/tags/), [Slices und Pivot](https://www.aseprite.org/docs/slices/), [Export/PNG-Sequenzen](https://www.aseprite.org/docs/exporting).

## 3. Konkret im aktuellen Branch entdeckt: Fehlersuche und offene Punkte

### 🔴 Bestätigter Codefehler in der **separaten** Animationsvorschau

`assets/characters/dunkler-krieger/v1/preview.html` hat aktuell die Zeile:

~~~js
cx.drawImage(im, n*64, 0, 64, 96, 0, 0, 128, 192);
~~~

**Das ist falsch für die 128×192-Atlasframes!** Sie liest abwechselnd halbe Framebreiten und halbe Framehöhen, vergrössert den Ausschnitt anschliessend und kann dadurch falsche bzw. abgeschnittene Posen zeigen. Korrekte Quellkoordinaten:

~~~js
cx.drawImage(im, n*128, 0, 128, 192, 0, 0, 128, 192);
~~~

Der **Spielrenderer** in `warrior-sprite.js` verwendet bereits die korrekte 128×192-Quellgeometrie. Dieser Befund wurde durch **statische Quellcodeprüfung** festgestellt. **Noch nicht in `preview.html` korrigiert**; der vorliegende Auftrag umfasst Dokumentation, keinen Eingriff in Spiellogik oder Live-Renderer. Bitte den Vorschau-Bug beheben und mit einem echten Bildvergleich jedes Frames nachprüfen, bevor auf Grundlage dieser Vorschau eine Designfreigabe erteilt wird.

### 🟠 iPhone-Rückmeldung: Grösse oder Position falsch

Der Nutzer sieht den Krieger im iPhone-Browsertest, hat aber **Bewertung B (Grösse/Position passt nicht)** gegeben. Welche Abweichung genau vorliegt, ist **noch nicht durch Screenshot/Pixelmass bestimmt**.

Aktuelles CSS in `index.html`:
- Kampfszene: **210 CSS-Pixel** hoch, `overflow:hidden`.
- `#heroActor` und `#heroSprite`: **104×156 px**; bei höchstens 350 px Viewportbreite **92×138 px**.
- Hero-Container: `transform:translateY(-14px)`; Figurenzeile: `bottom:26px`.
- Canvas-internes Raster: **128×192**. Der Fussanker ist nicht explizit in eine Weltkoordinate umgerechnet; die Darstellung folgt derzeit Container-Layout + CSS-Transform.
- Daraus können subjektiv zu hohe/zu niedrige oder zu kleine Darstellungen entstehen. **Nicht blind den gesamten Renderer skalieren oder den Fussanker ändern.** Erst einen Screenshot aus Safari samt sichtbarem Boden/Feind heranziehen; danach die gewünschte Endgrösse und Bodenkontaktposition festlegen und über alle Posen identisch testen.

### 🟠 Quellgrafik-Mängel (nicht durch CSS oder Canvas heilbar)

- Teile roter Schwert-/Slash-/Schatteneffekte sind bereits **innerhalb der Originalbilder** abgeschnitten, vor allem in `attack`/`special`; es fehlen Bilddaten.
- Die Ursprungsgrafiken wechseln teils Silhouette, scheinbare Körpergrösse und **3/4-Perspektive**. Der Fussanker fixiert nur die Position, er zeichnet keine fehlenden Zwischenposen.
- Für eine **offizielle Designreferenz** diese Frames im Designstudio überarbeiten; nicht durch unscharfe Skalierung, erzwungene Verzerrung oder erfundene Ersatzgrafiken verdecken.

### 🟡 Aktuelle Animationsanbindung ist ein Vorschau-Kompromiss

`warrior-sprite.js` beobachtet bestehende DOM-Texte per `MutationObserver` und leitet Attack/Hit/Walk/Death/Special aus HP-, Wellen- und Log-Änderungen ab. Dadurch bleibt das Gameplay unangetastet, aber ein HP-Wechsel beweist **nicht** eindeutig, welches Kampfereignis stattgefunden hat. Langfristig besser: **direkte Kampfereignisse** (`attack`, `hit`, `death`, `special`) an die reine Präsentationsschicht übergeben, mit Priorität **death > hit > special > attack > walk > idle**. **Noch kein Auftrag zur Änderung von `game.js`**; nur Architekturhinweis.

### 🔴 Nutzerkorrektur nach iPhone-Video: **Grösse stimmt; seitliches Abschneiden/Versetzen stört**

**19.10.2026 – verbindliches Nutzerfeedback:** Die aktuell sichtbare **Figurengrösse ist richtig und soll nicht verändert werden**. Das eigentliche Problem: Bei Animationen wird die Figur bzw. der Effekt **am Rand abgeschnitten und scheint auf die andere Seite versetzt**. Die bisherige Vermutung „Figur zu klein“ ist **verworfen**.

**Videobefund:** In den aufgezeichneten Kampfszenen bleibt der Held als Ganzes links in der Kampffläche; die auffälligen Sprünge betreffen die **Bildinhalte zwischen Animationsframes** und teilweise ausladende rote Schwert-/Schatteneffekte. Eine echte Teleportation der Spielposition ist **nicht nachgewiesen**. Der Renderer zeichnet für alle Posen ein fixes 128×192-Quellfenster; die Quellen enthalten bereits teilweise abgeschnittene VFX und unterschiedliche Silhouetten. Deshalb **nicht** auf Verdacht Kampfposition, Bewegung, Heldengrösse oder Game-Mechanik verändern.

**Auftrag an Designstudio/Code-Chat:**
1. **Frame-für-Frame** speziell `attack`, `special`, `walk` auf linkes/rechtes Abschneiden und scheinbaren Seitenwechsel prüfen (Quell-PNG → Sheet → WebP-Atlas → Spiel).
2. Gleichen Fussanker, Körpermittelpunkt und identische Canvasgrenzen für alle Posen prüfen. Wenn ein Schwertschwung mehr Platz benötigt, muss das **Designstudio** die Canvas der **gesamten Sequenz konsistent erweitern** und korrekt exportieren, nicht einzelne Frames verschieben oder umklappen.
3. Den bereits bestätigten `preview.html`-Quell-Crop-Bug separat korrigieren; dieser betrifft die isolierte Vorschau und darf nicht mit dem iPhone-Spielbefund verwechselt werden.
4. Danach dieselbe Szene auf echtem iPhone erneut vergleichen. **Figurengrösse unverändert lassen** und erst nach sichtbarem Beleg einen Renderereingriff vornehmen.

**Status:** Video als Sichtbeleg im Chat, nicht als Binärdatei im Repository hinterlegt. Ursache des scheinbaren Seitenwechsels noch nicht abschliessend bewiesen; keine Freigabe.

## 4. Einheitlicher Handoff an den Code-Chat für die nächste korrigierte Lieferung

Dem neuen ZIP bitte Folgendes beilegen:

1. **Originale PNG-Frames** aller sechs Zustände, echtes RGBA, einheitlicher Ausschnitt und durchgehende Perspektive; keine Dummy- oder Duplikatbilder.
2. **Sechs Sprite-Sheets** und ein Manifest, das zu den echten Blattabmessungen und Frame-Nummern passt; alle Ausladungen (Runenschwert, Dornenplatten, zerfetzter schwarzer Umhang, rote VFX) müssen innerhalb der Framegrenzen liegen.
3. Verbindliche **Fussanker- und Figuren-Bounding-Box** pro Pose; wenn neue Canvasmasse nötig sind, explizit dokumentieren und **alle** Animationen gemeinsam umstellen.
4. Originalformat separat vom **mobilen Runtime-Derivat** bewahren; keine Qualitätsverluste am Quellasset durch nochmaliges Skalieren oder WebP-Export.
5. Dokumentieren, welche Frames korrigiert wurden, und **Vorher/Nachher**-Referenzen für `idle`, `walk`, `attack`, `hit`, `death`, `special`.
6. **Gameplay unverändert** lassen: kein Schaden, keine Talente, Loot, Savegames, Spawnregeln oder Kampftiming an Spriteframes koppeln. Auf Feature-Branch arbeiten; erst nach Nutzerfreigabe Merge nach `main`.

**Freigabeprüfungen:**
- automatisiert: Frameanzahlen, Atlasgeometrie, Transparenz/Alpha, Namensschema, 0 fehlende Frames, Playback-Reihenfolge und unveränderte Gameplay-Dateien;
- **sichtbar:** jede Pose Frame für Frame gegen Quell-PNG und Sheet prüfen, nicht nur auf fehlerfreie JavaScript-Konsole vertrauen;
- **mobil:** 390×844-Simulation genügt nur als Vorprüfung; den tatsächlichen Abstand zum Boden, Anzeigegrösse, Attack-/Trefferwechsel und Flackern in **echtem iPhone Safari** prüfen;
- **Status:** Weiterhin Integrations-Preview, **keine offizielle V1.0-Designfreigabe** bis zu diesen Punkten.

## 5. Nachschlagestellen im GitHub-Branch

- `assets/characters/dunkler-krieger/v1/manifest.runtime.json` – gegenwärtige technische Zahlen und Animationen
- `assets/characters/dunkler-krieger/v1/QA.md` – ZIP- und Integritätsprüfung, bekannte Ausgangsmängel
- `assets/characters/dunkler-krieger/v1/preview.html` – separate Abspielvorschau (**bekannter Crop-Bug**, siehe oben)
- `assets/characters/dunkler-krieger/v1/warrior-atlases.js` – mobiles Laufzeitformat
- `warrior-sprite.js` – Canvas-Renderer und visuelle Zustandslogik
- `index.html` – Battle-Layout und CSS-Zielgrösse
- `tests/dark-warrior-sprites.test.cjs` und `.github/workflows/dark-warrior-preview.yml` – aktuelle automatische Prüfungen, die **Quell-Crop-Korrektheit der separaten Vorschau noch nicht testen**

**Übergabe an Design-Chat:** Diese Datei ist der gemeinsame technische Stand. Eigene Recherche oder neue Designentscheidungen bitte als Ergänzung mit Link und Testbeleg dokumentieren, statt widersprechende Frame-Anforderungen nur im Chat festzuhalten.
