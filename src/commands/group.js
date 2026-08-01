const config = require('../config');
const store  = require('../store');

const IMG = config.MENU_IMAGE;
const isAdmin = async (sock, jid, userId) => {
  const meta    = await sock.groupMetadata(jid);
  const admins  = meta.participants.filter(p => ['admin','superadmin'].includes(p.admin)).map(p => p.id);
  return admins.includes(userId);
};

module.exports = {
  tagall: async ({ sock, from, msg, isGroup }) => {
    if (!isGroup) return sock.sendMessage(from, { text: '❌ Groupes seulement.' }, { quoted: msg });
    const meta     = await sock.groupMetadata(from);
    const mentions = meta.participants.map(p => p.id);
    const text     = mentions.map(m => `@${m.split('@')[0]}`).join(' ');
    await sock.sendMessage(from, {
      image   : { url: IMG },
      caption : `📢 *Tag All — ${config.BOT_NAME}*\n${text}`,
      mentions,
    }, { quoted: msg });
  },

  hidetag: async ({ sock, from, msg, isGroup }) => {
    if (!isGroup) return sock.sendMessage(from, { text: '❌ Groupes seulement.' }, { quoted: msg });
    const meta     = await sock.groupMetadata(from);
    const mentions = meta.participants.map(p => p.id);
    await sock.sendMessage(from, {
      text    : '​',
      mentions,
    }, { quoted: msg });
  },

  promote: async ({ sock, from, msg, isGroup, sender }) => {
    if (!isGroup) return;
    if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ Admins seulement.' }, { quoted: msg });
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) return sock.sendMessage(from, { text: '❌ Réponds au message du membre à promouvoir.' }, { quoted: msg });
    await sock.groupParticipantsUpdate(from, [target], 'promote');
    await sock.sendMessage(from, { text: `✅ @${target.split('@')[0]} est maintenant admin.`, mentions: [target] }, { quoted: msg });
  },

  demote: async ({ sock, from, msg, isGroup, sender }) => {
    if (!isGroup) return;
    if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ Admins seulement.' }, { quoted: msg });
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) return sock.sendMessage(from, { text: '❌ Réponds au message de l\'admin à rétrograder.' }, { quoted: msg });
    await sock.groupParticipantsUpdate(from, [target], 'demote');
    await sock.sendMessage(from, { text: `✅ @${target.split('@')[0]} n'est plus admin.`, mentions: [target] }, { quoted: msg });
  },

  kick: async ({ sock, from, msg, isGroup, sender }) => {
    if (!isGroup) return;
    if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ Admins seulement.' }, { quoted: msg });
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) return sock.sendMessage(from, { text: '❌ Réponds au message du membre à exclure.' }, { quoted: msg });
    await sock.groupParticipantsUpdate(from, [target], 'remove');
    await sock.sendMessage(from, { text: `🦵 @${target.split('@')[0]} a été exclu.`, mentions: [target] }, { quoted: msg });
  },

  add: async ({ sock, from, msg, isGroup, sender, args }) => {
    if (!isGroup) return;
    if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ Admins seulement.' }, { quoted: msg });
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .add numéro' }, { quoted: msg });
    const num = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    await sock.groupParticipantsUpdate(from, [num], 'add');
    await sock.sendMessage(from, { text: `✅ @${args[0]} a été ajouté.`, mentions: [num] }, { quoted: msg });
  },

  left: async ({ sock, from, msg, isOwner }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    await sock.sendMessage(from, { text: `👋 Bye bye ! — ${config.BOT_NAME}` });
    await sock.groupLeave(from);
  },

  grouplink: async ({ sock, from, msg, isGroup, sender }) => {
    if (!isGroup) return;
    if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ Admins seulement.' }, { quoted: msg });
    const link = await sock.groupInviteCode(from);
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🔗 *Lien du groupe*\nhttps://chat.whatsapp.com/${link}`,
    }, { quoted: msg });
  },

  resetlink: async ({ sock, from, msg, isGroup, sender }) => {
    if (!isGroup) return;
    if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ Admins seulement.' }, { quoted: msg });
    await sock.groupRevokeInvite(from);
    const newLink = await sock.groupInviteCode(from);
    await sock.sendMessage(from, { text: `✅ Lien réinitialisé !\nhttps://chat.whatsapp.com/${newLink}` }, { quoted: msg });
  },

  listadmins: async ({ sock, from, msg, isGroup }) => {
    if (!isGroup) return;
    const meta   = await sock.groupMetadata(from);
    const admins = meta.participants.filter(p => p.admin).map(p => `• @${p.id.split('@')[0]}`);
    const ment   = meta.participants.filter(p => p.admin).map(p => p.id);
    await sock.sendMessage(from, {
      text    : `👑 *Admins du groupe*\n\n${admins.join('\n')}`,
      mentions: ment,
    }, { quoted: msg });
  },

  opengc: async ({ sock, from, msg, isGroup, sender }) => {
    if (!isGroup) return;
    if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ Admins seulement.' }, { quoted: msg });
    await sock.groupSettingUpdate(from, 'not_announcement');
    await sock.sendMessage(from, { text: '🔓 Groupe ouvert ! Tous peuvent écrire.' }, { quoted: msg });
  },

  closegc: async ({ sock, from, msg, isGroup, sender }) => {
    if (!isGroup) return;
    if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ Admins seulement.' }, { quoted: msg });
    await sock.groupSettingUpdate(from, 'announcement');
    await sock.sendMessage(from, { text: '🔒 Groupe fermé ! Seuls les admins peuvent écrire.' }, { quoted: msg });
  },

  kickall: async ({ sock, from, msg, isGroup, isOwner, sender }) => {
    if (!isGroup || !isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    const meta    = await sock.groupMetadata(from);
    const members = meta.participants.filter(p => !p.admin).map(p => p.id);
    for (const m of members) {
      await sock.groupParticipantsUpdate(from, [m], 'remove').catch(() => {});
    }
    await sock.sendMessage(from, { text: `✅ ${members.length} membres exclus.` }, { quoted: msg });
  },

  kickadmins: async ({ sock, from, msg, isGroup, isOwner }) => {
    if (!isGroup || !isOwner) return sock.sendMessage(from, { text: '❌ Owner seulement.' }, { quoted: msg });
    const meta   = await sock.groupMetadata(from);
    const admins = meta.participants.filter(p => p.admin === 'admin').map(p => p.id);
    for (const a of admins) {
      await sock.groupParticipantsUpdate(from, [a], 'demote').catch(() => {});
    }
    await sock.sendMessage(from, { text: `✅ ${admins.length} admins rétrogradés.` }, { quoted: msg });
  },

  listonline: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { text: '⚠️ WhatsApp ne permet pas de voir qui est en ligne via l\'API.' }, { quoted: msg });
  },

  antilink: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { text: '🔗 Anti-lien activé/désactivé (bientôt disponible).' }, { quoted: msg });
  },

  creategroup: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .creategroup Nom du groupe' }, { quoted: msg });
    const name = args.join(' ');
    const grp  = await sock.groupCreate(name, [config.OWNER_NUMBER + '@s.whatsapp.net']);
    await sock.sendMessage(from, { text: `✅ Groupe *${name}* créé ! JID: ${grp.gid}` }, { quoted: msg });
  },

  join: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .join <lien groupe>' }, { quoted: msg });
    const code = args[0].split('chat.whatsapp.com/')[1];
    if (!code) return sock.sendMessage(from, { text: '❌ Lien invalide.' }, { quoted: msg });
    await sock.groupAcceptInvite(code);
    await sock.sendMessage(from, { text: '✅ Groupe rejoint !' }, { quoted: msg });
  },

  welcome: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { text: '👋 Message de bienvenue automatique activé.\n(Configuré dans les paramètres du groupe)' }, { quoted: msg });
  },

  goodbye: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { text: '👋 Message d\'au revoir automatique activé.' }, { quoted: msg });
  },

  opentime: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { text: '⏰ Planification d\'ouverture (bientôt disponible).' }, { quoted: msg });
  },

  closetime: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { text: '⏰ Planification de fermeture (bientôt disponible).' }, { quoted: msg });
  },
};
