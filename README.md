# Industrie 4.0 AR Mockup

Clientseitiges Mockup einer AR-Wartungs-Web-App im Handyformat (eine `index.html`, kein Backend, alle Daten simuliert). Der QR-/Marker-Scan nutzt A-Frame 1.4 und AR.js 3.4.5.

## Funktionen

- Startseite: QR-Code scannen, Maschine manuell auswählen, Historie
- Maschinenansicht: aktuelle Maschine, Server-Status, Synchronisation, rohe und ausgewertete Sensordaten, CSV-Export, Fehlermeldung
- Historie: Tabelle mit alten Sensordaten, filterbar nach Maschine
- Einstellungen: Hell/Dunkel, Fehlermeldung ans Ticketsystem (simuliert)

## Starten

Die Kamera funktioniert nur über HTTPS oder `localhost`, z. B.:

```sh
npx serve .
```

Ohne Kamera lässt sich der Ablauf im Scan-Bildschirm über „Ohne Kamera testen“ durchspielen. In der Konsole gibt es außerdem `fireEventMarkerFound(i)` und `fireEventMarkerLost()`.

## Marker used

- Hiro (öffnet M-101): https://de.wikiversity.org/wiki/Datei:Hiro_marker_ARjs.png
- Kanji (öffnet M-204): AR.js-Preset `kanji`
