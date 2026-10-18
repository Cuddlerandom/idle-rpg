# IDLE RPG – Verbindliches Spielkonzept und Entwicklungsstand

Stand: 18. Oktober 2026 · Repository: `Cuddlerandom/idle-rpg`

## Zweck und Arbeitsregeln
Diese Datei ist die zentrale Quelle für die gemeinsam beschlossenen Spielregeln. Bei jeder Änderung zuerst diese Datei lesen. Entscheidungen nicht stillschweigend ersetzen. Geplante Features sind **nicht** automatisch bereits implementiert. Entwicklung in kleinen spielbaren Schritten, nach jedem Schritt testen, Bugs beheben und den Stand dokumentieren. Der Nutzer entscheidet über Gameplay und Design; technische Vereinfachungen müssen als solche erkennbar sein.

## Spielidee und Präsentation
- Einfach zugängliches, aber langfristig tiefes Idle RPG für den mobilen Browser (insbesondere iPhone).
- **Moderne 2D-Pixel-Art** in Seitenansicht mit detaillierten Charakteren, flüssigen Animationen und stimmungsvollen Effekten (Frage 82).
- Echtzeitkampf ohne Runden; normale Angriffe automatisch, wichtige aktive Fähigkeiten manuell.
- Bildschirmaufbau: **Kampf oben, Menüs und Upgrades unten** (Frage 81).
- Keine Offline-Fortschritte. Aktiven Run automatisch speichern und später ohne Offline-Simulation fortsetzen.
- Spielgeschwindigkeit beginnt bei 1×, über Prestige-Wirtschaft dauerhaft bis 5× freischaltbar; während des Runs auswählbar.
- Bei unter ca. 20 % HP roter Bildschirmrand und leicht abgedunkelte Kampfszene; keine automatische Pause.

## Run, Wellen und Gegner
- Endlose, fortlaufend nummerierte Wellen. Alle 50 Wellen eine neue Zone mit eigenem Hintergrund, **eigenen Gegnertypen und Fähigkeiten sowie einzigartigem Zonenboss** (Frage 83). Keine verpflichtenden Umgebungsschäden oder vollständig neuen Zonenregeln.
- Normale Bosse alle 10 Wellen mit eigenen Fähigkeiten; besonders mächtige Zonenbosse alle 50 Wellen. **Verbindlich: Auf Welle 50, 100, 150 usw. ersetzt der Zonenboss den normalen Boss; es erscheint genau ein Boss (Schritt 1, Nutzerentscheidung A).** **Unterschiedliche Bossmechaniken** je nach Gegner: erkennbare Angriffsmuster, Phasenwechsel, Beschwörungen, Schilde und Spezialfähigkeiten. Nicht jeder Boss braucht jede Mechanik (Frage 84).
- Unterschiedliche Wellentypen: Gruppen schwacher Gegner, Einzelgegner, schnelle Gegner usw.
- Gegnerrollen: Krieger, Magier, Fernkämpfer, Tanks, Heiler etc. mit Gift, Heilung, Schilden, Stuns und anderen Fähigkeiten.
- Gegner-HP und -Schaden steigen **exponentiell** mit der Welle. Schwierigkeit kombiniert kontinuierliche Skalierung, spürbare Bosshürden alle 10 Wellen und zusätzliche Sprünge bei neuen Gebieten alle 50 Wellen (Frage 87). Frühe Bosse müssen mit vernünftigen Upgrades erreichbar sein; Fairness und Fortschrittsgefühl gehen vor übertriebener Härte.
- Unterschiedliche Gegner-KI und Zielwahl je nach Gegnertyp (Frage 73): meistens nächstes Ziel, Spezialgegner können Held oder verwundbare Begleiter priorisieren.
- Held bewegt sich automatisch: Nahkampf schliesst Distanz, Fernkampf hält geeigneten Abstand (Frage 79).
- Helden-Zielpriorität während des Runs einstellbar: Nächster, Schwächster, Stärkster, Gefährlichster (Frage 80).
- Ziel: langfristig auch Runs über zwei Stunden. Run endet bei Tod oder freiwilligem Abbruch. Danach Run-Zusammenfassung, Hauptmenü und neuer Start bei Welle 1.

## Drei Währungsebenen und Fortschritt (Klassenökonomie)
1. **Gold – Run-Währung:** Im Run verdient, manuell für temporäre Upgrades verwendet; beim Ende des Runs vollständig zurückgesetzt. Verkauf von Ausrüstung bringt Gold.
2. **Münzen – accountweite permanente Währung:** Bleiben dauerhaft erhalten und kaufen allgemeine Verbesserungen, die für alle Helden gelten (globale Werkstatt/Prestige). Sie dürfen nicht an eine einzelne Klasse gebunden sein.
3. **Klassenseelen – separate Währung je Klasse:** Jede Klasse hat einen eigenen Seelenvorrat. Klassenseelen werden beim Run-Ende anhand der höchsten erreichten Welle vergeben, erstmals ab Welle 5, und dienen der Entwicklung dieser Klasse: sowohl für Talentpunkte als auch für einen eigenen permanenten klassenbezogenen Prestige-Baum, der nur Klassenmechaniken verändert und keine allgemeinen Grundwerte erhöht. Er bietet sowohl Verstärkungen bestehender Mechaniken als auch neue Varianten. Der Baum hat einen gemeinsamen Hauptpfad und danach drei Spezialisierungszweige, verbundene Talentknoten, sichtbare Freischaltpfade und Voraussetzungen für tiefere Talente – angelehnt an WoW Classic. Misch-Builds sind erlaubt; tiefe Schlüsselmechaniken konkurrieren um die begrenzten Punkte, sodass man nicht alle Endtalente mehrerer Zweige zugleich erreichen kann. Seelen einer Klasse können nicht für eine andere Klasse ausgegeben werden.

**Klassen-Prestige: Kosten und Begrenzung (verbindlich):** Normale Knoten/Ränge haben feste Klassenseelenkosten; tiefe Schlüsselmechaniken und ihre besonderen Verstärkungen kosten deutlich mehr. **Pro Klasse gibt es ein festes Limit an verteilbaren Klassen-Prestige-Punkten (Option A).** Die drei Zweige dürfen kombiniert werden, können wegen des Limits aber nicht alle vollständig ausgebaut werden. Das genaue Limit ist noch offen und wird nicht automatisch mit den 51 normalen Talentpunkten gleichgesetzt. **Klassenseelen sind die Kaufwährung; die Punktbegrenzung ist eine zusätzliche Build-Grenze.**

**Verbindliche Währungsentscheidung:** Gold = temporärer Run-Fortschritt; Münzen = permanente, klassenübergreifende Verbesserungen; Klassenseelen = permanente Entwicklung der jeweiligen Klasse. Dies ersetzt die frühere Annahme, dass dieselbe Seelenwährung gleichzeitig Talentpunkte und einen gemeinsamen Prestige-Baum finanziert. **Verbindlich entschieden:** Klassenseelen finanzieren sowohl Talentpunkte als auch einen separaten permanenten Prestige-Baum für die jeweilige Klasse. **Der klassenbezogene Prestige-Baum verbessert ausschliesslich klassenspezifische Mechaniken, nicht allgemeine Grundwerte** (Nutzerentscheidung). Die Klassenseelen einer Klasse bleiben von allen anderen Klassen getrennt. Die genaue Aufteilung der Kosten und die Seelenformel sind noch offen.
- **Belohnungsskalierung (Frage 88):** Gold, Münzen und XP steigen mit jeder Welle; Bosse geben Extra-Belohnungen, neue Gebiete bringen zusätzliche Belohnungssprünge. Klassenseelen bleiben ausschliesslich Run-Ende-Belohnung und werden dem aktiven Helden zugeordnet. **Verbindliche Klassenseelen-Formel (18.10.2026, Option B):** Beim Run-Ende zählt die höchste erreichte Welle `w`. Für `w < 5` gibt es **0 Klassenseelen**; ab Welle 5 erhält die aktive Klasse `floor((w / 5)^1.5)` Klassenseelen. Der Exponent **1,5** sorgt für überproportionales Wachstum. Beispiele: Welle 5 → 1, Welle 10 → 2, Welle 20 → 8, Welle 50 → 31, Welle 100 → 89. Die Formel gilt pro Run, nicht als einmalige Rekordprämie. **Wiederholbare Belohnung (Nutzerentscheidung A): Jeder abgeschlossene Run erhält unabhängig von früheren Runs oder persönlichen Wellenrekorden die volle nach dieser Formel berechnete Klassenseelen-Belohnung.** Beispiel: Jeder Run bis Welle 50 vergibt erneut 31 Klassenseelen; es gibt weder eine Kürzung bei Wiederholungen noch einen zusätzlichen Rekordbonus.
- Kein automatischer Gold-Upgrade-Kauf.
- Werkstatt: viele dauerhafte Stats, u. a. Angriff, HP, flache Verteidigung, prozentuale Verteidigung, Regeneration, Angriffstempo, Krit-Chance, Krit-Schaden, Lebensraub. Unterschiedliche Maximallevel je Stat, hohe Caps für Angriff/HP.
- Prestige-Wirtschaft: verzweigter Baum mit Goldbonus, XP-Bonus, Seelenbonus, Loot-Glück, günstigeren Upgrades, **Erhöhung des Caps für prozentuale Verteidigung (Schritt 3)** und Spielgeschwindigkeit. Neue Äste durch vorherige Investitionen; exponentielle Kosten, feste Caps.
- XP/Heldenlevel nur innerhalb des Runs; beim Level-up automatisch Grundwerte erhöhen, keine manuelle Statverteilung. Level nach Run-Ende wieder 1.
- Permanente Werkstatt und Seelen/Talentpunkte bleiben beim Run-Ende erhalten.

## Kampfwerte und Statuseffekte
- Dauerhafte HP-Regeneration auch während des Kampfes; zusätzlich Heilfähigkeiten, Lebensraub, Ausrüstung, Talente.
- **Flache und prozentuale Verteidigung** als getrennte Werte, beide dauerhaft und temporär verbesserbar. **Verbindlich (Schritt 3): Prozentuale Verteidigung besitzt ein anfangs niedriges hartes Maximum, das über dauerhafte Prestige-Upgrades erhöht werden kann.** Das Maximum bleibt stets unter 100 %; keine unbegrenzte Schadensimmunität. Konkretes Start-Cap, Prestige-Stufen und End-Cap werden im Balancing festgelegt. Flache Verteidigung bleibt unabhängig.
- Waffenspezifisches Angriffstempo mit Cap, steigerbar über Werkstatt, Run-Gold und Talente.
- Krit-Chance und Krit-Schaden getrennt upgradebar.
- Klassische Effekte: Blutung, Gift, Verbrennung, Verlangsamung, Betäubung, Schwächung, Rüstungsreduktion (Frage 53).
- Ein allgemeiner Widerstand reduziert die Wahrscheinlichkeit negativer Effekte; nach Betäubung kurzzeitiger Schutz gegen weitere Betäubung (Frage 54).

