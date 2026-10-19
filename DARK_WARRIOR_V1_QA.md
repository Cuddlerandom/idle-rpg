# Dunkler Krieger V1.0 – Integrationsstand (nicht freigegeben)

**Branch:** `feature/dark-warrior-v1-sprite-preview` – `main` bleibt unverändert.

## Bereits im Branch
- `dark-warrior-renderer.js`: ausschliesslich optische Sprite-Animation, keine Änderung an `game.js`, Savegame, Talenten oder Schaden.
- `index.html`: eigene Sprite-Ebene mit pixeliger, proportionaler iPhone-Skalierung; Emoji bleibt als Fallback erhalten.
- Animationen: idle 6×5 FPS, walk 8×9 FPS, attack 8×11 FPS, hit 4×8 FPS, death 6×7 FPS, special 8×10 FPS.
- Spritesheets erwartet unter `assets/characters/dark-warrior/v1/sheets/`.

## Noch blockiert
**Die 15-MB-PNG-Dateien des Nutzer-ZIPs sind NICHT auf GitHub hochgeladen.** Der verwendete GitHub-Connector schreibt Textdateien, kann die lokal vorliegenden binären PNGs jedoch nicht unmittelbar aus dem Sandbox-Dateisystem übernehmen. Deshalb ist die Darstellung auf GitHub Pages derzeit **noch nicht** als Sprite-Test spielbar: Es wird die bisherige Emoji-Darstellung gezeigt.

Die PNGs sind vollständig in `Dunkler_Krieger_V1_0_GitHub_Assets.zip` vorbereitet. Den Inhalt dieses Pakets im Repository-Root auf **diesem Branch** ablegen, nicht auf main.

## Geprüft
- ZIP: 40 Frames (448×672 RGBA), 6 Sheets und Metadaten vorhanden.
- Pixelweiser Vergleich: Alle 40 Einzelbilder stimmen exakt mit ihren Bereichen in den Spritesheets überein.
- Alle Frames besitzen Transparenz und einen gemeinsamen Anker (224, 626).
- Keine Alpha-Pixel an den äusseren Frame-Rändern; trotzdem sind einige **bereits im Quellmaterial abgeschnittene** rote Schwert-/Umhang-Effekte sichtbar. Das lässt sich nicht allein durch Padding reparieren.
- Die ursprüngliche Vorschau ist kein echter Gameplay-Test. Ein lokaler Browser-Test wurde versucht, jedoch vom Ausführungsumfeld blockiert. Ein iPhone-Test ist ebenfalls noch offen.

## Freigabekriterien
1. PNGs im Branch hochladen und GitHub Pages Vorschau tatsächlich laden.
2. iPhone Safari: Idle, Laufen, Angriff, Treffer, Tod, Spezialangriff und transparente Kanten prüfen.
3. Skalierungs-/Animationssprünge und abgeschnittene VFX gegebenenfalls mit neu exportierten Quellframes korrigieren.
4. Bestehende Spielmechaniken mit automatischen Regressionstests prüfen.
5. Erst nach ausdrücklicher Nutzerfreigabe ggf. nach main übernehmen.
