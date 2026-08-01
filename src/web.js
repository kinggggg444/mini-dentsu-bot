const express = require('express');
const cors    = require('cors');
const path    = require('path');
const config  = require('./config');
const store   = require('./store');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));

app.get('/api/status', (_req, res) => {
  res.json({
    bot    : config.BOT_NAME,
    version: config.VERSION,
    code   : store.getPairingCode(),
    sessions: store.sessionCount(),
    online : true,
  });
});

app.get('/api/code', (_req, res) => {
  const code = store.getPairingCode();
  if (code) return res.json({ success: true, code });
  res.json({ success: false, message: 'Code pas encore disponible, patiente...' });
});

function startWebServer() {
  app.listen(config.PORT, () =>
    console.log(`\x1b[36m[WEB] Serveur → http://localhost:${config.PORT}\x1b[0m`)
  );
}

module.exports = { startWebServer };
