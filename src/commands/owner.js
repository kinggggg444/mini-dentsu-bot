const config  = require('../config');
const moment  = require('moment-timezone');
const IMG = config.MENU_IMAGE;
const startTime = Date.now();

module.exports = {
  ping: async ({ sock, from, msg }) => {
    const t = Date.now();
    await sock.sendMessage(from, { text: '🏓 Pong...' }, { quoted: msg });
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🏓 *Pong!*\nLatence : *${Date.now()-t}ms*\n🤖 ${config.BOT_NAME}`,
    }, { quoted: msg });
  },

  alive: async ({ sock, from, msg }) => {
    const up = Math.floor((Date.now()-startTime)/1000);
    const h  = Math.floor(up/3600), m = Math.floor((up%3600)/60), s = up%60;
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `✅ *${config.BOT_NAME} est en ligne !*\n\n⏱️ Uptime : ${h}h ${m}m ${s}s\n👨‍💻 Dev : ${config.DEV_NAME}\n🌐 ${config.WEBSITE}`,
    }, { quoted: msg });
  },

  runtime: async ({ sock, from, msg }) => {
    const up = Math.floor((Date.now()-startTime)/1000);
    const d  = Math.floor(up/86400), h = Math.floor((up%86400)/3600), m = Math.floor((up%3600)/60), s = up%60;
    await sock.sendMessage(from, { text: `⏱️ *Runtime : ${d}j ${h}h ${m}m ${s}s*` }, { quoted: msg });
  },

  mode: async ({ sock, from, msg, args, isOwner }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    const m = args[0];
    if (!['public','self'].includes(m)) return sock.sendMessage(from, { text: '❓ Usage: .mode public | .mode self' }, { quoted: msg });
    config.MODE = m;
    await sock.sendMessage(from, { text: `✅ Mode changé : *${m}*` }, { quoted: msg });
  },

  public: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    config.MODE = 'public';
    await sock.sendMessage(from, { text: '🌍 Mode *public* activé.' }, { quoted: msg });
  },

  self: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    config.MODE = 'self';
    await sock.sendMessage(from, { text: '🔒 Mode *self* activé.' }, { quoted: msg });
  },

  ban: async ({ sock, from, msg, isOwner, args }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant || (args[0] && args[0]+'@s.whatsapp.net');
    if (!target) return sock.sendMessage(from, { text: '❓ Réponds ou donne un numéro.' }, { quoted: msg });
    await sock.sendMessage(from, { text: `🚫 @${target.split('@')[0]} banni.`, mentions: [target] }, { quoted: msg });
  },

  unban: async ({ sock, from, msg, isOwner, args }) => {
    if (!isOwner) return;
    const target = args[0] && args[0].replace(/[^0-9]/g,'')+('@s.whatsapp.net');
    if (!target) return sock.sendMessage(from, { text: '❓ Usage: .unban numéro' }, { quoted: msg });
    await sock.sendMessage(from, { text: `✅ @${args[0]} débanni.` }, { quoted: msg });
  },

  block: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) return sock.sendMessage(from, { text: '❓ Réponds au message.' }, { quoted: msg });
    await sock.updateBlockStatus(target, 'block');
    await sock.sendMessage(from, { text: `🚫 @${target.split('@')[0]} bloqué.`, mentions:[target] }, { quoted: msg });
  },

  unblock: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) return sock.sendMessage(from, { text: '❓ Réponds au message.' }, { quoted: msg });
    await sock.updateBlockStatus(target, 'unblock');
    await sock.sendMessage(from, { text: `✅ @${target.split('@')[0]} débloqué.`, mentions:[target] }, { quoted: msg });
  },

  delete: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    const q = msg.message?.extendedTextMessage?.contextInfo;
    if (!q) return sock.sendMessage(from, { text: '❓ Réponds au message à supprimer.' }, { quoted: msg });
    await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: q.stanzaId, participant: q.participant } });
  },

  setpp: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    const q = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const img = q?.imageMessage;
    if (!img) return sock.sendMessage(from, { text: '❓ Réponds à une image.' }, { quoted: msg });
    await sock.sendMessage(from, { text: '🖼️ Changement de photo de profil (bientôt disponible).' }, { quoted: msg });
  },

  autotyping: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    await sock.sendMessage(from, { text: '⌨️ Auto-typing (bientôt disponible).' }, { quoted: msg });
  },
};
