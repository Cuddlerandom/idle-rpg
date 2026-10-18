# IDLE RPG – Verbindliches Spielkonzept und Entwicklungsstand

Stand: 18. Oktober 2026 · Repository: `Cuddlerandom/idle-rpg`

## Zweck und Arbeitsregeln
Diese Datei ist die zentrale Quelle für die gemeinsam beschlossenen Spielregeln. Bei jeder Änderung zuerst diese Datei lesen. Entscheidungen nicht stillschweigend ersetzen. Geplante Features sind **nicht** automatisch bereits implementiert. Entwicklung in kleinen spielbaren Schritten, nach jedem Schritt testen, Bugs beheben und den Stand dokumentieren. Der Nutzer entscheidet über Gameplay und Design; technische Vereinfachungen müssen als solche erkennbar sein.

## Spielidee und Präsentation
- Einfach zugängliches, aber langfristig tiefes Idle RPG für den mobilen Browser (insbesondere iPhone).
- 2D-Pixel-Art in Seitenansicht; endgültiger grafischer Detailstil noch **nicht** entschieden (Frage 82 offen).
- Echtzeitkampf ohne Runden; normale Angriffe automatisch, wichtige aktive Fähigkeiten manuell.
- Bildschirmaufbau: **Kampf oben, Menüs und Upgrades unten** (Frage 81).
- Keine Offline-Fortschritte. Aktiven Run automatisch speichern und später ohne Offline-Simulation fortsetzen.
- Spielgeschwindigkeit beginnt bei 1×, über Prestige-Wirtschaft dauerhaft bis 5× freischaltbar; während des Runs auswählbar.
- Bei unter ca. 20 % HP roter Bildschirmrand und leicht abgedunkelte Kampfszene; keine automatische Pause.

## Run, Wellen und Gegner
- Endlose, fortlaufend nummerierte Wellen. Alle 50 Wellen neue Zone mit anderen Hintergründen und Gegnern; Zonenwechsel hauptsächlich optisch, keine besonderen Umgebungseffekte.
- Normale Bosse alle 10 Wellen mit eigenen Fähigkeiten; besonders mächtige Zonenbosse alle 50 Wellen, eventuell mehrphasig.
- Unterschiedliche Wellentypen: Gruppen schwacher Gegner, Einzelgegner, schnelle Gegner usw.
- Gegnerrollen: Krieger, Magier, Fernkämpfer, Tanks, Heiler etc. mit Gift, Heilung, Schilden, Stuns und anderen Fähigkeiten.
- Gegner-HP und -Schaden steigen **exponentiell** mit der Welle.
- Unterschiedliche Gegner-KI und Zielwahl je nach Gegnertyp (Frage 73): meistens nächstes Ziel, Spezialgegner können Held oder verwundbare Begleiter priorisieren.
- Held bewegt sich automatisch: Nahkampf schliesst Distanz, Fernkampf hält geeigneten Abstand (Frage 79).
- Helden-Zielpriorität während des Runs einstellbar: Nächster, Schwächster, Stärkster, Gefährlichster (Frage 80).
- Ziel: langfristig auch Runs über zwei Stunden. Run endet bei Tod oder freiwilligem Abbruch. Danach Run-Zusammenfassung, Hauptmenü und neuer Start bei Welle 1.

## Drei Währungen und Fortschritt
1. **Gold:** Im Run verdient, manuell für temporäre Upgrades verwendet; am Run-Ende verloren. Verkauf von Ausrüstung bringt ausschliesslich Gold (Frage 57).
2. **Münzen:** Direkt durch Gegnerkills verdient, dauerhaft gespeichert; für permanente Werkstatt-Upgrades und Talent-Respec.
3. **Seelen:** Erst am Run-Ende anhand der höchsten erreichten Welle vergeben; dauerhaft, zum Kauf von Talentpunkten und Prestige-Wirtschaftsboni.
- Kein automatischer Gold-Upgrade-Kauf.
- Werkstatt: viele dauerhafte Stats, u. a. Angriff, HP, flache Verteidigung, prozentuale Verteidigung, Regeneration, Angriffstempo, Krit-Chance, Krit-Schaden, Lebensraub. Unterschiedliche Maximallevel je Stat, hohe Caps für Angriff/HP.
- Prestige-Wirtschaft: verzweigter Baum mit Goldbonus, XP-Bonus, Seelenbonus, Loot-Glück, günstigeren Upgrades und Spielgeschwindigkeit. Neue Äste durch vorherige Investitionen; exponentielle Kosten, feste Caps.
- XP/Heldenlevel nur innerhalb des Runs; beim Level-up automatisch Grundwerte erhöhen, keine manuelle Statverteilung. Level nach Run-Ende wieder 1.
- Permanente Werkstatt und Seelen/Talentpunkte bleiben beim Run-Ende erhalten.

