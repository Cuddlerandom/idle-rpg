# GROK – Projektübergabe / Einstieg ins Idle-RPG

Stand: 20.10.2026. Repository: https://github.com/Cuddlerandom/idle-rpg
Spielbarer iPhone-Build: https://cuddlerandom.github.io/idle-rpg/

## 1. Ziel des Spiels
Ein hochwertiges, langfristig motivierendes **2D-Idle-RPG für mobile Browser (besonders iPhone/Safari)**, mit düsterem Fantasy-Look, klar lesbaren Kämpfen, lebendigen Charakteranimationen und sinnvoller Langzeitprogression. Der Spieler startet Runs ab Welle 1, der Held kämpft weitgehend automatisch, sammelt temporäre Ressourcen und verbessert dauerhaft seine Entwicklung zwischen Runs. Geplant sind unterschiedliche Klassen, Gegnerrollen, Bosse, Zonen, Talente, Ausrüstung, Werkstatt und Prestige. Einsteigerfreundlich, aber mit strategischer Tiefe und wiederholbaren Runs. Der Spieler ist Game Director und entscheidet über Design und Gameplay.

Die **verbindlichen Spielentscheidungen** stehen in [GAME_DESIGN.md](../GAME_DESIGN.md) (bei widersprüchlichen älteren Abschnitten gilt dort die jeweils neueste ausdrücklich gekennzeichnete Entscheidung). Vor Änderungen immer lesen. Geplante Features sind nicht automatisch bereits implementiert.

## 2. Wie wir mit Replit / GitHub gearbeitet haben
Replit war Teil des bisherigen Workflows für browserbasierte Entwicklung und schnelle spielbare Prototypen. Die **aktuelle verbindliche Codebasis** liegt in diesem GitHub-Repository, nicht in einer möglicherweise älteren Replit-Kopie. Der aktuelle Stand wird über **GitHub Pages** bereitgestellt und auf dem **iPhone in Safari** praktisch getestet.

Ablauf: Idee/Änderung abstimmen → betroffene Dateien im Repository prüfen → kleine gezielte Änderung vornehmen → Commit mit nachvollziehbarer Beschreibung → GitHub-Pages-Link auf dem iPhone testen → Nutzerfeedback einholen → erst dann freigeben bzw. nächste Änderung. GitHub Pages: https://cuddlerandom.github.io/idle-rpg/ . Bei Cache-Problemen kann ein Versionsparameter an die URL gehängt werden (z. B. ?v=COMMIT).

**Wichtig:** Die genauen früheren Replit-Projekteinstellungen, URLs und Deploy-Konfigurationen sind hier nicht dokumentiert. Nicht annehmen, dass Replit aktuell die Produktionsversion hostet oder dass ein Replit-Projekt mit dem aktuellen GitHub-Stand synchron ist. GitHub ist die Source of Truth.

## 3. Technischer Einstieg
- `index.html`: mobile Spieloberfläche, Kampfbereich, HUD und CSS.
- `game.js`: Spiellogik / Run-Ablauf.
- `warrior-sprite.js`: Darstellung und Animation des Kriegers.
- `warrior-system.js`, `loot-system.js`, `mobile-hud.js`, `fantasy-icons.js`: weitere Systeme.
- `talentplaner.html`: Talentplaner.
- `assets/characters/dunkler-krieger/v1/`: bisheriger Krieger-Animationsbestand.
- `assets/ui/`: UI-Grafiken.
- `docs/DUNKLER_KRIEGER_DESIGN_TECHNIK.md`: bestehende technische/designbezogene Kriegerdokumentation.
- `tests/`: vorhandene Tests prüfen und bei relevanten Änderungen ausführen.

Die bisherige V6-Idle-Animation verwendet 32 RGBA-PNG-Frames (`frame_000.png` bis `frame_031.png`), 665 × 591 px, ungefähr 25 Animationsframes/Sekunde. Sie funktioniert als **Fallback** und darf nicht ohne Freigabe entfernt werden. Die vom Nutzer akzeptierte Größe und Position des Kriegers im Kampfbereich nicht ungefragt verändern.