**Aktuelle Vereinfachungsentscheidung (18.10.2026):** Pro Klasse gibt es **nur einen grossen WoW-Classic-inspirierten Talentbaum**, nicht zwei parallele Talent-/Klassen-Prestige-Bäume. Der Baum umfasst den gemeinsamen Einstieg und drei Spezialisierungszweige, normale Talente, aktive Fähigkeiten sowie tiefe Schlüsselmechaniken und deren Verstärkungen. Misch-Builds sind möglich; ein festes Punktelimit verhindert das vollständige Ausbauen aller Zweige. **Verbindliches Punktelimit (18.10.2026): Der einzige grosse Klassen-Talentbaum hat maximal 51 verteilbare Talentpunkte pro Klasse (Option A).** Das Limit gilt für alle drei Spezialisierungszweige zusammen und erzwingt WoW-Classic-artige Build-Entscheidungen. **Noch offen:** Wie die Klassenseelen-Kosten für den Punktekauf und die Kosten tiefer Schlüsselmechaniken genau ausgestaltet werden. Frühere Beschreibungen zweier getrennter Bäume gelten insoweit als überholt. Das accountweite Münz-Prestige bleibt separat bestehen.

**Verbindliche Präzisierung (18.10.2026):** Der eine grosse Klassen-Talentbaum besteht aus einem **verpflichtenden gemeinsamen Hauptbaum mit 10 investierten Punkten** und danach **51 separaten Spezialisierungspunkten**. Die 51 Punkte werden erst nach Abschluss der 10 Hauptbaum-Punkte freigeschaltet und frei auf die drei Spezialisierungszweige verteilt. Somit sind maximal **61 investierte Punkte insgesamt** möglich, davon 10 im Hauptbaum und 51 in Spezialisierungen. Die bisherige Formulierung «51 Punkte insgesamt» wird hiermit ersetzt. Die WoW-artige 5-Punkte-Reihenschwelle gilt weiterhin je Spezialisierungszweig. **Verbindlich (18.10.2026, Option B):** Die 10 Hauptbaum-Punkte werden durch erreichte **Wellen-Meilensteine** verdient, **ohne Klassenseelenkosten**. Erst nach dem Erwerb und der Verteilung aller 10 Hauptbaum-Punkte werden die 51 separaten Spezialisierungspunkte zugänglich. **Verbindliche Staffelung (18.10.2026, Option B):** Jeweils beim erstmaligen Erreichen von **Welle 5, 10, 15, 20, 25, 30, 35, 40, 45 und 50** wird **ein dauerhafter Hauptbaum-Punkt für die aktive Klasse** freigeschaltet. Insgesamt maximal 10 Hauptbaum-Punkte pro Klasse; bereits erreichte Meilensteine werden in späteren Runs nicht erneut vergütet. Mit Welle 50 sind alle zehn Punkte verdient. **Hauptbaum-Struktur (verbindlich, 18.10.2026, Option C):** Der gemeinsame Hauptbaum enthält **genau zehn unterschiedliche Grundtalente**, die mit den zehn durch Wellen-Meilensteine verdienten Punkten **in beliebiger Reihenfolge** freigeschaltet werden können. **Keine verzweigten Hauptbaum-Pfade, keine zusätzlichen Talentalternativen oder komplexen Voraussetzungen**; nach Verteilung aller zehn Punkte besitzen alle Spieler derselben Klasse dieselben Grundtalente. Kreative Build-Vielfalt und tiefere Mechaniken liegen bewusst in den drei Spezialisierungszweigen. Die Verteilung erfolgt weiterhin ausschliesslich zwischen Runs.

**Verteilung (Nutzerentscheidung A, 18.10.2026): Hauptbaum-Punkte dürfen ausschliesslich zwischen Runs im Hauptmenü verteilt werden.** Im laufenden Run werden erreichte Meilenstein-Punkte nur gutgeschrieben; der Talent-Build bleibt bis zum Run-Ende unverändert. Diese Regel gilt wie bei den 51 Spezialisierungspunkten. Die bestehende Klassenseelen-Preisformel bezieht sich auf die 51 Spezialisierungspunkte.

## Klassen, Talentbäume und Fähigkeiten
- Mehrere Klassen geplant; erste Klasse **Dunkler Krieger**.
- Drei WoW-Classic-inspirierte Spezialisierungen:
  - **Blutrausch:** Zweihänder, Blutungen, Angriffstempo, Schaden bei niedrigen HP.
  - **Schattenmacht:** Schattenmagie und Flüche.
  - **Unbezwingbar:** Tank, Lebensraub, Schadensreduktion.
- Nach 10 verpflichtenden Punkten im gemeinsamen Hauptbaum werden **51 zusätzliche Spezialisierungspunkte** freigeschaltet. Diese 51 Punkte sind frei zwischen den drei Spezialisierungszweigen verteilbar (insgesamt maximal 61 Punkte inklusive Hauptbaum). **Talentreihen (verbindlich, 18.10.2026, Option A):** Wie in WoW Classic schaltet jede Investition von **5 Punkten innerhalb desselben Spezialisierungszweigs** die nächste Talentreihe dieses Zweigs frei (Reihe 1: 0, Reihe 2: 5, Reihe 3: 10, Reihe 4: 15 usw.). Punkte in anderen Zweigen zählen nicht für diese Schwelle. Einzelne Talente können zusätzlich spezifische Vorgängertalente verlangen; solche Voraussetzungen sind separat zu gestalten.
- **Talentpunkt-Kosten verbindlich (18.10.2026, Option B):** Pro Klasse maximal 51 dauerhaft gekaufte Talentpunkte. Der erste Punkt kostet **5 Klassenseelen**, jeder weitere Punkt kostet **15 % mehr als der vorherige**. Preis für Punkt n (1–51): `ceil(5 × 1.15^(n−1))` Klassenseelen; auf ganze Seelen pro Punkt aufrunden. Punkte werden ausschliesslich mit den Klassenseelen der jeweiligen Klasse gekauft. Das Punktelimit gilt für den einzigen grossen Talentbaum über alle drei Zweige. Rücksetzung ausschliesslich zwischen Runs im Hauptmenü gegen einen **festen Münzpreis pro Reset** (Nutzerentscheidung A, 18.10.2026); der Preis steigt bei wiederholten Resets nicht. **Verbindlicher Preis: 500 permanente Münzen pro Talent-Reset (Nutzerentscheidung B, 18.10.2026).** Der Betrag bleibt bei jedem Reset gleich. Gekaufte Talentpunkte bleiben erhalten und können nach dem Reset neu verteilt werden. **Zeitpunkt verbindlich (18.10.2026, Option A): Talentpunkte können ausschliesslich zwischen Runs im Hauptmenü gekauft und verteilt werden. Während eines laufenden Runs bleibt der gewählte Talent-Build unverändert; weder Kauf noch Verteilung oder Rücksetzung im Run.**
- **Talent-Voraussetzungen (verbindlich, 18.10.2026, Option B):** Talente werden über die WoW-Classic-Punktschwellen (je 5 investierte Punkte pro Spezialisierungszweig) freigeschaltet. **Ausgewählte Talente besitzen zusätzlich konkrete Vorgängertalente als Voraussetzung**, gegebenenfalls mit gefordertem Mindestrang. Diese Abhängigkeiten werden im Talentbaum durch **sichtbare Verbindungspfeile** dargestellt. Nicht jeder Knoten braucht einen direkten Vorgänger; innerhalb freigeschalteter Reihen bleibt Auswahlfreiheit.
- **Endtalente (verbindlich, 18.10.2026, Option B):** Jeder der drei Spezialisierungszweige endet in **einer einzigartigen Schlüsselmechanik**, die den Spielstil deutlich verändert. Diese Mechanik kann **aktiv oder passiv** sein; es ist nicht vorgeschrieben, dass alle drei Endtalente aktive Fähigkeiten sind. Die konkreten Effekte werden beim Klassendesign festgelegt. Die tiefen Endtalente unterliegen den bereits beschlossenen Reihen- und Talentvoraussetzungen sowie dem gemeinsamen 51-Punkte-Limit.
- **Talentränge (verbindlich, 18.10.2026, Option A):** Einzelne Talente haben je nach Wirkung **1, 2, 3 oder 5 Ränge**, angelehnt an WoW Classic. Jeder investierte Punkt erhöht den Rang und verbraucht einen der insgesamt 51 Talentpunkte. Besonders mächtige neue aktive Fähigkeiten und Schlüsselmechaniken können als einzelne Talente mit nur einem Rang gestaltet werden. Die konkreten Ränge je Talent werden beim Entwurf der Klassenbäume festgelegt.
- Aktive Fähigkeiten werden ausschliesslich über Talentbäume freigeschaltet. Mehr als vier erlernbar, aber **vier aktive Slots gleichzeitig**. Passive Effekte und Standardangriffe automatisch. **Jede der vier ausgerüsteten aktiven Fähigkeiten kann individuell zwischen manuell und automatisch umgestellt werden** (Frage 85). Für automatisch genutzte Fähigkeiten lassen sich **eigene Einsatzbedingungen** definieren, z. B. Heilung unter 40 % HP oder starke Attacke nur bei Bossen (Frage 86). Keine zwingende komplexe KI; deterministische, konfigurierbare Regeln.
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
- Inventarlimit **50 Gegenstände**, manuelle Verwaltung und Verkauf, kein automatischer Lootfilter. **Verbindlich (Schritt 2, Option A): Ein einziges scrollbares Raster mit 50 Inventarplätzen auf dem iPhone; die 9 Ausrüstungsplätze werden separat dargestellt.** Die frühere Formulierung 'fünf Plätze je Slot' wird damit für die Inventar-UI durch diese explizite Entscheidung ersetzt.
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

## Statistiken und Run-Historie (Frage 89)
- **Vollständige Statistikübersicht** mit persönlichen Rekorden (höchste Welle, höchstes Level, längster Run), Kampfstatistiken (Schaden, besiegte Gegner, Bosse, kritische Treffer) und Wirtschaftsstatistiken (insgesamt Gold, Münzen, Seelen, Upgrades).
- Historie der letzten Runs, inklusive erreichter Welle, Dauer, relevanter Build-/Ausrüstungsdaten und Ergebnis.
- Datenerfassung möglichst ressourcenschonend, damit der Kampf auf Mobilgeräten flüssig bleibt.

## Speichern, Backup und spätere Cloud (Frage 90)
- **Automatische lokale Speicherung** von permanentem Fortschritt und aktivem Run im Browser, ohne Offline-Fortschritt.
- **Manueller Export und Import** eines vollständigen Spielstands als Datei, inklusive permanenten Upgrades, Seelen, Talenten, Statistiken und laufendem Run. Export-/Importfunktion ist **noch nicht implementiert**.
- Bei Import: Dateiformat/Version prüfen, Daten validieren und vor Überschreiben des bestehenden Spielstands bestätigen lassen. Migrationsfähigkeit für zukünftige Versionen einplanen.
- **Optionale Cloud-Synchronisierung mit Benutzerkonto erst später**, nicht Voraussetzung für V0.1 und nicht bereits zugesagt als fertig implementiert.
- Browserdaten können gelöscht werden: Bis Export/Import verfügbar ist, ist der Fortschritt nur lokal gesichert.

## Stand der tatsächlichen Implementierung
### Version 0.1 – technischer Kern (18.10.2026)
Erste implementierte Basis: automatischer Kampf, einfache exponentiell skalierende Gegner, fortlaufende Wellen, Bossmarkierung jede 10. und Zonenboss jede 50. Welle, Gold und Münzen, manuelle Run-Upgrades, einfache permanente Werkstatt, Level/XP, HP-Regeneration, Pause, freiwilliges Run-Ende, Run-Zusammenfassung, Speicherung im Browser.