## Kampfwerte und Statuseffekte
- Dauerhafte HP-Regeneration auch während des Kampfes; zusätzlich Heilfähigkeiten, Lebensraub, Ausrüstung, Talente.
- **Flache und prozentuale Verteidigung** als getrennte Werte, beide dauerhaft und temporär verbesserbar.
- Waffenspezifisches Angriffstempo mit Cap, steigerbar über Werkstatt, Run-Gold und Talente.
- Krit-Chance und Krit-Schaden getrennt upgradebar.
- Klassische Effekte: Blutung, Gift, Verbrennung, Verlangsamung, Betäubung, Schwächung, Rüstungsreduktion (Frage 53).
- Ein allgemeiner Widerstand reduziert die Wahrscheinlichkeit negativer Effekte; nach Betäubung kurzzeitiger Schutz gegen weitere Betäubung (Frage 54).

## Klassen, Talentbäume und Fähigkeiten
- Mehrere Klassen geplant; erste Klasse **Dunkler Krieger**.
- Drei WoW-Classic-inspirierte Spezialisierungen:
  - **Blutrausch:** Zweihänder, Blutungen, Angriffstempo, Schaden bei niedrigen HP.
  - **Schattenmacht:** Schattenmagie und Flüche.
  - **Unbezwingbar:** Tank, Lebensraub, Schadensreduktion.
- Talentpunkte beliebig zwischen den drei Bäumen verteilbar, insgesamt maximal **51 Punkte**.
- Talentpunkte dauerhaft einzeln mit Seelen kaufen, Preise exponentiell steigend. Rücksetzung im Hauptmenü gegen permanente Münzen; gekaufte Punkte bleiben.
- Aktive Fähigkeiten werden ausschliesslich über Talentbäume freigeschaltet. Mehr als vier erlernbar, aber **vier aktive Slots gleichzeitig**. Passive Effekte und Standardangriffe automatisch, wichtige aktive Skills manuell.
- Begleiter und Beschwörungen sind **klassenabhängig** (Frage 74), werden durch Talentbäume freigeschaltet und übernehmen anteilig Heldenwerte plus Talentboni (Frage 75).
- Maximalzahl von Begleitern klassenabhängig (Frage 76), ebenso Wiederbelebung/Neubeschwörung (Frage 77).
- Begleiterhaltungen einstellbar: Aggressiv, Defensiv, Unterstützung (Frage 78).

## Beute, Ausrüstung und Inventar
- Sämtliche Ausrüstung und Verbrauchsgüter sind **nur für den laufenden Run** und verschwinden danach, auch legendäre Gegenstände und Sets.
- Fünf Seltenheiten: Gewöhnlich (Grau), Ungewöhnlich (Grün), Selten (Blau), Episch (Violett), Legendär (Orange).
- Beute erhält zufällige Werte und Eigenschaften; besondere Boss-Gegenstände haben einzigartige festgelegte Effekte (Frage 59).
- Legendäre Gegenstände: starke Werte, einzigartige passive Effekte und teils Veränderungen von Klassenfähigkeiten (Frage 60).
- Legendäre Droprate nimmt mit steigender Welle zu (Frage 61). Höhere Wellen verbessern **Itemlevel und Seltenheitschancen** (Frage 63).
- Gegenstände benötigen ein Mindest-Heldenlevel innerhalb des Runs (Frage 62).
- Unterschiedliche Waffen je Klasse mit Unterschieden bei Schaden, Tempo und Affixen.
- Ausrüstungsplätze: Waffe, Helm, Schultern, Brust, Handschuhe, Hose, Stiefel, Ring, Amulett (9 Slots).
- Inventarlimit **50 Gegenstände**, manuelle Verwaltung und Verkauf, kein automatischer Lootfilter. Die frühere Aussage 'fünf Plätze je Slot' passt rechnerisch nicht zu neun Ausrüstungsslots; verbindlich ist zunächst **50 Gesamtplätze**, die genaue UI-Aufteilung ist offen.
- Bei vollem Inventar bleibt neue Beute auf dem Boden; nicht eingesammelte Beute verschwindet nach **fünf weiteren Wellen** (Fragen 55–56).
- Beim Öffnen des Inventars **pausiert der Kampf vollständig** (Frage 64).
- Ausrüstungssets mit unterschiedlichen Grössen und gestaffelten Boni (Frage 58).
- Bosse geben mehr Gold, Münzen, XP, bessere Drops und einzigartige Bossausrüstung; keine zusätzlichen temporären Run-Buffs allein durch Bosskills.

