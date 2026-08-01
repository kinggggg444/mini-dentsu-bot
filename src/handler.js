const config  = require('./config');
const cmds    = require('./commands');

function getBody(msg) {
  const m = msg.message;
  if (!m) return '';
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.buttonsResponseMessage?.selectedButtonId ||
    m.templateButtonReplyMessage?.selectedId ||
    ''
  );
}

function getSender(msg) {
  return msg.key.participant || msg.key.remoteJid;
}

async function handleMessage(sock, msg) {
  const from    = msg.key.remoteJid;
  const isGroup = from?.endsWith('@g.us');
  const sender  = getSender(msg);
  const body    = getBody(msg);
  const isOwner = sender?.replace(/[^0-9]/g, '').includes(
    config.OWNER_NUMBER.replace(/[^0-9]/g, '')
  );

  if (config.MODE === 'self' && !isOwner) return;
  if (!body.startsWith(config.PREFIX))     return;

  const args = body.slice(config.PREFIX.length).trim().split(/\s+/);
  const cmd  = args.shift().toLowerCase();

  if (!cmds[cmd]) return;

  try {
    await cmds[cmd]({ sock, msg, from, sender, args, isOwner, isGroup, body, config });
  } catch (e) {
    console.error(`[CMD:${cmd}]`, e.message);
    await sock.sendMessage(from, { text: `❌ Erreur dans la commande *${cmd}*: ${e.message}` }, { quoted: msg });
  }
}

module.exports = { handleMessage };