**Bekannte Abweichungen und offene Punkte in V0.1:**
- Noch keine Ausrüstung, Loot, Inventar, Tränke, Fähigkeiten, Talentbäume, Seelenökonomie oder Begleiter.
- Noch keine unterschiedlichen KI-Verhaltensweisen, Bewegungssysteme, Statuswerte oder Bossfähigkeiten/Phasen.
- Werkstatt enthält nur einige Grundwerte; prozentuale Verteidigung, Krit-Schaden, Lebensraub etc. fehlen.
- Münzen werden bereits beim Kill verdient; Gold-Upgrades gehen am Run-Ende verloren.
- Kampfszene nutzt vorläufige Emoji-Platzhalter statt Pixel-Art.
- **Erster manueller iPhone-Test durch den Nutzer erfolgreich:** Kampf läuft, Welle 10 wird erreicht. **Boss auf Welle 10 wurde als praktisch unbesiegbar erlebt.** Ursache noch nicht abschliessend analysiert; Balancing und tatsächlicher Bosskampf müssen getestet werden. Kein vollständiger Regressionstest erfolgt.
- Bei Tod Run-Zusammenfassung, Neustart über Button. Bei freiwilligem Ende dasselbe.
- Weitere Systeme schrittweise implementieren und jeweils testen.

## Priorisierte Entwicklungsphasen und nächster Arbeitsauftrag
1. **V0.1.1 – Stabilität und Balancing (NÄCHSTES):** Boss auf Welle 10 mit echten Runs prüfen und fair abstimmen; Angriff/Verteidigung, Regeneration, Gold- und Münzökonomie überprüfen; Boss-Skalierung für spätere Wellen prüfen. Tod, Run-Zusammenfassung, Neustart, Pause, Speichern/Wiederaufnahme und iPhone-Darstellung gezielt testen. Regressionen vermeiden.
2. **V0.1.2 – Datensicherheit und Qualität:** Spielstand-Export/-Import mit Versionsprüfung und Validierung; Statistikerfassung und erste Run-Historie; auf mobilen Geräten testen.
3. **V0.2 – RPG-Systeme:** Inventar, Ausrüstung, Seltenheiten, Drops, Tränke und passende UI.
4. **V0.3 – Langzeitfortschritt:** Drei Talentbäume des Dunklen Kriegers, vier aktive Skills samt individueller Auto-Regeln, Seelen und Prestige.
5. **V0.4+ – Ausbau:** Sets, legendäre Sondermechaniken, weitere Klassen, Begleiter, abwechslungsreiche Bossmechaniken, moderne Pixel-Art, Gebiete und längere Balancingtests.

**Entwicklungsregeln:** Vor Codeänderungen diese Datei und den aktuellen Code lesen; Änderungen in kleinen, überprüfbaren Schritten umsetzen. Nach jedem Schritt Browser-/iPhone-Test anstreben. `main` ist der spielbare Stand; grössere Arbeiten zuerst auf separatem Branch. Feature-Status in dieser Datei aktualisieren. Die 90 Konzeptfragen sind abgeschlossen; offene Implementierungsdetails gezielt im Zuge der Entwicklung klären, statt erneut eine allgemeine Fragerunde zu beginnen.

## Konsistenzprüfung der 90 Designentscheidungen (18.10.2026)

**Prüfumfang:** Abgleich der in dieser Datei dokumentierten Beschlüsse aus Fragen 1–90 und der im Gespräch konkret bestätigten Fragen 81–90. Nicht jede ursprüngliche Frage ist hier wörtlich überliefert; deshalb keine Behauptung einer lückenlosen Wort-für-Wort-Prüfung aller ursprünglichen Antwortoptionen. **Keine Nutzerentscheidung wird durch diese Prüfung eigenmächtig geändert.**

### Ergebnis: keine zwingend unvereinbare Grundmechanik, aber folgende Überschneidungen und Klärungsfälle

| ID | Priorität | Betroffene Regeln | Befund / sichere Auslegung | Status |
| --- | --- | --- | --- | --- |
| K01 | Hoch | Inventar pausiert Kampf (F64); aktive Fähigkeiten manuell/automatisch (F85–86); Pause und Fortsetzen | Inventaröffnung muss **alle** Kampftimer, Gegneraktionen und automatische Fähigkeiten anhalten. Auto-Fähigkeiten dürfen während pausiertem Inventar nicht ausgelöst werden. Bei Rückkehr keine nachträgliche Kampfsimulation. | Technische Festlegung nötig |
| K02 | Hoch | Seelen ausschliesslich bei Run-Ende; Münzen sofort bei Kills; Prestige-/Talentökonomie; freiwilliges Run-Ende | Die drei Währungen dürfen nicht vermischt werden. Auch freiwilliges Run-Ende zählt für die Seelenabrechnung; Münzen bleiben bereits vorher erhalten. Es muss definiert werden, ob Seelen nur für die höchste Welle oder zusätzlich für andere Werte berechnet werden – bislang gilt **höchste Welle**. | Konsistent, bei Implementierung absichern |
| K03 | Gelöst | Alle 10 Wellen Boss; alle 50 Wellen Zonenboss (F83–84) | Welle 50, 100 usw. erfüllt **beide** Bedingungen. **Verbindlich bestätigt (Schritt 1, Option A): Der Zonenboss ersetzt den normalen Boss.** Genau ein Boss auf Welle 50/100 usw. | **Entschieden und dokumentiert** |
| K04 | Mittel | Exponentielle Gegnerstärke; Bosssprünge und Gebietssprünge (F87); Belohnungssprünge (F88); Fairness | Mehrere multiplikative Skalierungen können Bosse unverhältnismässig stark machen. V0.1-Boss auf Welle 10 bereits als zu schwer gemeldet. Separate Kurven und frühe Balancingtests nötig. | Balancing offen |
| K05 | Hoch | Automatisches Speichern des aktiven Runs (F90); kein Offline-Fortschritt; Pause und Run-Ende | Bei Wiederaufnahme exakt gespeicherten Zustand laden; **keine** Nachberechnung anhand verstrichener Realzeit. Ein abgeschlossener Run darf nicht wieder als aktiv geladen werden. | Technische Festlegung nötig |
| K06 | Hoch | Export/Import (F90); temporäre Ausrüstung/Tränke; permanente Werte | Backup muss **aktiven Run inklusive temporärer Gegenstände** und **permanenten Fortschritt** sichern. Temporäre Ausrüstung verschwindet erst bei tatsächlichem Run-Ende, nicht beim Schliessen, Export oder Import. | Konsistent, Tests nötig |
| K07 | Gelöst | 50 Inventarplätze; frühere Formulierung „jeder Slot 5 Plätze“; 9 Ausrüstungsslots | **Verbindlich geklärt (Schritt 2, Option A): 50 Plätze in einem scrollbaren Raster, 9 Ausrüstungsplätze separat.** Keine Aufteilung nach Seiten oder Kategorien erforderlich. | **Entschieden und dokumentiert** |
| K08 | Mittel | Eigene Gegner pro Zone (F83); keine Umgebungseffekte; Bosse mit Spezialmechaniken (F84) | Eigene Zonenfähigkeiten sind **Gegner-/Bossfähigkeiten**, keine zwingenden passiven Umweltschäden. Damit sind F83 und die ältere Regel zu fehlenden Umgebungseffekten vereinbar. | Konsistent |
| K09 | Mittel | Vier aktive Skills; Auto/manuell je Skill (F85); Bedingungen je Auto-Skill (F86); manuelle Tränke | Skill-Automatik und Trank-Automatik sind **getrennte Einstellungen**. Vier-Slot-Grenze betrifft aktive Klassenfähigkeiten, nicht Verbrauchstränke. | Konsistent, UI trennen |
| K10 | Mittel | Held bewegt sich automatisch (F79); Zielpriorität (F80); unterschiedliche Gegner-KI (F73) | Zielwahl und Bewegung sind verschiedene Systeme. Fernkämpfer halten Abstand zu ihrem **gewählten** Ziel; Gegner können unabhängig andere Ziele wählen. | Konsistent, erst später implementieren |
| K11 | Mittel | Bossbelohnungen; Seelen nur am Run-Ende; Belohnungssystem F88 | „Bosse geben zusätzliche Belohnungen“ bezieht sich unmittelbar auf **Gold, Münzen, XP und Loot**, nicht auf direkt ausgeschüttete Seelen. Gebietsbelohnungssprünge ebenfalls keine direkten Seelendrops. | Konsistent, explizit abgegrenzt |
| K12 | Mittel | Set-Items und legendäre Items nur pro Run; Statistiken/Run-Historie (F89) | Run-Historie darf Namen/Statistiken ehemaliger Ausrüstung als **historische Daten** speichern, aber Gegenstände nicht wieder nutzbar machen. | Konsistent |
| K13 | Mittel | Permanente Talentpunkte, Respec mit Münzen; Talentfähigkeiten; Run-Reset | Freigeschaltete Talentpunkte und deren Verteilung bleiben über Runs erhalten; ein Respec setzt nur die **Verteilung** zurück, nicht die Anzahl gekaufter Punkte. Run-Reset löscht keine permanenten Talente. | Konsistent |
| K14 | Teilweise gelöst | Prozentuale Verteidigung und flache Verteidigung; exponentieller Gegnerangriff | **Schritt 3 entschieden:** Prozentverteidigung hat ein anfänglich niedriges hartes Cap, das über Prestige dauerhaft erhöht wird; immer unter 100 %. Flache Verteidigung ist separat. Die genaue Berechnungsreihenfolge, Start-/Endwerte und Kosten sind weiterhin Balancing-Details. | Grundprinzip entschieden; Zahlen offen |
| K15 | Niedrig | Hohe Wellen mit legendärer Beute; Levelanforderung für Ausrüstung; Run-Level-Reset | Levelanforderungen dürfen Items innerhalb eines Runs vorübergehend untragbar machen. Itemlevel und Heldenlevel sind getrennte Werte. | Konsistent |
| K16 | Mittel | Begleiterhaltungen (F78); gegnerische Zielwahl (F73); Klassenabhängigkeit (F74–77) | Haltungen steuern Begleiterverhalten, **nicht** direkt die Zielpriorität gegnerischer KI. Begleiterzahlen und Wiederbelebung bleiben klassenabhängig. | Konsistent |
| K17 | Hoch | „Run endet bei Tod oder freiwilligem Abbruch“; Speicherung/Backup; manuelles Beenden | Eine normale Pause oder das Schliessen des Browsers **beendet keinen Run** und vergibt keine Seelen. Nur Tod und bestätigtes freiwilliges Beenden rechnen den Run ab. | Konsistent, bei Implementierung absichern |
| K18 | Mittel | Moderne Pixel-Art (F82); mobiler Bildschirm Kampf oben/Menüs unten (F81) | Detaillierte Animationen dürfen die Lesbarkeit und Performance auf dem iPhone nicht beeinträchtigen. Grafik ist eine Stilvorgabe, kein Grund, zuerst aufwendige Assets statt Gameplay zu bauen. | Konsistent |

