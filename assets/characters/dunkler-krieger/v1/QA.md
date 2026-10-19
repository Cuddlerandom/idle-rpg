# ⚔️ Dunkler Krieger V1.0 – Sprite QA & Integration (Branch-Test)

**Status:** technischer Integrationskandidat; **keine endgültige Designfreigabe**.

## Lieferpaket überprüft
- `Dunkler_Krieger_V1_0_Testpaket(1).zip`: 56 Dateieinträge. ZIP-Lesbarkeit und Traversal-Namen geprüft.
- **40 PNG-Einzelframes**: 448×672 RGBA, sechs Animationen: Idle 6, Walk 8, Attack 8, Hit 4, Death 6, Special 8.
- **6 Original-PNG-Sheets** vollständig und Pixel für Pixel den Einzelbildern entsprechend.
- Zusätzlich sechs historische Quell-Animationsbögen, `master_character_reference.png`, `HANDOFF.md`, `manifest.json`, `preview.html`.
- Originaler Fussanker: (224, 626). Alpha korrekt (durchsichtige Bereiche wirklich alpha=0; Anti-Aliasing in sichtbaren Bereichen normal).
- Individuelle Frames haben keine fehlenden Indizes und keine identischen Duplikatdateien.

## Branch-Laufzeitgrafik
Die sechs WebP-Atlanten mit **allen 40 Frame-Motiven** sind als Base64 in `warrior-atlases.js` gebündelt. Für die mobile Renderer-Vorschau proportional auf **128×192 Pixel pro Frame** optimiert; der vollständige Originaldatensatz ist im angelieferten ZIP **unverändert**. Diese Atlanten sind *keine neuen Ersatzzeichnungen*, sondern verkleinerte Versionen der vom Designstudio gelieferten PNGs.

- Renderer nutzt nicht weichzeichnende Canvas-Koordinaten und 2:3-Seitenverhältnis.
- Anker im Runtime-Atlas: (64, 179).
- Idle und Walk loopen; Attack, Hit, Special kehren zu Idle zurück; Death stoppt am letzten Frame bis zum neuen Run.
- Animationssignale werden nur anhand bereits vorhandener Spiel-UI-Signale gelesen. **`game.js`, `warrior-system.js`, `loot-system.js` und alle Speicherstände bleiben unverändert.**
- Falls Bilddaten nicht laden: ursprüngliches 🛡️ als Fallback, Spiel bleibt bedienbar.

## Behebbare und nicht behebbare Probleme
- **Behandelt:** gleiches Canvasformat für alle sechs Sequenzen, fester Fussanker, mobiles nicht verzerrtes Skalieren, klare Animationsreihenfolge, verlässliche Standby-/Fallback-Anzeige, transparenter Hintergrund.
- **Restmangel:** Quellgrafiken schneiden rote Slash-VFX und Umhangpartien teils ab (besonders Attack/Special). Das lässt sich aus den gelieferten bereits getrennten PNGs **nicht originalgetreu rückgängig machen**. Statt VFX zu erfinden oder hart retuschieren, als offene Grafikstudio-Aufgabe vermerkt.
- **Restmangel:** 3/4-Perspektive und leichte Silhouetten-/Grössensprünge sind Merkmale der verschiedenen Ursprungsgrafiken. Browser-Stabilisierung ersetzt keine neu gestalteten Frames.
- **Restmangel:** Ein physisches iPhone wurde nicht getestet. Mobile Chromium-Emulation 390×844 mit Touch und iPhone-UA prüft Layout, Sichtbarkeit und Abläufe; abschliessender Test in iOS Safari bleibt offen.

## Freigabe-Kriterium
Für die **technische Preview** reichen bestandene Build-Tests, sechs abspielbare Animationen und unveränderte Gameplay-Dateien.
Für die **erste offizielle, endgültige Designreferenz** müssen das Grafikstudio die abgeschnittenen Bereiche korrigieren und die Ursprungsperspektive konsolidieren; anschliessend iPhone-Safari-Sichtprüfung.
