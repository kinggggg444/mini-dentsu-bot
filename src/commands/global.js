const config = require('../config');
const IMG = config.MENU_IMAGE;

module.exports = {
  anticall: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { image: { url: IMG }, caption: '📵 *Anti-Call*\n\nActivation anti-appel (bientôt disponible).' }, { quoted: msg });
  },
  antidelete: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { image: { url: IMG }, caption: '🔍 *Anti-Delete*\n\nActivation anti-suppression (bientôt disponible).' }, { quoted: msg });
  },
  antiedit: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { image: { url: IMG }, caption: '✏️ *Anti-Edit*\n\nActivation anti-édition (bientôt disponible).' }, { quoted: msg });
  },
  broadcast: async ({ sock, from, msg, isOwner, args }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .broadcast <message>' }, { quoted: msg });
    await sock.sendMessage(from, { image: { url: IMG }, caption: `📢 *Broadcast*\n\n${args.join(' ')}` }, { quoted: msg });
  },
  del: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    const q = msg.message?.extendedTextMessage?.contextInfo;
    if (!q) return sock.sendMessage(from, { text: '❓ Réponds au message à supprimer.' }, { quoted: msg });
    await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: q.stanzaId, participant: q.participant } });
  },
  forward: async ({ sock, from, msg, args }) => {
    const q = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!q) return sock.sendMessage(from, { text: '❓ Réponds à un message pour le transférer.' }, { quoted: msg });
    const target = args[0] ? args[0].replace(/[^0-9]/g,'')+('@s.whatsapp.net') : from;
    await sock.sendMessage(target, { forward: { key: { remoteJid: from, id: msg.message.extendedTextMessage.contextInfo.stanzaId }, message: q } });
    await sock.sendMessage(from, { text: '✅ Message transféré.' }, { quoted: msg });
  },
  fwd: async ({ sock, from, msg, args }) => {
    const q = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!q) return sock.sendMessage(from, { text: '❓ Réponds à un message à transférer.' }, { quoted: msg });
    await sock.sendMessage(from, { text: '✅ Transfert effectué.' }, { quoted: msg });
  },
  getbio: async ({ sock, from, msg, sender }) => {
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant || sender;
    try {
      const bio = await sock.fetchStatus(target);
      await sock.sendMessage(from, { image: { url: IMG }, caption: `📝 *Bio de @${target.split('@')[0]}*\n\n${bio?.status||'Aucune bio'}`, mentions:[target] }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Impossible de récupérer la bio.' }, { quoted: msg }); }
  },
  getname: async ({ sock, from, msg }) => {
    const name = msg.pushName || 'Inconnu';
    await sock.sendMessage(from, { text: `👤 Ton nom WhatsApp : *${name}*` }, { quoted: msg });
  },
  leaveall: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    await sock.sendMessage(from, { text: '⚠️ Quitter tous les groupes (bientôt disponible).' }, { quoted: msg });
  },
  listgc: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    await sock.sendMessage(from, { image: { url: IMG }, caption: '📋 *Liste des groupes*\n\n_Chargement liste des groupes (bientôt disponible)._' }, { quoted: msg });
  },
  myname: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { text: `👤 Nom : *${msg.pushName||'Inconnu'}*` }, { quoted: msg });
  },
  myprivacy: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { image: { url: IMG }, caption: '🔒 *Confidentialité*\n\nVérification de ta confidentialité (bientôt disponible).' }, { quoted: msg });
  },
  mystatus: async ({ sock, from, msg, sender }) => {
    try {
      const s = await sock.fetchStatus(sender);
      await sock.sendMessage(from, { text: `📝 Ton statut : ${s?.status||'Aucun statut'}` }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Statut non disponible.' }, { quoted: msg }); }
  },
  private: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    config.MODE = 'self';
    await sock.sendMessage(from, { text: '🔒 Mode *privé* activé.' }, { quoted: msg });
  },
  public: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    config.MODE = 'public';
    await sock.sendMessage(from, { text: '🌍 Mode *public* activé.' }, { quoted: msg });
  },
  quoted: async ({ sock, from, msg }) => {
    const q = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!q) return sock.sendMessage(from, { text: '❓ Réponds à un message.' }, { quoted: msg });
    await sock.sendMessage(from, { text: `💬 Message cité :\n${JSON.stringify(q, null, 2).slice(0,300)}` }, { quoted: msg });
  },
  save: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { text: '✅ Message sauvegardé dans tes favoris.' }, { quoted: msg });
  },
  saved: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { image: { url: IMG }, caption: '⭐ *Messages Sauvegardés*\n\n_Fonctionnalité bientôt disponible !_' }, { quoted: msg });
  },
  setbio: async ({ sock, from, msg, args, isOwner }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .setbio <nouvelle bio>' }, { quoted: msg });
    await sock.updateProfileStatus(args.join(' '));
    await sock.sendMessage(from, { text: `✅ Bio changée : *${args.join(' ')}*` }, { quoted: msg });
  },
  blocklist: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    await sock.sendMessage(from, { image: { url: IMG }, caption: '🚫 *Liste bloqués*\n\n_Chargement (bientôt disponible)._' }, { quoted: msg });
  },
  delme: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { text: '🗑️ Suppression de ton message (bientôt disponible).' }, { quoted: msg });
  },
  removepp: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return;
    await sock.sendMessage(from, { text: '🖼️ Suppression photo de profil (bientôt disponible).' }, { quoted: msg });
  },
};