### Vor Umsetzung gezielt klären
1. **K03 erledigt:** Zonenboss ersetzt normalen Boss auf jeder 50. Welle (Schritt 1: A).
2. **K07 erledigt:** 50 Inventarplätze in einem scrollbaren Raster; 9 Ausrüstungsplätze separat (Schritt 2: A).
3. **K14 teilweise erledigt:** Prozentverteidigung hat ein anfangs niedriges Cap, das über Prestige steigt und stets unter 100 % bleibt (Schritt 3). Genaue Zahlen und Schadensformel im Balancing festlegen.

### Verbindliche technische Prüfliste für kommende Versionen
- [ ] Boss Welle 10 fair abstimmen; Welle 20/50 mitprüfen (K04).
- [ ] Tod, freiwilliges Run-Ende und Seelenabrechnung getrennt testen (K02, K17).
- [ ] Pausieren durch Inventar und manuelle Pause ohne Timer-Nachlauf testen (K01).
- [ ] Speichern/Wiederaufnahme ohne Offline-Erträge und ohne doppeltes Run-Ende testen (K05).
- [ ] Export/Import inklusive aktivem Run und permanenter Werte mit Datenvalidierung testen (K06).
- [ ] Skill-Auto-Regeln und Trank-Auto-Regeln getrennt implementieren (K09).
- [ ] Direkte Seelendrops aus Bossen oder Gebieten ausschliessen (K11).
- [ ] Run-Historie von tatsächlich nutzbarem Inventar trennen (K12).
- [ ] Talent-Respec darf gekaufte Punkte nicht vernichten (K13).
- [ ] Skalierung von Gegnern, Bossen, Gebieten und Belohnungen gemeinsam testen (K04, K14).
- [ ] Prozentverteidigungs-Cap ab Spielstart und dessen Prestige-Erhöhungen implementieren; unter 100 % begrenzen und mit flacher Verteidigung testen (K14).
- [ ] Beschlossene Zonenboss-Ersetzung auf Wellen 50/100 im Spiel umsetzen und testen (K03; Design geklärt).
- [ ] Beschlossenes scrollbares 50er-Inventarraster und separate 9 Ausrüstungsplätze im Spiel umsetzen und auf iPhone testen (K07; Design geklärt).
- [ ] Nach jeder Version diese Prüfliste und den Implementierungsstand aktualisieren.

## Noch offene Entscheidungen
- Exakte Item-/Trankdropraten, konkrete Balancing-Formeln und Feintuning der vorläufigen 15-Sekunden-Trankabklingzeit.
- Präzise Ausgestaltung aller Talentknoten, Skill- und Bosslisten.

## Änderungsprotokoll
- 18.10.2026: Entscheidungen bis Frage 81 zusammengetragen; 0.1 als bewusster kleiner technischer Anfang definiert.
- 18.10.2026: **Alle 90 Designfragen abgeschlossen**; Fragen 82–90 ergänzt. Erster iPhone-Spieltest bestätigt grundlegenden Loop, meldet aber viel zu schweren Boss auf Welle 10. V0.1.1 und weitere Schritte priorisiert.
- 18.10.2026: Konsistenzprüfung mit 18 Prüfpunkten, 3 gezielten Klärungsfällen und technischer Checkliste ergänzt; keine bestehenden Nutzerentscheidungen eigenmächtig geändert.

- 18.10.2026: Schritt 1 (K03) durch Nutzer entschieden: Auf jeder 50. Welle ersetzt der Zonenboss den normalen Boss; keine zwei Bosse gleichzeitig oder nacheinander.

- 18.10.2026: Schritt 2 (K07) durch Nutzer entschieden: 50 Inventarplätze als ein scrollbares Raster; neun Ausrüstungsplätze separat.

- 18.10.2026: Schritt 3 (K14) durch Nutzer entschieden: hartes, anfangs niedriges Cap für Prozentverteidigung; dauerhaft per Prestige steigerbar, aber nie 100 %. Exakte Werte und Schadensformel bleiben Balancing-Aufgabe.
- 18.10.2026: Währungsmodell präzisiert: Gold ist Run-Währung und wird zurückgesetzt; Münzen finanzieren permanente Verbesserungen für alle Helden; jede Klasse hat ihren eigenen Seelenvorrat für klassenspezifischen Fortschritt. Gemeinsame und klassengebundene Währungen sind strikt getrennt.
- 18.10.2026: Nutzerentscheidung: Klassenseelen werden sowohl für Talentpunkte als auch für einen separaten permanenten Prestige-Baum der jeweiligen Klasse verwendet (Option B).
- 18.10.2026: Nutzerentscheidung: Der klassenbezogene Prestige-Baum verbessert ausschliesslich Klassenmechaniken; keine allgemeinen Grundwert-Boni.
- 18.10.2026: Nutzerentscheidung: Klassen-Prestige kann bestehende Mechaniken verstärken und neue Varianten/Funktionsweisen freischalten (Option C).
- 18.10.2026: Nutzerpräferenz für den Aufbau des Klassen-Prestige-Baums: ein echter WoW-Classic-artiger Talentbaum mit verbundenen Talenten und Freischaltvoraussetzungen, keine lineare Liste oder lose Upgrade-Kacheln.
- 18.10.2026: Nutzerentscheidung zur Baumstruktur: ein gemeinsamer Hauptbaum mit drei Spezialisierungszweigen je Klasse (beim Dunklen Krieger: Blutrausch, Schattenmacht, Unbezwingbar).
- 18.10.2026: Nutzerpräferenz zur Talentverteilung: Zweige dürfen gemischt werden, aber tiefe neue Klassenmechaniken benötigen hohe Investitionen; dadurch verhindern begrenzte Punkte, dass ein Build alle tiefen Schlüsselmechaniken mehrerer Zweige zugleich erhält (WoW-Classic-Prinzip).
- 18.10.2026: Nutzerentscheidung C: Normale Klassen-Prestige-Talente haben feste Kosten; tiefe Schlüsselmechaniken und deren Verstärkungen kosten deutlich mehr. Exakte Kosten noch offen.

- 18.10.2026: Nutzerentscheidung A: Klassen-Prestige hat ein festes Punktelimit pro Klasse. Nicht alle drei Zweige können vollständig ausgebaut werden; exakte Höhe noch offen. Kostenregel für normale Knoten und teure Schlüsselmechaniken im Haupttext ergänzt.

- 18.10.2026: Nutzerentscheidung: Statt zwei separaten WoW-artigen Talent-/Klassen-Prestige-Bäumen soll es **einen einzigen grossen Klassen-Talentbaum** geben. Zusammenführung der Punkt-/Kostenregeln ist noch zu klären; globales Münz-Prestige bleibt bestehen.

- 18.10.2026: Nutzerentscheidung A: Der einzige grosse Klassen-Talentbaum besitzt insgesamt **51 verteilbare Talentpunkte** pro Klasse; kein zusätzliches separates Klassen-Prestige-Punktelimit.

- 18.10.2026: Nutzerentscheidung B: Die 51 Talentpunkte pro Klasse werden mit Klassenseelen gekauft; Punkt 1 kostet 5 Seelen, jeder folgende 15 % mehr (`ceil(5 × 1.15^(n−1))`).

- 18.10.2026: Nutzerentscheidung B: Klassenseelen am Run-Ende skalieren überproportional mit der höchsten erreichten Welle. Exakte Formel noch offen; erste Vergabe weiterhin ab Welle 5.

- 18.10.2026: Nutzerentscheidung B zur Klassenseelen-Formel: `w < 5 ? 0 : floor((w / 5)^1.5)` Seelen am Run-Ende für die aktive Klasse, abhängig von der höchsten erreichten Welle.

- 18.10.2026: Nutzerentscheidung A: Jeder Run gewährt die volle Klassenseelen-Belohnung gemäss Wellenformel, auch bei wiederholtem Erreichen derselben Welle; kein Rekordbonus oder Wiederholungsmalus.

- 18.10.2026: Nutzerentscheidung A: Talentpunkte kaufen und verteilen ausschliesslich zwischen Runs im Hauptmenü; laufende Runs behalten ihren Talent-Build unverändert.

- 18.10.2026: Nutzerentscheidung A: Talent-Resets kosten jedes Mal denselben festen Betrag permanenter Münzen; kein ansteigender Preis. Konkreter Münzpreis noch offen.

- 18.10.2026: Nutzerentscheidung B: Jeder Talent-Reset kostet fest **500 permanente Münzen**; gekaufte Talentpunkte bleiben erhalten und werden neu verteilt.

- 18.10.2026: Nutzerentscheidung A: Talentreihen werden WoW-Classic-artig pro Spezialisierungszweig nach jeweils 5 dort investierten Punkten freigeschaltet; Punkte aus anderen Zweigen zählen nicht mit.

- 18.10.2026: Nutzerentscheidung A: Talente haben je nach Effekt 1, 2, 3 oder 5 Ränge wie in WoW Classic; jeder Rang kostet einen Talentpunkt.

- 18.10.2026: Nutzerentscheidung B: Talentfreischaltung kombiniert Punktschwellen und ausgewählte direkte Talentvoraussetzungen mit sichtbaren Pfeilen; keine Pflichtverbindung für jeden Knoten.

- 18.10.2026: Nutzerentscheidung B: Jeder Spezialisierungszweig erhält als Endtalent eine einzigartige spielstilprägende Schlüsselmechanik, aktiv oder passiv.

- 18.10.2026: Nutzerpräzisierung: 10 verpflichtende Hauptbaum-Punkte, erst danach 51 zusätzliche Spezialisierungspunkte; 51er-Kontingent wird durch den Hauptbaum nicht reduziert. Vergabe/Kosten der ersten 10 Punkte noch offen.

- 18.10.2026: Nutzerentscheidung B: Die 10 verpflichtenden Hauptbaum-Punkte werden kostenlos durch Wellen-Meilensteine freigeschaltet. Die 51 Spezialisierungspunkte bleiben separat und kosten Klassenseelen; konkrete Meilenstein-Wellen noch offen.

- 18.10.2026: Nutzerentscheidung B: Je ein dauerhafter Hauptbaum-Punkt pro Klasse bei Welle 5, 10, 15, 20, 25, 30, 35, 40, 45 und 50; danach alle zehn verfügbar. Keine erneute Vergabe für wiederholte Meilensteine.

- 18.10.2026: Nutzerentscheidung A: Die 10 durch Wellen-Meilensteine verdienten Hauptbaum-Punkte werden ausschliesslich zwischen Runs im Hauptmenü verteilt; keine Änderungen des Talent-Builds während eines Runs.

- 18.10.2026: Nutzerentscheidung C: Einfacher Hauptbaum mit genau zehn frei in beliebiger Reihenfolge wählbaren Grundtalenten; komplexe Build-Entscheidungen bewusst in die Spezialisierungen verlagern.

**Präzisierung Grundtalente (18.10.2026, Nutzerentscheidung B mit Einschränkung):** Jede Klasse erhält **genau eine charakteristische aktive Startfähigkeit automatisch ab Spielbeginn**, ohne dafür einen Talentpunkt auszugeben. Die übrigen **neun Grundtalente sind ausschliesslich passive Talente** und können frei in beliebiger Reihenfolge gewählt werden. Die kreative Vielfalt aktiver Fähigkeiten und komplexer Mechaniken liegt in den Spezialisierungen. **Folgeanpassung noch offen:** Die zuvor festgelegten zehn Wellen-Meilensteine für zehn Hauptbaum-Punkte müssen an neun passive Grundtalente angepasst werden; bis zur nächsten Entscheidung keine konkrete Meilenstein-Welle streichen. Die 51 Spezialisierungspunkte bleiben unverändert.

