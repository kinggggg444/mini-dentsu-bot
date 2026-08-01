const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');
const { Boom }   = require('@hapi/boom');
const pino       = require('pino');
const fs         = require('fs-extra');
const path       = require('path');
const config     = require('./config');
const store      = require('./store');
const { handleMessage } = require('./handler');

const SESSION_DIR = path.resolve(config.SESSION_PATH);

async function startBot() {
  await fs.ensureDir(SESSION_DIR);
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version }          = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys : makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
    },
    logger                      : pino({ level: 'silent' }),
    printQRInTerminal           : false,
    browser                     : ['DENTSU MD V10', 'Chrome', '10.0.0'],
    connectTimeoutMs            : 60_000,
    defaultQueryTimeoutMs       : 60_000,
    keepAliveIntervalMs         : 15_000,
    generateHighQualityLinkPreview: true,
    syncFullHistory             : false,
    markOnlineOnConnect         : true,
  });

  // ── Pairing code ──────────────────────────────────────────────────
  if (!sock.authState.creds.registered) {
    const number = config.OWNER_NUMBER.replace(/[^0-9]/g, '');
    setTimeout(async () => {
      try {
        const code      = await sock.requestPairingCode(number);
        const formatted = code.match(/.{1,4}/g).join('-');
        store.setPairingCode(formatted);
        console.log('\x1b[32m');
        console.log('╔══════════════════════════════════╗');
        console.log('║   🔑 CODE DE COUPLAGE WHATSAPP   ║');
        console.log('║                                  ║');
        console.log(`║        ${formatted.padEnd(24)}║`);
        console.log('║                                  ║');
        console.log('║  WA → Appareils liés → Lier      ║');
        console.log('║  avec numéro de téléphone        ║');
        console.log('╚══════════════════════════════════╝');
        console.log('\x1b[0m');
      } catch (e) {
        console.error('[BOT] Pairing code error:', e.message);
        setTimeout(() => startBot(), 8_000);
      }
    }, 4_000);
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const code = lastDisconnect?.error instanceof Boom
        ? lastDisconnect.error.output?.statusCode
        : 0;
      const reconnect = code !== DisconnectReason.loggedOut;
      console.log(`\x1b[31m[BOT] Déconnecté (code ${code}).\x1b[0m`, reconnect ? 'Reconnexion...' : 'Session expirée.');
      if (reconnect) setTimeout(() => startBot(), 5_000);
    } else if (connection === 'open') {
      store.setPairingCode(null);
      console.log('\x1b[32m[BOT] ✅ Connecté à WhatsApp !\x1b[0m');
    } else if (connection === 'connecting') {
      console.log('\x1b[33m[BOT] Connexion en cours...\x1b[0m');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      if (!msg.message) continue;
      if (msg.key.fromMe) continue;
      await handleMessage(sock, msg).catch(e => console.error('[HANDLER]', e.message));
    }
  });

  return sock;
}

module.exports = { startBot };
