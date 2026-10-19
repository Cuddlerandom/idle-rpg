# ⚔️ Dunkler Krieger – Technische Übergabe an Designstudio und Entwickler
Stand: 19.10.2026 · Status: **V1.0 Testintegration, NICHT final freigegeben**

> Diese Datei dient als gemeinsame Referenz für Designchat, Animationsstudio und GitHub-Integration. Sie dokumentiert nachprüfbare Codeentscheidungen und Testergebnisse. Externe Web-Recherche aus anderen Chats ist hier nicht als verifizierte Quelle ausgegeben; zusätzliche Erkenntnisse des Designchats bitte mit Quelle/URL und Datum ergänzen.

## Wo die Umsetzung liegt

- Repository: `Cuddlerandom/idle-rpg`
- **Arbeitsbranch:** `feature/dunkler-krieger-v1-animation-preview`
- PR: https://github.com/Cuddlerandom/idle-rpg/pull/10
- **`main` darf ohne ausdrückliche Freigabe des Game Directors nicht geändert oder gemergt werden.**
- Spielvorschau (externer GitHub-Proxy, Erreichbarkeit nicht garantiert): https://raw.githack.com/Cuddlerandom/idle-rpg/ef2b006f3e05e674353b55649127d16d16b6bd68/index.html
- Animationsvorschau: `assets/characters/dunkler-krieger/v1/preview.html`
- Spielanbindung: `warrior-sprite.js`; HTML-Einbindung und Position: `index.html`
- Atlanten: `assets/characters/dunkler-krieger/v1/warrior-atlases.js`
- Verbindliche Spielregeln: `GAME_DESIGN.md`

## Ausgangsmaterial und QA

ZIP: `Dunkler_Krieger_V1_0_Testpaket(1).zip` (vom Nutzer bereitgestellt).
Sechs Animationen mit insgesamt **40 transparenten PNG-Einzelframes**:
- Idle: 6 Frames bei 5 FPS, Endlosschleife
- Walk: 8 Frames bei 9 FPS, Endlosschleife
- Attack: 8 Frames bei 11 FPS, einmalig
- Hit: 4 Frames bei 8 FPS, einmalig
- Death: 6 Frames bei 7 FPS, bleibt auf letztem Frame stehen
- Special: 8 Frames bei 10 FPS, einmalig

Die Ausgangsframes wurden als 448 × 672 Pixel geprüft. Die mobile Darstellung nutzt aufbereitete WebP-Atlanten; im eigentlichen Spiel sind die Atlasframes **128 × 192 Pixel**. Die Originalgrafiken sollen **nicht** überschrieben werden. Im separaten Preview-HTML werden 64 × 96 Atlasquellen auf eine 128 × 192 Canvas gezeichnet – diese Vorschau hat also eine **andere Quellframegrösse** als der Spielrenderer. Beim Übertragen von Code nicht versehentlich die beiden Formate mischen.

Prüfstand: PNG-Transparenz und Frame-Anzahl kontrolliert; Animationen in einer Chromium-Simulation mit 390 px Viewport getestet; keine JS-Fehler oder horizontales Überlaufen in diesem Test. **Das ist kein physischer iPhone-Safari-Test.** Der Nutzer bestätigt, dass der Krieger im Spiel sichtbar ist, meldet aber **Problem B: Grösse oder Position stimmt nicht**. Ob nur Skalierung oder auch Position betroffen ist, muss noch anhand eines Screenshots eingegrenzt werden.

## Aktuelle Rendering-Implementierung

`index.html`:
- `#heroActor`: CSS-Box 104 × 156 px, `transform: translateY(-14px)`.
- `#heroSprite`: Canvas intern 128 × 192 Pixel; CSS-Darstellung 104 × 156 px; `image-rendering: pixelated`.
- Bei Viewport unter 350 px: Hero-Box und Canvas 92 × 138 px.
- `#heroFallback`: Emoji, bis der Idle-Atlas geladen ist.
- Alle Änderungen am Layout müssen auf dem **Feature-Branch** erfolgen.