**Verbindliche Meilenstein-Anpassung (18.10.2026, Option B; ersetzt die frühere 5–50-Staffelung):** Die **neun passiven Hauptbaum-Talentpunkte** werden pro Klasse dauerhaft beim **erstmaligen Besiegen der Bosse auf Welle 10, 15, 20, 25, 30, 35, 40, 45 und 50** verdient. Der erste Punkt auf Welle 10 belohnt den ersten Boss-Sieg zusätzlich. Die eine aktive Startfähigkeit ist ab Beginn kostenlos verfügbar und verbraucht keinen Punkt. Die neun Passiven werden nur zwischen Runs verteilt; nach Verteilung aller neun Punkte sind die 51 Spezialisierungspunkte zugänglich. Die zuvor notierten zehn Hauptbaum-Punkte und die Vergabe auf Welle 5 sind durch diese Entscheidung **überholt**. Maximal **60 investierbare Talentpunkte** pro Klasse: neun passive Hauptbaum-Punkte und 51 Spezialisierungspunkte, plus eine kostenlose aktive Startfähigkeit.

**Aktive Startfähigkeit Dunkler Krieger (verbindlich, 18.10.2026): Vernichtender Hieb.** Der Dunkle Krieger besitzt diese **kostenlose aktive Fähigkeit ab Spielbeginn**, unabhängig von Talentpunkten und Spezialisierung. Vernichtender Hieb ist ein **wuchtiger Waffenangriff mit erhöhtem Schaden**, bewusst **spezialisierungsneutral** gestaltet: Er muss für **Blutrausch, Schattenmacht und Unbezwingbar** gleichermassen sinnvoll bleiben. Mögliche spätere Spezialisierungs-Modifikationen dürfen die gemeinsame Grundfunktion ergänzen, ohne eine der drei Spezialisierungen schon beim Start zu bevorzugen. **Verbindliche Grundwirkung (18.10.2026, Option B):** Vernichtender Hieb verursacht **150 % des normalen Angriffsschadens**, reduziert die **Verteidigung des getroffenen Gegners für 5 Sekunden** und hat **10 Sekunden Abklingzeit**. **Aktualisierte verbindliche Stärke (18.10.2026, Nutzerkorrektur Option A): Die Verteidigung des getroffenen Gegners wird für 5 Sekunden um 10 % reduziert.** **Keine automatische Skalierung durch investierte Punkte.** Stattdessen erhält **jeder der drei Spezialisierungszweige (Blutrausch, Schattenmacht, Unbezwingbar) ein eigenes Talentfeld mit fünf Rängen (0/5 bis 5/5)**, das **Vernichtender Hieb** verbessert: **je investiertem Rang +1 Prozentpunkt Verteidigungsreduktion**. Grundwert 10 %, ein vollständig ausgebautes Feld ergibt 15 %. Jeder Rang kostet einen der 51 Spezialisierungspunkte. **Platzierung Rüstungsbruch-Talent (verbindlich, 18.10.2026, Option B):** In **jedem** der drei Spezialisierungszweige (Blutrausch, Schattenmacht, Unbezwingbar) liegt das jeweilige **5-Rang-Talent für Vernichtender Hieb in der zweiten Talentreihe**. Es wird erst verfügbar, nachdem **mindestens 5 Talentpunkte im betreffenden Spezialisierungszweig** investiert wurden; Punkte in anderen Zweigen zählen nicht für die Freischaltung. Danach kostet jeder Rang einen der 51 Spezialisierungspunkte und erhöht die Verteidigungsreduktion um 1 Prozentpunkt. Boni aus mehreren Zweigen addieren sich weiterhin.

**Verbindliche Kombination (18.10.2026, Option A):** Die Boni der drei Rüstungsbruch-Talentfelder **addieren sich**. Jeder investierte Rang in einem beliebigen der drei Zweige gibt **+1 Prozentpunkt** Verteidigungsreduktion für Vernichtender Hieb. Formel: **10 % + Summe aller investierten Ränge der drei Rüstungsbruch-Talentfelder**. Beispiel: 5/5 in Blutrausch und 5/5 in Schattenmacht ergeben **20 %**; mit 5/5 in allen drei Zweigen sind maximal **25 %** möglich. Jeder Rang verbraucht einen der 51 Spezialisierungspunkte. Die Wirkung gilt auch gegen Bosse, vorbehaltlich späterer allgemeiner Balance-Regeln; Dauer 5 Sekunden und Abklingzeit 10 Sekunden bleiben bestehen. Die Fähigkeit bleibt für Blutrausch, Schattenmacht und Unbezwingbar gleichermassen nutzbar.

- 18.10.2026: Nutzerentscheidung B: Vernichtender Hieb verursacht 150 % Angriffsschaden, senkt die gegnerische Verteidigung für 5 Sekunden und hat 10 Sekunden Abklingzeit; Höhe der Verteidigungsreduktion noch offen.

- 18.10.2026: Nutzerentscheidung B: Vernichtender Hieb reduziert die gegnerische Verteidigung um 20 % für 5 Sekunden (bei 150 % Angriffsschaden und 10 Sekunden Abklingzeit).

- 18.10.2026: Nutzerkorrektur ersetzt den zuvor gewählten 20-%-Wert: Vernichtender Hieb beginnt mit 10 % Verteidigungsreduktion; je 5 insgesamt in beliebige Spezialisierungen investierte Punkte +1 Prozentpunkt (bis 20 % bei 50–51 Punkten). Dauer 5 Sekunden, Abklingzeit 10 Sekunden, Schaden 150 % bleiben gleich.

- 18.10.2026: Nutzerkorrektur: Keine automatische Steigerung alle fünf Spezialisierungspunkte. Stattdessen je ein 5-Rang-Talentfeld pro Spezialisierung für Vernichtender Hieb, pro Rang +1 Prozentpunkt Verteidigungsreduktion (Grundwert 10 %, pro voll ausgebautem Feld 15 %). Kombination über mehrere Zweige noch offen.

- 18.10.2026: Nutzerentscheidung A: Rüstungsbruch-Boni aus den drei Spezialisierungsbäumen addieren sich (+1 Prozentpunkt je Rang, maximal +15 Prozentpunkte bzw. 25 % gesamt bei 5/5 in allen drei Zweigen).

- 18.10.2026: Nutzerentscheidung B: Rüstungsbruch-Talent (5 Ränge) liegt in allen drei Spezialisierungen in Reihe 2 und erfordert zuvor fünf investierte Punkte im jeweiligen Zweig.

## Dunkler Krieger – neun passive Grundtalente (freigegeben, 18.10.2026)

Der Nutzer hat die folgende vollständige Liste ausdrücklich freigegeben. **Alle neun Grundtalente haben genau einen Rang (1/1)**, kosten jeweils einen der neun durch Wellen-Meilensteine verdienten Hauptbaum-Punkte und dürfen zwischen Runs in beliebiger Reihenfolge gewählt werden. Sie gelten spezialisierungsneutral für Blutrausch, Schattenmacht und Unbezwingbar:

| Grundtalent | Passiver Effekt |
|---|---|
| Brutale Stärke | +5 % Angriffsschaden |
| Zäher Körper | +10 % maximales Leben |
| Eisenhaut | +5 % Verteidigung |
| Kampferfahrung | +5 % Angriffsgeschwindigkeit |
| Lebenswille | +10 % Lebensregeneration |
| Präziser Schlag | +5 Prozentpunkte kritische Trefferchance |
| Tödliche Präzision | +10 % kritischer Trefferschaden |
| Unnachgiebig | −5 % erlittener Schaden |
| Henker | +10 % Schaden gegen Gegner unter 30 % Leben |

**Zusätzlich kostenlos ab Spielbeginn:** die aktive Klassenfähigkeit *Vernichtender Hieb* (separat definiert). Die neun Punkte werden bei den Wellen 10, 15, 20, 25, 30, 35, 40, 45 und 50 dauerhaft pro Klasse freigeschaltet und nur zwischen Runs verteilt. Die 51 Spezialisierungspunkte bleiben separat. **Arbeitsmodus:** Der Assistent gestaltet die detaillierten Spezialisierungs-Talente, Zahlen und Verbindungen weitgehend selbstständig und legt dem Nutzer nur wesentliche Richtungsentscheidungen vor; möglichst früh spielbare Versionen testen.

## Aktive Spezialisierungsfähigkeiten und Vier-Slot-Grenze (verbindlich, 18.10.2026)

**Vereinfachte finale Struktur:** Jede der drei Spezialisierungen (Blutrausch, Schattenmacht, Unbezwingbar) bietet **genau zwei aktive Fähigkeitstalente (je 1/1)**: eine **frühe aktive Fähigkeit in Reihe 3** (nach mindestens 10 im jeweiligen Zweig investierten Punkten, insgesamt mindestens 11 Punkte inklusive Fähigkeit) und eine **mächtige aktive Endfähigkeit in Reihe 7** (nach mindestens 30 im jeweiligen Zweig investierten Punkten, insgesamt mindestens 31 Punkte inklusive Endfähigkeit). Andere Spezialisierungstalente sind passiv oder modifizieren bestehende Fähigkeiten, statt neue aktive Skills freizuschalten. Die bisherige Offenheit, ob Endtalente aktiv oder passiv sind, ist hiermit ersetzt: **Alle drei Endtalente sind aktiv.**

**Fähigkeitslimit:** *Vernichtender Hieb* ist als kostenlose aktive Startfähigkeit fest auf Slot 1. Zusätzlich können **maximal drei weitere aktive Fähigkeiten** aus beliebigen Spezialisierungen **erlernt** und auf Slots 2–4 eingesetzt werden. Sobald drei weitere aktive Fähigkeiten gelernt wurden, sind alle übrigen aktiven Fähigkeitstalente im Talentbaum **nicht mehr kaufbar** (sichtbar, aber gesperrt); passive Talente bleiben kaufbar. Ein Talentreset zwischen Runs erlaubt eine andere Wahl. Es kann somit niemals eine fünfte aktive Fähigkeit erworben werden. Spieler dürfen freiwillig weniger als vier aktive Fähigkeiten haben.

**Mathematische Kontrolle:** Die drei frühen Fähigkeiten kosten bei Verteilung 11+11+11 = **33 der 51 Spezialisierungspunkte**, also **18 übrig**, insgesamt vier aktive Fähigkeiten inklusive Startfähigkeit. Eine Endfähigkeit kostet mindestens 31 Punkte im entsprechenden Zweig; zwei Endfähigkeiten sind mit 51 Punkten nicht möglich (mindestens 62 nötig). Die restlichen Punkte dürfen gemischt investiert werden, solange die branchenspezifischen 5-Punkte-Reihenschwellen eingehalten werden. Die neun passiven Hauptbaum-Punkte zählen nicht zu den 51 Spezialisierungspunkten.

## Spezialisierungsbäume nach WoW-Classic-Vorbild (ausdrücklich bestätigt, 18.10.2026)

