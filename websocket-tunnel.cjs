// Auf dem Raspberry Pi ausführen: node websocket-tunnel.cjs
// Leitet ausschließlich /ws/vibration an Node-RED weiter.
// Keine zusätzlichen npm-Pakete erforderlich.
'use strict';
const http = require('node:http');
const net = require('node:net');
const HOST = '127.0.0.1';
const PORT = 1881;
const TARGET_PORT = 1880;
const PATH = '/ws/vibration';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.writeHead(req.url === PATH ? 426 : 404);
  res.end(req.url === PATH ? 'WebSocket-Verbindung erforderlich.\n' : 'Nicht gefunden.\n');
});

server.on('upgrade', (req, client, head) => {
  // Auch Upgrade-Anfragen an Admin-API, Editor und andere Pfade ablehnen.
  if (req.method !== 'GET' || req.url !== PATH || req.headers.upgrade?.toLowerCase() !== 'websocket') {
    client.end('HTTP/1.1 404 Not Found\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
    return;
  }
  const upstream = net.connect({host:HOST, port:TARGET_PORT});
  const connectTimeout = setTimeout(() => { upstream.destroy(); client.destroy(); }, 5000);
  upstream.once('connect', () => {
    clearTimeout(connectTimeout);
    const headers = [
      `GET ${PATH} HTTP/1.1`,
      `Host: ${HOST}:${TARGET_PORT}`,
      'Connection: Upgrade',
      'Upgrade: websocket'
    ];
    for (const name of ['sec-websocket-key', 'sec-websocket-version', 'sec-websocket-protocol', 'sec-websocket-extensions', 'origin']) {
      const value = req.headers[name];
      if (typeof value === 'string') headers.push(`${name}: ${value}`);
    }
    upstream.write(headers.join('\r\n') + '\r\n\r\n');
    if (head.length) upstream.write(head);
    client.pipe(upstream).pipe(client);
  });
  const cleanup = () => { clearTimeout(connectTimeout); upstream.destroy(); client.destroy(); };
  client.on('error', cleanup);
  upstream.on('error', cleanup);
  client.once('close', cleanup);
  upstream.once('close', cleanup);
});

const clients = new Set();
server.on('connection', client => {
  clients.add(client);
  client.once('close', () => clients.delete(client));
  client.on('error', () => client.destroy());
});
server.on('error', error => {
  console.error(`Weiterleitung konnte nicht gestartet werden: ${error.message}`);
  process.exitCode = 1;
});
server.listen(PORT, HOST, () => {
  console.log(`WebSocket-Weiterleitung: ${HOST}:${PORT}${PATH} -> Node-RED ${HOST}:${TARGET_PORT}${PATH}`);
  console.log('In einer zweiten SSH-Sitzung auf dem Pi starten:');
  console.log(`ssh -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 -R 80:${HOST}:${PORT} localhost.run`);
});
function shutdown(){
  for (const client of clients) client.destroy();
  server.close();
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