## 4. Groks mögliche Aufgabe: Animationen
Der Nutzer hat mit Grok anhand eines Referenzbildes vielversprechende **Idle-, Attack-, Hit- und Death-Animationen** erstellt. Diese sollen als **Kandidaten** für den Dunklen Krieger geprüft werden. Nicht behaupten, dass sie bereits integriert oder technisch einsatzbereit sind.

Prüfen:
1. Gleiche Figur in allen Zuständen (Helm, Augen, Rüstung, Umhang, Schwert, Proportionen).
2. Echtes Alpha / transparenter Hintergrund, kein eingebranntes Schachbrett.
3. Format und Framerate, saubere Frames oder extrahierbare Bildsequenzen.
4. Stabile Standposition / Fuß-Ankerpunkt, keine Sprünge der Figur zwischen Frames.
5. Nahtloses Idle-Loop; vollständige Attack-, Hit- und Death-Sequenzen.
6. Speicherbedarf, Ladezeit und flüssige Darstellung auf iPhone/Safari.
7. Animationen erst isoliert testen; bestehende funktionierende Animation als Rückfalloption behalten.

Grok kann Animationen erzeugen; die technische Integration und Freigabe erfolgen separat. Nicht aus einem schönen Vorschauvideo automatisch auf kompatible Game-Assets schließen.

## 5. Unverhandelbare Arbeitsregeln
- **Gameplay und Balancing sind derzeit eingefroren.** Ohne ausdrückliche Freigabe keine Änderungen an Schaden, HP-Formeln, Gegnerwerten, Wellen, Seelen, Gold, Kosten, Item-Stats, Talenten oder Mechaniken.
- Bestehende funktionierende Systeme nicht durch vereinfachte Platzhalter ersetzen.
- Keine ungefragten Änderungen am freigegebenen Krieger-Layout, FPS-Monitor oder aktuellen HUD.
- Kleine, überprüfbare Commits; vor Änderungen Projektdateien und aktuellen Branch lesen.
- **Keine direkten Änderungen an `main` ohne ausdrückliche Freigabe des Nutzers.** Für experimentelle Animationen einen separaten Branch nutzen.
- Keine Merges ohne Freigabe.
- Keine Aussagen wie „funktioniert garantiert“, bevor der echte Browser-Test erfolgt ist.
- Dem Nutzer konkrete Dateipfade, Commit-Link, Testlink und etwaige bekannte Einschränkungen melden.

## 6. Visuelle Richtung
Düsteres, hochwertiges Fantasy-Design: verwitterter schwarzer Ritterpanzer, verfluchte Dornen-Schulterplatten, geschlossener Helm mit roten Augen, schwarzer zerfetzter Umhang, massive schwarze Runen-Zweihandklinge und blutrote Akzente. HUD-Stil: geschmiedetes dunkles Eisen, gealterte Bronze, dunkles Rot. Ziel sind konsistente, tatsächlich spielbare Assets statt nur attraktiver Konzeptbilder.

**Aktueller HUD-Kontext:** Die Helden-HP-Anzeige ist als kleiner verzierter Rahmen links oben *innerhalb* der Kampfszene vorgesehen; kein unnötiger Namensschriftzug, dynamische HP-Zahlen müssen mittig im Balken stehen. Details immer am aktuellen Repository-Stand prüfen.

## 7. Wie Grok anfangen sollte
1. `GAME_DESIGN.md`, `docs/DUNKLER_KRIEGER_DESIGN_TECHNIK.md`, `index.html` und `warrior-sprite.js` lesen.
2. Den aktuellen Live-Build auf dem iPhone-Browser als Zielumgebung verstehen.
3. Den Nutzer nach den **tatsächlichen exportierten Animationsdateien** fragen, falls sie noch nicht im Repo liegen.
4. Asset-Qualität und Integrationseignung beurteilen, ohne das Balancing oder Gameplay zu verändern.
5. Erst nach Nutzerfreigabe auf separatem Branch integrieren, testen und mit nachvollziehbarem Commit übergeben.

**Priorität:** Qualität, visuelle Konsistenz, flüssige mobile Performance, Rückbaubarkeit und Nutzerfreigabe.
