# Industrie 4.0 AR Mockup

Clientseitiges Mockup einer AR-Webapp im Handyformat für die Station **Befüllen** (CPS-i40-Modul). Eine einzige `index.html`, kein Backend, alle Werte simuliert. Der Marker-Scan nutzt A-Frame 1.4 und AR.js 3.4.5.

Die App zeigt das Soll-Konzept: Im Ist-Zustand verlassen die Daten die SPS nicht (nur HMI-Anzeige). Geplant ist SPS → OPC UA → Gateway → Web-API → Smartphone.

## Funktionen

- Startseite: QR-Code scannen, Maschine manuell auswählen, Historie
- Maschinenansicht (Station Befüllen), live simulierter Befüllzyklus:
  - Ausgewertet: Arbeitsschritt, RFID-Auftrag, Tara/Brutto/Netto (mit Soll), Kugelmagazine rot/grün/blau
  - Rohdaten mit Betriebsmittelkennzeichen: Gewichtssensor +AN-BW1, Lichttaster +AM-BG1/BG2, Reedsensoren Stopper +AM-BG3/BG4, Lichttaster Kugel +AM-BG8–BG10, Magazinsensoren +AM-BG11–BG13, Reedsensoren Waage +AN-BG1/BG2, RFID
  - CSV-Export aller Signale der Sitzung, Fehler melden
- Historie: vergangene Befüllungen, Filter auf Abweichungen
- Einstellungen: Hell/Dunkel, Fehlermeldung ans Ticketsystem nach Bauteil (simuliert)

## Starten

Die Kamera funktioniert nur über HTTPS oder `localhost`, z. B. GitHub Pages oder:

```sh
npx serve .
```

Ohne Kamera lässt sich der Ablauf im Scan-Bildschirm über „Ohne Kamera testen“ durchspielen. In der Konsole gibt es außerdem `fireEventMarkerFound()` und `fireEventMarkerLost()`.

## Marker used

- Hiro (öffnet Station Befüllen): https://de.wikiversity.org/wiki/Datei:Hiro_marker_ARjs.png
