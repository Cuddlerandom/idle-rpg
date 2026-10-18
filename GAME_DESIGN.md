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

**Verbindliche Präzisierung (18.10.2026):** Der eine grosse Klassen-Talentbaum besteht aus einem **verpflichtenden gemeinsamen Hauptbaum mit 10 investierten Punkten** und danach **51 separaten Spezialisierungspunkten**. Die 51 Punkte werden erst nach Abschluss der 10 Hauptbaum-Punkte freigeschaltet und frei auf die drei Spezialisierungszweige verteilt. Somit sind maximal **61 investierte Punkte insgesamt** möglich, davon 10 im Hauptbaum und 51 in Spezialisierungen. Die bisherige Formulierung «51 Punkte insgesamt» wird hiermit ersetzt. Die WoW-artige 5-Punkte-Reihenschwelle gilt weiterhin je Spezialisierungszweig. **Noch offen:** Ob und wie die 10 Hauptbaum-Punkte gekauft bzw. verdient werden und ob die bestehende Seelenpreisformel ausschliesslich für die 51 Spezialisierungspunkte gilt.

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
