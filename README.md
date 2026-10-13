# Industrie 4.0 AR Mockup

Clientseitige AR-Wartungs-Web-App im Handyformat mit einer `index.html`. Die Startseite zeigt echte OPC-UA-Vibrationswerte von P-101 über einen WebSocket. AR-Maschinenansicht, deren Bewertung, CSV-Export und Historientabelle bleiben ausdrücklich simulierte Demo-Daten. Der Marker-Scan nutzt A-Frame 1.4 und AR.js 3.4.5.

## Live-Daten mit localhost.run (Aufgabe 2)

Voraussetzung: Node-RED läuft auf dem Pi auf Port 1880. Der oberste Ausgang des OPC-UA-Clients ist mit einem `websocket out` verbunden. Dessen Typ ist **Listen on**, der Pfad **`/ws/vibration`**, gesendet wird nur **`msg.payload`**. Deploy ausführen.

Die App verarbeitet die in dieser Aufgabe beobachtete Nachricht:

```json
{
  "value": {"dataType":"Double", "arrayType":"Scalar", "value":8.318524832544417},
  "statusCode": {"value":0},
  "sourceTimestamp":"2026-10-13T11:43:45.823Z"
}
```

Das Beispiel ist eine Testnachricht, kein laufender Feed. Die App erfindet keine Einheit oder Wartungsbewertung für diese Live-Werte.

### 1. Weiterleitung auf dem Raspberry Pi starten

Repository nach Übernahme der Änderung auf den Pi laden:

```sh
git clone https://github.com/arturbbk/industrie-4.0-ar-mockup.git
cd industrie-4.0-ar-mockup
node websocket-tunnel.cjs
```

Bei einem bestehenden Checkout stattdessen zuerst `git pull --ff-only` verwenden.

Dieses Terminal geöffnet lassen. Die Weiterleitung verwendet nur die in Node.js enthaltenen Module und hört auf `127.0.0.1:1881`. Sie erlaubt ausschließlich den WebSocket-Pfad `/ws/vibration`. Der Node-RED-Editor und andere HTTP-/WebSocket-Pfade werden nicht weitergeleitet.

### 2. localhost.run in einer zweiten SSH-Verbindung auf dem Pi starten

```sh
ssh -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 -R 80:127.0.0.1:1881 localhost.run
```

Die tatsächlich ausgegebene HTTPS-Adresse kopieren. Auch dieses Terminal geöffnet lassen. localhost.run übernimmt die TLS-Verschlüsselung. Der Tunnel ist öffentlich; hier werden nur die Demo-Vibrationswerte der Aufgabe übertragen. Kein Passwort für das Pi-Konto an localhost.run übermitteln. Wenn SSH eine Anmeldung ablehnt, die konkrete Meldung prüfen; es ist nicht das Pi-SSH-Passwort gefragt.

### 3. Webapp verbinden

1. Die `index.html` im Browser öffnen (für die Kamera über HTTPS oder localhost).
2. **Einstellungen → Live-Daten über localhost.run** öffnen.
3. Die HTTPS-Adresse aus Schritt 2 einfügen und **Verbinden** wählen.
4. Die App wechselt automatisch von `https://` zu `wss://` und ergänzt bei einer reinen Domain den Pfad `/ws/vibration`.
5. Auf der **Startseite** erscheinen der empfangene Vibrationswert, der OPC-UA-Qualitätsstatus und die Quellzeit (in lokaler Browserzeit). Die vollständige Quellzeit steht im Tooltip.

Die Adresse und die aktivierte Verbindung werden nur in diesem Browser gespeichert. Die App verbindet sich nach einer Unterbrechung erneut. **Trennen** beendet auch automatische Wiederverbindungsversuche. Bei einem neuen kostenlosen Tunnel kann sich die Adresse ändern; dann in den Einstellungen aktualisieren. Vorherige Werte sind bei einer Unterbrechung ausdrücklich als letzter Empfang gekennzeichnet. Nach 15 Sekunden ohne neue Nachricht wird dies angezeigt; eine OPC-UA-Subscription kann auch bei unveränderten Werten keine neue Nachricht senden.

Eine HTTPS-Seite kann keine unverschlüsselte `ws://`-Adresse verwenden. Die App meldet diesen Fall vor dem Verbindungsversuch. Für einen lokalen Test auf einer HTTP-Seite funktioniert auch `ws://10.149.41.10:1880/ws/vibration`, solange das weiterhin die IP des Pi ist.

### Prüfen

- In Node-RED muss im Debug-Ausgang weiterhin der OPC-UA-Wert mit `Good` eintreffen.
- Die Webapp zeigt **Live-Daten empfangen** und denselben Wert (gerundet).
- Tunnel kurz beenden: Die App meldet die Unterbrechung und zeigt den alten Wert nicht als neue Messung.
- Über den Tunnel liefern `/` und `/flows` HTTP 404; sie öffnen nicht den Editor.

Offizielle Tunnel-Dokumentation: https://localhost.run/docs/http-tunnels/ und https://localhost.run/docs/cli/

## Weitere Aufgabenschritte

Dieser Stand implementiert die WebSocket-Anzeige. MQTT über HiveMQ, Datenbankspeicherung, REST-Endpunkt für die letzten fünf Minuten und echte historische Daten sind noch nicht implementiert. Die Historienansicht ist entsprechend als Demo gekennzeichnet.

## AR-Demo

- Startseite: Live-Daten, QR-/Marker-Scan, manuelle Maschinenauswahl, Historie
- Maschinenansicht: simulierte rohe und ausgewertete Sensordaten, CSV-Export der Demo-Werte
- Historie: Beispieldaten, filterbar nach Maschine
- Einstellungen: Tunnel-Verbindung, Hell/Dunkel, simuliertes Ticket

Die Kamera funktioniert nur über HTTPS oder `localhost`, z. B.:

```sh
npx serve .
```

Ohne Kamera lässt sich der Ablauf im Scan-Bildschirm über „Ohne Kamera testen“ durchspielen. In der Konsole gibt es außerdem `fireEventMarkerFound(i)` und `fireEventMarkerLost()`.

## Marker used

- Hiro (öffnet M-101): https://de.wikiversity.org/wiki/Datei:Hiro_marker_ARjs.png
- Kanji (öffnet M-204): AR.js-Preset `kanji`
