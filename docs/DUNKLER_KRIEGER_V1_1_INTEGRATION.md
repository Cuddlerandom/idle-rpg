# Dunkler Krieger V1.1 – Integration vorbereitet

Stand 19.10.2026. Vom Designstudio geliefertes ZIP `Dunkler_Krieger_V1_1_Korrekturpaket(2).zip` lokal geprüft: 40 RGBA-Frames (idle 6, walk 8, attack 8, hit 4, death 6, special 8), sechs 128×192 Spielatlanten und sechs 64×96 Vorschauatlanten. Abmessungen geprüft.

Die Original-Binärdateien sind **noch nicht in GitHub hochgeladen**. Ein lokales unverändertes Integrationspaket wurde vorbereitet, Zielpfad `assets/characters/dunkler-krieger/v1.1/`.

## Nächste Schritte
1. Original-PNGs aus Integrationspaket in diesen Branch laden; keine Platzhalter.
2. `warrior-atlases.js` auf echte V1.1-Spielatlanten umstellen (bestehende V1.0-Base64-Einbettung nicht versehentlich weiterverwenden).
3. Spiel-Renderer und `preview.html` gegen die jeweiligen Atlasabmessungen prüfen; Preview-Crop-Bug korrigieren.
4. Frame für Frame Rand-Cropping und Positionssprünge auf iPhone Safari prüfen.
5. CSS-Figurengrösse und Gameplay unverändert lassen. **Kein Merge nach main ohne Test und Freigabe.**

## Bekannte Grenze
Geometrisch korrigiert, nicht neu gezeichnet: Ursprünglich fehlende rote Effektteile bleiben unvollständig.