`warrior-sprite.js`:
- Canvas 2D mit `{alpha:true}`, `ctx.imageSmoothingEnabled=false` für scharfe Pixelkanten.
- Frames werden per `requestAnimationFrame` zeitgesteuert gezeichnet, mit `drawImage(image, frameIndex*128, 0, 128, 192, 0, 0, 128, 192)`.
- Atlasdimensionen werden gegen `frames*128 × 192` geprüft. Fehler erscheinen als Warnung; der Fallback bleibt bis zum geladenen Idle-Bild sichtbar.
- Animationen werden aus DOM-Änderungen von Welle, Gegner-HP, Helden-HP und Kampflog erkannt (`MutationObserver`); **keine Änderung der eigentlichen Kampfberechnung**.
- Priorität: Death > Hit > Special > Attack > Walk > Idle; kurze Animationssperre verhindert vorzeitiges Überschreiben wichtiger Animationen.
- `prefers-reduced-motion` stoppt wiederholte Bewegung bei Idle/Walk.
- Debug-Schnittstelle im Browser: `window.DarkWarriorSprite.inspect()` liefert `animation`, `ready`, `errors`, `frame`, `dead`. `window.DarkWarriorSprite.play('walk')` usw. kann zum manuellen Animationscheck verwendet werden.
- Der Renderer meldet als geplanten Fussanker **(64, 179)** innerhalb eines 128 × 192 Frames; dieser ist derzeit eine Metadatenangabe und **keine automatische optische Ausrichtung**. Der sichtbare Körper und die Schatten-/Schwerteffekte können sich von Frame zu Frame verschieben.

## Bekannte Probleme – Aufgaben für Designstudio

1. **Sichtbare Grösse/Position auf iPhone ist noch nicht akzeptiert.** Screenshot aus der laufenden Spielszene anfordern. Der Krieger soll mit seinen Füssen auf der Spielfläche stehen und proportional zum Gegner/der Szene sein. Nicht blind nur `width` erhöhen.
2. **Grössensprünge einzelner Frames:** Alle Posen mit identischem Fussanker, konsistenter Körperhöhe und identischer Bildmitte exportieren. Pro Frame Alpha-Bounding-Box und Fussposition vergleichen; unterschiedliche Ausladung des Schwerts ist erlaubt, Springen des Körpers nicht.
3. **Abgeschnittene rote Schwert-/Schatteneffekte** kommen teilweise schon aus der Quelle. Im Designstudio nachzeichnen bzw. mit mehr sicherem transparentem Rand neu exportieren; simples CSS-Skalieren kann verlorene Pixel nicht zurückholen.
4. **Transparenz:** echte RGBA-Alpha-Kanäle, kein eingebranntes Schachbrett, keine farbigen Ränder; besonders Kanten bei 2×/3× Nearest-Neighbour-Skalierung prüfen.
5. **Unterschiedliche Atlasformate:** Spiel: 128 × 192 pro Frame; separate Preview: 64 × 96 Quellframes. Exportmanifest muss eindeutige `frameWidth`, `frameHeight`, `frames`, `fps`, `anchor` je Animation enthalten. Keine falschen `drawImage`-Offsets.
6. **iPhone/Safari:** 390 px sowie schmale Viewports testen, Hochformat, laufenden Kampf, Wechsel zwischen Idle/Walk/Attack/Hit/Special/Death, Geräte-Pixelratio und Rückkehr nach Tabwechsel. Erst ein echter Safari-Test bestätigt das Gerät.

## Empfohlene Korrekturfolge (ohne Gameplay-Änderungen)

1. Nutzer-Screenshot aus iPhone-Spiel entgegennehmen; Zielgrösse und Bodenlinie festlegen.
2. CSS-`#heroActor` und `#heroSprite` nur im Feature-Branch anpassen; bei Bedarf **einen** gemeinsamen Layoutparameter für Breite, Höhe und vertikalen Versatz verwenden. CSS-Darstellung und Canvas-Auflösung bewusst getrennt halten.
3. In allen 40 Originalframes Fussanker, Bounding-Box, Körperhöhe und Effektränder vergleichen; Fehler in den Quellen korrigieren, nicht durch wechselnde CSS-Offsets je Animation kaschieren.
4. Atlanten verlustarm neu erzeugen; Dimensionen, Frame-Reihenfolge und Alpha erneut prüfen. Keine künstlichen Platzhaltergrafiken.
5. Animationen und bestehende Tests erneut ausführen; Spielmechanik-Datei `game.js` mit `main` vergleichen und unverändert lassen.
6. Echten iPhone-Testlink vom Branch bereitstellen und Nutzerfreigabe einholen. **Kein Merge auf `main` ohne ausdrückliches OK.**

## Austausch mit dem Designchat

Der Designchat kann diese Datei im GitHub-Branch als technische Grundlage lesen und seine eigenen Rechercheergebnisse ergänzen: **konkrete Quellen-URL, Browser-/Safari-Version, technische Aussage, reproduzierbarer Test, Auswirkung auf Export/Renderer**. Nicht belegte Tipps bitte als Hypothese markieren. Designfreigabe und Codefreigabe sind getrennte Schritte.