**Verbindliche Designrichtung:** Die drei Spezialisierungsbäume sollen in **Grösse, Struktur und Entscheidungsdichte deutlich näher an WoW Classic** liegen: je **7 Talentreihen**, ungefähr **18 unterschiedliche Talentknoten pro Zweig** als Richtwert und **mehr verfügbare Talentränge, als mit den insgesamt 51 Spezialisierungspunkten gekauft werden können**. Selbst ein reiner Spezialisierungs-Build kann seinen Baum nicht vollständig maximieren. Der Nutzer will echte Alternativen, klare Talentvoraussetzungen, Synergien und unverwechselbare Spielmechaniken statt einer linearen Liste kleiner Prozentboni. Die Zahl 59 Punkte aus dem WoW-Waffen-Vergleich ist eine **Orientierung, keine verbindliche exakte Sollsumme** für unsere Bäume. Die zuvor gezeigte Blutrausch-V1.0-Liste war ein **nicht freigegebener Entwurf** und wird nicht als finale Talentliste übernommen. Bestehende verbindliche Regeln bleiben: 51 Punkte über alle drei Zweige, Reihenfreischaltung alle 5 Punkte je Zweig, Rüstungsbruch 5/5 in Reihe 2 jedes Zweigs, je eine aktive Fähigkeit in Reihe 3 und eine aktive Endfähigkeit in Reihe 7, maximal drei zusätzlich zur kostenlosen Startfähigkeit erlernbare aktive Fähigkeiten. Die konkrete Talentgestaltung erfolgt als zusammenhängender Entwurf zur Freigabe, ohne Einzelabfrage jeder Kachel.

## Blutrausch – Talentbaum V2.0 (ENTWURF, noch nicht freigegeben; 18.10.2026)

**Leitidee:** Blutungen sind bereits in Talentreihe 1 zugänglich; alle späteren Reihen bauen auf ihnen auf. Dieser Abschnitt ist ein Designvorschlag, keine Nutzerfreigabe. 7 Reihen, **18 Talentknoten, insgesamt 64 mögliche Ränge** (mehr als die 51 verfügbaren Spezialisierungspunkte). Schwellen: Reihe 1 = 0, Reihe 2 = 5, Reihe 3 = 10, Reihe 4 = 15, Reihe 5 = 20, Reihe 6 = 25, Reihe 7 = 30 investierte Punkte im Zweig. Rüstungsbruch bleibt wie beschlossen in Reihe 2 mit 5 Rängen. Genau zwei aktive Spezialisierungsfähigkeiten (Reihe 3 und 7); alle anderen Talente sind passiv.

| Reihe | Talent | Ränge | Entwurfswirkung |
|---|---|---:|---|
| 1 | Aufreissende Hiebe | 5 | +5 Prozentpunkte Blutungschance bei normalen Angriffen pro Rang; 25 % bei 5/5 |
| 1 | Blutige Klinge | 5 | Erhöht Blutungsschaden |
| 1 | Kampfhunger | 5 | Angriffstempo gegen blutende Gegner |
| 2 | Rüstungsbruch | 5 | +1 Prozentpunkt Verteidigungsreduktion von Vernichtender Hieb pro Rang |
| 2 | Tiefe Wunden | 3 | Verlängert Blutungsdauer |
| 2 | Blutgeruch | 3 | Kritische Treffer gegen blutende Gegner verstärken Blutung |
| 3 | Blutiger Ansturm | 1 | **AKTIV**: Angriff mit garantierter Blutung |
| 3 | Offene Adern | 3 | Blutungen können stapeln |
| 3 | Raserei | 5 | Mehr Angriffstempo durch blutende Gegner |
| 4 | Bluternte | 3 | Blutungsschaden heilt den Krieger leicht |
| 4 | Grausamer Schnitt | 5 | Kritische Treffer verlängern Blutungen |
| 4 | Gerinnungsbruch | 3 | Blutungen ignorieren einen Teil der gegnerischen Verteidigung |
| 5 | Blutrausch | 1 | Passiv: Bei niedrigem Leben werden Blutungen gefährlicher |
| 5 | Schlachtrausch | 5 | Blutungen verstärken normale Angriffe |
| 5 | Blutige Vergeltung | 3 | Erlittener Schaden verstärkt die nächste Blutung |
| 6 | Zerfetzende Schläge | 5 | Zusatzschaden gegen stark blutende Gegner |
| 6 | Unstillbarer Hunger | 3 | Besiegte blutende Gegner verleihen kurzzeitig Lebensraub |
| 7 | Blutbad | 1 | **AKTIVES ENDTALENT**: Entfesselt angesammelte Blutungen für hohen Schaden |

### Blutrausch V2.1 – gezielte Talentverbindungen (Entwurf, 18.10.2026)

**Grundsatz:** Die Freischaltung jeder Reihe erfordert weiterhin 5 Punkte je vorheriger Reihe im selben Spezialisierungszweig (0/5/10/15/20/25/30 Punkte insgesamt). Nicht jeder Knoten hat einen Pfeil: Der Baum soll zusammenhängende **Blutungs-Kombinationspfade** anbieten, ohne alle Talente auf einen einzigen linearen Pfad zu zwingen. Eine direkte Voraussetzung erfordert den angegebenen Rang im Vorgängertalent und wird im UI als Pfeil dargestellt. **Wichtig:** Voraussetzungen gelten zusätzlich zur Reihenschwelle; gekaufte Vorgängerränge zählen normal zu den 51 Punkten.

| Talent (Reihe) | Direkte Voraussetzung | Verbindungsidee |
|---|---|---|
| Aufreissende Hiebe (1) | Keine | Blutungseinstieg |
| Blutige Klinge (1) | Keine | Blutungsstärke, unabhängig vom Proc |
| Kampfhunger (1) | Keine | Angriffstempo gegen Blutende |
| Rüstungsbruch (2) | Keine | Universelles Vernichtender-Hieb-Talent, auch in anderen Zweigen |
| Tiefe Wunden (2) | Aufreissende Hiebe 3/5 | Häufige Blutungen länger wirken lassen |
| Blutgeruch (2) | Blutige Klinge 3/5 | Stärkere Blutungen durch kritische Treffer |
| Blutiger Ansturm (3, AKTIV) | Aufreissende Hiebe 3/5 | Garantierte Blutung als Kernfähigkeit |
| Offene Adern (3) | Tiefe Wunden 2/3 | Mehrere Blutungsstapel |
| Raserei (3) | Kampfhunger 3/5 | Blutungsabhängiges Angriffstempo |
| Bluternte (4) | Offene Adern 2/3 | Heilung aus Blutungsschaden |
| Grausamer Schnitt (4) | Blutgeruch 2/3 | Kritische Treffer halten Blutungen aktiv |
| Gerinnungsbruch (4) | Keine | Alternativer Blutungsdurchdringungsweg |
| Blutrausch (5) | Blutiger Ansturm 1/1 | Risikoreiche Verstärkung bei wenig Leben |
| Schlachtrausch (5) | Raserei 3/5 | Blutungen verstärken Angriffe |
| Blutige Vergeltung (5) | Bluternte 2/3 | Erlittener Schaden stärkt nächste Blutung |
| Zerfetzende Schläge (6) | Schlachtrausch 3/5 | Schaden gegen stark blutende Gegner |
| Unstillbarer Hunger (6) | Bluternte 2/3 | Lebensraub nach Kills |
| Blutbad (7, AKTIVES ENDTALENT) | Blutiger Ansturm 1/1 **und** Offene Adern 3/3 | Blutungen aufbauen und für einen Finisher nutzen |

**Spielbarkeit / Punktprüfung:** 18 Talentknoten und **64 mögliche Ränge** bei nur 51 verteilbaren Punkten. *Blutbad* ist erreichbar: Aufreissende Hiebe 3/5, Tiefe Wunden 2/3, Offene Adern 3/3 und Blutiger Ansturm 1/1 kosten zusammen 9 Punkte; zusätzlich werden 21 frei wählbare, nach Reihenfreischaltung legale Punkte im Blutrausch-Zweig investiert, um vor Kauf von Blutbad die 30-Punkte-Schwelle zu erreichen; der Kauf von Blutbad ist Punkt 31. **Rüstungsbruch bleibt in Reihe 2 ohne direkte Voraussetzung**. Es gibt keine Pflicht, alle 18 Knoten zu kaufen. Das aktive Fähigkeitensystem begrenzt wie beschlossen auf insgesamt vier aktive Fähigkeiten.

**Vorläufige Basis-Blutung:** 6 Sekunden Dauer, insgesamt 30 % Angriffsschaden über Zeit. Die konkrete Berechnung, Stapelgrenzen, Voraussetzungen und Balancing-Werte der anderen Talente werden vor der Implementierung geprüft. Die 51-Punkte-Grenze und das Limit von insgesamt vier aktiven Fähigkeiten bleiben bestehen. 

### Blutrausch V2.2 – drei gleichwertige Einstiege (Designkorrektur, 18.10.2026)

**Problem V2.1:** Aufreissende Hiebe war eine dominante Pflichtwahl, weil es sowohl den frühen Blutungszugang als auch zu viele spätere Voraussetzungen kontrollierte. **Neue Richtung:** Die drei Talente in Reihe 1 müssen unabhängig voneinander sofort spielbar sein und jeweils einen eigenständigen Blutungszugang bzw. offensiven Nutzen eröffnen:

- **Aufreissende Hiebe (5/5):** Normale Angriffe können Blutungen verursachen. Häufigkeits-/Stapelspielstil.
- **Blutige Klinge (5/5):** Bereits mit Rang 1 fügt **Vernichtender Hieb** garantiert eine Blutung zu. Weitere Ränge verstärken diesen gezielten Blutungsweg (genaue Zahlen noch balancieren).
- **Kampfhunger (5/5):** Bereits mit Rang 1 steigt das Angriffstempo beim fortgesetzten Angriff auf einen Gegner, **ohne dass dieser bluten muss**. Weitere Ränge verstärken das Tempo; Fokus auf schnelle Angriffe.

**Voraussetzungen anpassen:** Blutiger Ansturm (Reihe 3) ist **nicht mehr** von Aufreissende Hiebe abhängig; seine eigene garantierte Blutung macht ihn für jeden Einstiegsweg nützlich. Der Endtalentpfad Blutbad darf nicht ausschliesslich über Aufreissende Hiebe -> Tiefe Wunden -> Offene Adern zugänglich sein. Vor der finalen Freigabe sind alternative Zugänge zu Offene Adern/Blutbad zu definieren, sodass alle drei Startwege eine realistische, punktökonomisch konkurrenzfähige Route zum Endtalent haben. Die in V2.1 dokumentierten gegenteiligen Voraussetzungen gelten als überholt. Die Gesamtstruktur (7 Reihen, 18 Talente, 64 Ränge, 51 verfügbare Punkte, 2 aktive Spezialisierungsfähigkeiten) bleibt bestehen.

## Schattenmacht und Unbezwingbar – vollständige Talententwürfe V1.0 (18.10.2026; NICHT freigegeben)