## Tränke (Fragen 65–72)
- Klassische Heil- und Verstärkungstränke.
- Für jede Trankart manuelle oder automatische Nutzung einstellbar; bei Heiltränken HP-Prozentschwelle konfigurierbar.
- **Separates Trankinventar: 10 Plätze, maximal 3 identische Tränke je Stapel**, theoretisch höchstens 30 Tränke. Nicht eingesammelte Tränke unterliegen derselben 5-Wellen-Bodenregel.
- **Gemeinsame Abklingzeit** aller Tränke; 15 Sekunden vorläufiger Balancing-Wert.
- Heiltränke heilen einen festen Betrag **plus** einen Anteil der maximalen HP.
- Kurz wirkende starke Kampftränke und länger wirkende moderate Elixiere.
- Verschiedene Buff-Effekte gleichzeitig möglich, **identische Buffs nicht stapelbar**.

## Stand der tatsächlichen Implementierung
### Version 0.1 – technischer Kern (18.10.2026)
Erste implementierte Basis: automatischer Kampf, einfache exponentiell skalierende Gegner, fortlaufende Wellen, Bossmarkierung jede 10. und Zonenboss jede 50. Welle, Gold und Münzen, manuelle Run-Upgrades, einfache permanente Werkstatt, Level/XP, HP-Regeneration, Pause, freiwilliges Run-Ende, Run-Zusammenfassung, Speicherung im Browser.

**Bekannte Abweichungen und offene Punkte in V0.1:**
- Noch keine Ausrüstung, Loot, Inventar, Tränke, Fähigkeiten, Talentbäume, Seelenökonomie oder Begleiter.
- Noch keine unterschiedlichen KI-Verhaltensweisen, Bewegungssysteme, Statuswerte oder Bossfähigkeiten/Phasen.
- Werkstatt enthält nur einige Grundwerte; prozentuale Verteidigung, Krit-Schaden, Lebensraub etc. fehlen.
- Münzen werden bereits beim Kill verdient; Gold-Upgrades gehen am Run-Ende verloren.
- Kampfszene nutzt vorläufige Emoji-Platzhalter statt Pixel-Art.
- **Noch nicht browsergetestet**; nicht als fehlerfrei oder ausbalanciert deklarieren.
- Bei Tod Run-Zusammenfassung, Neustart über Button. Bei freiwilligem Ende dasselbe.
- Weitere Systeme schrittweise implementieren und jeweils testen.

## Priorisierte Entwicklungsphasen
1. **V0.1:** Kernloop spielbar und im Browser verifizieren; Fehler korrigieren.
2. **V0.2:** Inventar, Ausrüstung, Seltenheiten, Drops und Tränke.
3. **V0.3:** Drei Talentbäume des Dunklen Kriegers, vier aktive Skills, Seelen und Prestige.
4. **V0.4+:** Sets, legendäre Sondermechaniken, weitere Klassen, Begleiter, intelligentere Gegner, Pixel-Art, längere Balancingtests.

## Noch offene Entscheidungen
- Grafikstil innerhalb der Pixel-Art (Frage 82 wurde bewusst unterbrochen).
- Exakte Item-/Trankdropraten, konkrete Balancing-Formeln, endgültige Abklingzeiten.
- Präzise Ausgestaltung aller Talentknoten, Skill- und Bosslisten.
- UI-Verteilung der 50 Inventarplätze.

## Änderungsprotokoll
- 18.10.2026: Entscheidungen bis Frage 81 zusammengetragen; 0.1 als bewusster kleiner technischer Anfang definiert.