**Gemeinsame Regeln:** Je 7 Reihen mit Schwellen 0/5/10/15/20/25/30 Punkte im jeweiligen Zweig; 18 Talentknoten und 68 mögliche Ränge pro Zweig, aber 51 Spezialisierungspunkte über alle drei Zweige zusammen. Jeweils genau zwei aktive Fähigkeiten: Reihe 3 (frühestens Punkt 11) und Reihe 7 (frühestens Punkt 31). Rüstungsbruch 5/5 ist in Reihe 2 jedes Zweigs; seine +1 Prozentpunkt Verteidigungsreduktion pro Rang stapelt mit Rüstungsbruch aus anderen Zweigen. Direkte Talentvoraussetzungen und konkrete Balancezahlen werden vor Freigabe ausgearbeitet. Die Entwürfe sollen Blutrausch nicht duplizieren: Schattenmacht = Flüche, Debuffs, Schattenmagie und indirekte Schadensverstärkung; Unbezwingbar = Lebensraub, Verteidigung und lange Kämpfe. Früh zugängliche Talente müssen für Hybrid-Builds attraktiv sein.

### Schattenmacht (18 Knoten, 68 Ränge)
| Reihe | Talent | Max. | Entwurfswirkung |
|---|---|---:|---|
| 1 | Schattenberührung | 5 | Normale Angriffe verursachen zusätzlichen Schattenschaden |
| 1 | Fluch der Schwäche | 5 | Angriffe können gegnerischen Schaden senken |
| 1 | Dunkle Erkenntnis | 5 | Mehr Schaden gegen geschwächte Gegner |
| 2 | Rüstungsbruch | 5 | Verbessert Vernichtender Hieb |
| 2 | Verfluchte Wunden | 3 | Verfluchte Gegner erleiden mehr Schaden aus allen Quellen, auch Blutungen |
| 2 | Schattenecho | 3 | Schatteneffekte können Zusatzschaden auslösen |
| 3 | Schattenfluch **AKTIV** | 1 | Starker Fluch auf ein Ziel |
| 3 | Seelenbrand | 5 | Schattenschaden verstärkt laufende Flüche |
| 3 | Dunkler Sog | 3 | Verfluchte Gegner verlieren Angriffstempo |
| 4 | Verderbnis | 5 | Flüche verursachen Schaden über Zeit |
| 4 | Seelenfessel | 3 | Kritische Treffer schwächen verfluchte Gegner zusätzlich |
| 4 | Schwarze Magie | 5 | Mehr Schattenschaden gegen geschwächte Gegner |
| 5 | Fluchmeister | 5 | Verstärkt aktive Flüche |
| 5 | Seelenraub | 3 | Kills an verfluchten Gegnern stärken nächsten Schattenangriff |
| 5 | Schattenrüstung | 3 | Verfluchte Gegner verursachen weniger Schaden |
| 6 | Ewige Verdammnis | 5 | Flüche dauern länger und werden stärker |
| 6 | Abgrundmacht | 3 | Mehr Schaden gegen mehrfach geschwächte Gegner |
| 7 | Finsternis **AKTIVES ENDTALENT** | 1 | Entfesselt Schatteneffekte und schwächt das Ziel massiv |

### Unbezwingbar (18 Knoten, 68 Ränge)
| Reihe | Talent | Max. | Entwurfswirkung |
|---|---|---:|---|
| 1 | Eisenwille | 5 | Maximale Lebenspunkte |
| 1 | Vampirische Klinge | 5 | Lebensraub auf direkte Angriffe |
| 1 | Gehärtete Rüstung | 5 | Verteidigung |
| 2 | Rüstungsbruch | 5 | Verbessert Vernichtender Hieb |
| 2 | Zäher Widerstand | 3 | Weniger erlittener Schaden |
| 2 | Blutpakt | 3 | Mehr Heilung aus Lebensraub |
| 3 | Schildbrecher **AKTIV** | 1 | Schwerer Angriff schwächt Gegner und schützt den Krieger |
| 3 | Unbeugsamer Körper | 5 | Lebensregeneration |
| 3 | Vergeltung | 3 | Chance auf Gegenangriff bei erlittenem Schaden |
| 4 | Kampfrausch | 5 | Kritische Treffer verstärken Lebensraub kurzzeitig |
| 4 | Stahlhaut | 3 | Schadensreduktion bei niedrigem Leben |
| 4 | Standhaftigkeit | 5 | Reduktion besonders starker Treffer |
| 5 | Unsterblicher Wille | 5 | Stärkere Heilung bei niedrigem Leben |
| 5 | Zorn der Gefallenen | 3 | Erlittener Schaden stärkt nächsten Angriff |
| 5 | Knochenpanzer | 3 | Zeitweiser zusätzlicher Schutz |
| 6 | Ewiger Krieger | 5 | Heilung und Schadensreduktion in langen Kämpfen |
| 6 | Letzter Atemzug | 3 | Kann tödlichen Treffer abfangen, langer interner Cooldown |
| 7 | Unbezwingbar **AKTIVES ENDTALENT** | 1 | Kurzzeitig massive Schadensreduktion und Selbstheilung |

**Build-Tests für die nächste Designiteration:** 31 Blutrausch / 20 Schattenmacht, 31 Blutrausch / 20 Unbezwingbar, 31 Blutrausch / 10 Schattenmacht / 10 Unbezwingbar und 51 Punkte in einem einzigen Zweig. Der erste aktive Talentknoten aus einem fremden Zweig erfordert dort 11 investierte Punkte, sodass 31/10/10 ausschliesslich Blutiger Ansturm und Blutbad als zusätzliche aktive Fähigkeiten hat. Das Vier-Skill-Limit bleibt unverändert.

## Build-Vergleich und Balance-Leitplanken V1.0 (18.10.2026; Analyse, keine Freigabe)

Verglichen werden vier legale 51-Punkte-Verteilungen: **51/0/0** (reiner Blutberserker), **31/20/0** (Schattenberserker), **31/0/20** (Unsterblicher Berserker), **31/10/10** (Allround-Hybrid), Reihenfolge Blutrausch/Schattenmacht/Unbezwingbar. Der 31-Punkte-Blutrausch-Entwurf des Nutzers dient als Testgrundlage; Talentvoraussetzungen müssen vor dem Implementieren endgültig festgelegt werden.

| Build | Soll-Profil | Bewusster Nachteil | Zusätzliche aktive Skills |
|---|---|---|---|
| 51/0/0 | Höchster eigener Blutungs-/Direktschaden | Geringe Überlebensfähigkeit | Blutiger Ansturm, Blutbad |
| 31/20/0 | Hoher Schaden durch Flüche und Blutungs-Synergien | Weniger Eigenschaden als rein Blutrausch; Fluch-Setup | Blutiger Ansturm, Blutbad, Schattenfluch (wenn erworben) |
| 31/0/20 | Hohe Ausdauer und Boss-Sicherheit | Niedrigere Killgeschwindigkeit | Blutiger Ansturm, Blutbad, Schildbrecher (wenn erworben) |
| 31/10/10 | Flexible Mischung aus frühen passiven Offensiv- und Defensivboni | Kein tiefes Nebentalent, kein weiterer aktiver Skill | Blutiger Ansturm, Blutbad |

**Balancing-Anforderungen:**
1. Reiner Blutrausch muss durch weitere 20 Punkte im Hauptzweig spürbar mehr offensives Potenzial erhalten; Blutbad darf nicht automatisch der Punkt sein, ab dem jeder optimale Build wechseln muss.
2. Schattenmacht darf keinen dauerhaft kostenlosen, universellen Schadensmultiplikator bereitstellen, der alle anderen Optionen verdrängt. *Verfluchte Wunden* braucht eine relevante Bedingung, z. B. aktiver Fluch, begrenzte Wirkzeit oder begrenzte Stapelung.
3. Unbezwingbar braucht Grenzen bei Lebensraub/Schadensreduktion, damit defensive Hybrid-Builds nicht unangreifbar werden.
4. Die ersten 5–10 Punkte jedes Zweigs sollen eigenständig funktionieren, damit sich Hybrid-Investitionen schon vor Reihe 3 lohnen.
5. **Noch keine numerische Siegbehauptung:** Ohne finale Zahlen und Kampfsimulation sind die Profile Designziele, keine empirisch bestätigten Rankings.
6. Vier-Skill-Hardcap und die je zwei aktiven Fähigkeiten pro Zweig bleiben unverändert.

## Drei gleichwertige Spezialisierungsidentitäten – Kurskorrektur (18.10.2026; Designrichtung, Detailwerte Entwurf)

**Problem:** Die bisherigen Bäume wurden zu stark um Blutbad als Hauptziel herum entworfen. Schattenmacht und Unbezwingbar dürfen keine blossen Support-Zweige für Blutrausch sein. Jede Spezialisierung muss mit 31 Punkten ein eigenständiges, begehrenswertes Endtalent und mit 51 Punkten einen konkurrenzfähigen vollständigen Build bieten.

- **Blutrausch:** Blutungsstapel von Reihe 1 an; Endfähigkeit **Blutbad** entfesselt angesammelte Blutungen. Offensive Stärke, dafür verwundbar und auf Vorbereitung angewiesen.
- **Schattenmacht:** **Schattenmale** als eigenständige Kernmechanik von Reihe 1 an; Flüche, magischer Schaden, Kontroll-/Schwächungseffekte; Endfähigkeit **Finsternis** löst Schattenmale in mächtigen Schattenexplosionen aus. Kein Blutrausch nötig.
- **Unbezwingbar:** **Kampfentschlossenheit** als eigenständige Kernmechanik von Reihe 1 an, erzeugt durch erlittene bzw. abgewehrte Treffer; nutzbar für Gegenangriffe, Schutz und Heilung; Endfähigkeit **Letzte Bastion** nutzt diese Ressource für eine starke defensive und offensive Phase. Kein Blutrausch nötig. Der frühere Entwurfsname des Endtalents 'Unbezwingbar' wird durch 'Letzte Bastion' ersetzt.
- **Hybrid-Builds:** Frühe Zweig-Talente bieten sinnvolle Wechselwirkungen, ohne dass eine Kernmechanik eines anderen Zweigs Pflicht wird. Reine 51/0/0-, 0/51/0- und 0/0/51-Builds müssen gleichwertige, aber unterschiedlich starke Szenarien besitzen. 31/20-Hybride sind Alternativen, nicht automatisch optimal.
- **Zu prüfen:** Endfähigkeiten anhand Boss-, Wellen-, kurzer und langer Kämpfe numerisch testen; keine objektive Gleichwertigkeit behaupten, bevor Simulationen existieren.
- **Unverändert:** 7 Reihen, 51 Gesamtpunkte, 2 aktive Skills pro Zweig in Reihen 3 und 7, höchstens 3 zusätzliche aktive Skills, Rüstungsbruch in Reihe 2 aller drei Zweige. Bestehende 18-Knoten-Entwürfe für Schattenmacht/Unbezwingbar müssen in einer nächsten Iteration auf die neuen Kernmechaniken angepasst werden.

## Talentvielfalt nach WoW-Classic-Vorbild (18.10.2026; Nutzerwunsch)

**Wichtige Ergänzung zur Spezialisierungsidentität:** Nicht alle Talente eines Zweigs müssen auf seine Kernmechanik einzahlen. Jeder Spezialisierungsbaum soll eine durchdachte Mischung aus **allgemeinen passiven Kampfboni**, **spezialisierungstypischen Effekten** und **besonderen proccenden bzw. regelverändernden Talenten** bieten. Beispiele: kritische Trefferchance, Angriffstempo, Zweihandwaffenschaden, Rüstung, maximale Lebenspunkte, Abklingzeitverkürzung, Gegenangriffe, Chancen auf zusätzliche Angriffe oder vollständiges Abwehren. Dies ist ausdrücklich zusätzlich zum einfachen, neun Talente umfassenden allgemeinen Klassenkern erlaubt. Die drei Spezialisierungen behalten eine klare Identität (Blutungen / Schattenmale und Flüche / Kampfentschlossenheit), sollen aber nicht monothematisch werden. **Hybrid-Talente** sollen auch ohne fremde Endfähigkeit Nutzen haben. Das konkrete Verhältnis allgemeiner zu spezialisierter Talente wird nach Spielgefühl und Balance bestimmt, nicht als starre Quote.

## WoW-Classic-Krieger als primäre Referenz für die nächste Talentbaum-Revision (18.10.2026)

**Nutzerentscheidung:** Bei der Neugestaltung der drei Spezialisierungen ausdrücklich am **Krieger aus World of Warcraft Classic** orientieren, insbesondere an dessen Talentbäumen **Waffen (Arms), Furor (Fury) und Schutz (Protection)**. Nicht identisch kopieren, sondern die Struktur, Vielfalt, Hybrid-Anreize, frühen generischen Talente, verknüpften Talente und tiefen Spezialisierungsbelohnungen adaptieren. Die eigenständige Dark-Fantasy-Identität des Spiels bleibt bestehen.

- **Blutrausch:** Inspiration aus Waffen/Furor: Zweihandwaffenschaden, Blutungen, kritische Treffer, Angriffstempo, aggressive Procs.
- **Schattenmacht:** Inspiration aus offensiven Waffen-/Furor-Mechaniken, jedoch eigenständig mit Schattenmagie, Flüchen und Schattenmalen.
- **Unbezwingbar:** Inspiration aus Schutz: Rüstung, Blocken/Abwehren, Gegenangriffe, Zähigkeit; zusätzlich Lebensraub als eigene Spielidentität.
- Frühreihen enthalten sowohl eigenständig brauchbare allgemeine Boni als auch Spezialmechaniken; spätere Reihen bringen starke, verzweigte Synergien. 51/0/0, 0/51/0 und 0/0/51 sollen jeweils interessant sein, 31/20-Hybride ebenfalls.
- Die zuvor dokumentierten 18-Knoten-Listen sind **Arbeitsentwürfe**, nicht final freigegeben. Bei der nächsten vollständigen Überarbeitung sollen auch Talentverbindungen und Zahlen auf mathematische Erreichbarkeit geprüft werden.
- Weiterhin verbindlich: 7 Reihen, 51 Punkte über alle drei Zweige, Reihe-3- und Reihe-7-Aktivtalente, höchstens drei zusätzlich zur Startfähigkeit erlernbare aktive Fähigkeiten, Rüstungsbruch 5/5 in Reihe 2 aller drei Bäume.

## Kernmechaniken zuerst – Designpriorität (18.10.2026; zur Diskussion)

**Arbeitsreihenfolge:** Vor weiteren Talentlisten zuerst die eigenständigen Kernmechaniken der drei Dunkler-Krieger-Spezialisierungen festlegen, mit Trigger, Stapel-/Ressourcenlogik, Belohnung, Gegenrisiko und Verhalten bei kurzen bzw. langen Kämpfen. Allgemeine WoW-Classic-inspirierte Talente erst danach ergänzen.

1. **Blutrausch – Blutungen:** Angriffe lösen zeitlich begrenzten Schaden über Zeit aus, mehrere Blutungsstapel können gleichzeitig wirken. Spätere Fähigkeiten können Stapel verstärken oder für unmittelbaren Schaden verwerten. Offensive Identität.
2. **Schattenmacht – Schattenmale und Flüche:** Schattenangriffe erzeugen Male am Gegner; Flüche schwächen ihn. Male können für starke Schatteneffekte verbraucht oder in längeren Kämpfen genutzt werden. Eigenständiger Spielstil ohne Blutungen.
3. **Unbezwingbar – Kampfentschlossenheit:** Erlittene oder abgewehrte Treffer bauen eine Ressource auf, die Gegenangriffe und Schutz-/Heileffekte verstärkt. Auch dieser Baum muss Gegner selbst besiegen können, ohne Blutrausch als Pflicht.

**Offen und ausdrücklich noch nicht beschlossen:** Konkrete Stapelgrenzen, Auslösewahrscheinlichkeiten, Schadensformeln, Verfallsregeln, Bossverhalten und die Balance zwischen kurzen und langen Kämpfen. Die Mechaniken sind Vorschläge zur Nutzerfreigabe; keine endgültigen Implementierungsvorgaben.

## Gemeinsame Kampfeffekte – mathematischer Basisentwurf V1.0 (18.10.2026; vorläufig, Balancetest ausstehend)

**Grundsatz:** Keine zusätzlichen klassenspezifischen Ressourcenleisten. Stattdessen universell auswertbare Buffs/Debuffs, die durch frühe Talente jeder Spezialisierung verfügbar werden. Mechaniken funktionieren unabhängig voneinander und können kombiniert werden.

| Mechanik | Träger | Dauer | Stapelgrenze | Basiswirkung |
|---|---|---:|---:|---|
| **Blutung** (Blutrausch) | Gegner | 6 s pro Stapel | 5 | Jeder Stapel verursacht insgesamt **30 % des Angriffsschadens zum Auslösezeitpunkt** über seine 6 s; Stapel haben unabhängige Laufzeiten |
| **Verderbnis** (Schattenmacht) | Gegner | 8 s pro Stapel | 3 | **+3 % erlittener Schaden pro Stapel**, maximal +9 %; gilt für direkte Angriffe, Schattenmagie, Blutungen und Gegenangriffe; Stapel laufen unabhängig |
| **Kampfentschlossenheit** (Unbezwingbar) | Spieler | 8 s pro Stapel | 5 | **−2 % erlittener Schaden pro Stapel**, maximal −10 %; entsteht durch erfolgreiche eigene Angriffe und abgewehrte Treffer, spätere Talente können Gegenangriffe damit verstärken |

**Rechenbeispiele ohne sonstige Modifikatoren:** Bei 100 Angriffsschaden entsprechen fünf volle Blutungsstapel **150 Schaden über deren gesamte jeweilige Laufzeit**, nicht 150 DPS. Drei Verderbnisstapel multiplizieren relevanten ausgeteilten Schaden mit **1,09**. Fünf Entschlossenheitsstapel multiplizieren relevanten eingehenden Schaden mit **0,90**. Diese Prozentwerte sind zunächst **additiv innerhalb derselben Mechanik** und wirken als getrennte Multiplikatoren zu anderen Mechaniken; keine unbeschränkte multiplikative Stapelung pro Einzelstapel.

**Noch auszuarbeiten vor Implementierung:** Präzise Auslösechancen und Trigger (insbesondere Entschlossenheit ohne Gegnerangriff), Taktfrequenz für Schaden über Zeit, Überschreiben/Refresh bei maximalen Stapeln, Verhalten bei Zielwechsel und Tod, Reihenfolge mit Verteidigung, Crit und Rüstungsbruch, mögliche Caps aus weiteren Talenten, Schadensvergleich über kurze und lange Kämpfe. Die hier angegebenen Zahlen sind **Balance-Startwerte, nicht freigegeben oder getestet**.


## Tatsächlicher Entwicklungsstand – V0.2.1 (18.10.2026, Entwicklungsbranch)

**Branch:** `feature/talent-run-stability-20261018`. Dieser Abschnitt dokumentiert Implementierung, **keine neue Freigabe** der weiter oben als Entwurf markierten detaillierten Talentlisten oder Zahlenwerte.

- Der bestehende Dunkle-Krieger-Talentplaner nutzt einen einzigen Spezialisierungspool mit maximal 51 **dauerhaft gekauften** Punkten. Der erste neue Punkt kostet 5 Klassenseelen; jeder weitere folgt `ceil(5 × 1.15^n)` bei `n` bereits gekauften Punkten. Die Verteilung erfolgt nur zwischen Runs nach Freischaltung aller zehn Haupttalente. Ein kompletter Spezialisierungsreset kostet fest 500 permanente Münzen; die gekauften Punkte bleiben erhalten. Ein freies Einzelpunkt-Zurücknehmen ist deaktiviert.
- Die zehn Haupttalente werden über erstmalig erreichte Wellen-Meilensteine 5/10/…/50 freigeschaltet und zwischen Runs ausgewählt. Ihre derzeitigen **vorläufigen Testeffekte**: Angriff +5 %, HP +8 %, Verteidigung +5 %, Regeneration +12 %, Krit-Chance +3 Prozentpunkte, Krit-Schaden +10 Prozentpunkte, Angriffstempo +5 %, Lebensraub +2 %, Boss-Schaden +8 %, erlittenen Schaden −3 %. Die konkreten Balancing-Werte bedürfen Spielerfreigabe und Regressionstests.
- Klassenseelen werden beim Ende jedes Runs vergeben: unter Welle 5 null, sonst `floor((höchste_Welle / 5)^1.5)`. Wiederholte Runs werden vollständig belohnt. Die verdienten Seelen erscheinen in der Run-Zusammenfassung und werden gespeichert.
- **Kompatibilität:** Bestehende kostenlose Test-Builds werden beim ersten Laden einmalig auf die Zahl bereits investierter Spezialisierungspunkte angerechnet; die zehn Haupttalente werden dabei als Legacy-Teststand gewährt. Das ist **keine allgemeine Startbelohnung** für neue Spielstände. Ein aktiver Run verwendet einen gespeicherten Build-Snapshot. Talentplaner und Reset sind während des Runs gesperrt. Nach dem Run ist der Talentplaner direkt aus der Zusammenfassung erreichbar.
- Kampfeffekte (inklusive Cooldowns), Gegner-HP und Build-Snapshot werden mit dem Run lokal gespeichert. Wellenwechsel setzt Skills nicht zurück; ein Neustart des Browsers gewährt keinen frischen Cooldown. Pro aktiver Fähigkeit existiert ein eigenes Umschaltfeld: Manuell / Auto immer / Auto nur bei Bossen / Auto bei HP unter 45 % / Auto bei aktiver Blutung / Auto bei Verderbnis. Die vier Fähigkeitsslots ergeben sich derzeit automatisch aus bis zu drei aktiven Spezialtalenten plus Startfähigkeit.
- Erste technische Prüfungen: JavaScript-Syntax und simulierte Spiellogik für Cooldown über Wellenwechsel/Neuladen, Seelenbelohnung sowie Punkte-Kauf/Reset bestanden. **Ein echter Browser- und iPhone-Regressionstest steht weiterhin aus.**
- Noch **nicht** implementiert: vollwertiges Startmenü, Gegenstands-/Trank-/Inventarsystem, Spielstand-Export/-Import, vollständige Boss-KI, moderne Pixel-Art und viele weitere ursprünglich beschlossene Systeme. V0.2.1 stellt keinen kompletten Featureumfang des geplanten Idle-RPG dar. Die oben als Entwurf gekennzeichneten WoW-Classic-Talentneuordnungen sind **noch nicht umgesetzt oder freigegeben**.
