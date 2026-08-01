const axios  = require('axios');
const config = require('../config');
const IMG = config.MENU_IMAGE;

module.exports = {
  qrcode: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .qrcode <texte ou URL>' }, { quoted: msg });
    const text = encodeURIComponent(args.join(' '));
    const url  = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${text}`;
    await sock.sendMessage(from, { image: { url }, caption: `📱 *QR Code généré !*\n\nContenu : ${args.join(' ')}` }, { quoted: msg });
  },

  shorturl: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .shorturl <URL>' }, { quoted: msg });
    try {
      const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`, { timeout: 10000 });
      await sock.sendMessage(from, { image: { url: IMG }, caption: `🔗 *URL Raccourcie*\n\n📎 Original : ${args[0]}\n✅ Court : ${data}` }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Erreur raccourcissement URL.' }, { quoted: msg }); }
  },

  jid: async ({ sock, from, msg, sender }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🔑 *JID Info*\n\n👤 Toi : \`${sender}\`\n💬 Chat : \`${from}\``,
    }, { quoted: msg });
  },

  getpp: async ({ sock, from, msg, args, sender }) => {
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant || sender;
    try {
      const pp = await sock.profilePictureUrl(target, 'image');
      await sock.sendMessage(from, { image: { url: pp }, caption: `🖼️ Photo profil de @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Aucune photo de profil.' }, { quoted: msg }); }
  },

  github: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .github <username>' }, { quoted: msg });
    try {
      const { data } = await axios.get(`https://api.github.com/users/${args[0]}`, { timeout: 10000 });
      await sock.sendMessage(from, {
        image  : { url: data.avatar_url },
        caption: `🐙 *GitHub : ${data.login}*\n\n📛 Nom : ${data.name||'N/A'}\n📍 Lieu : ${data.location||'N/A'}\n💼 Bio : ${data.bio||'N/A'}\n⭐ Repos : ${data.public_repos}\n👥 Followers : ${data.followers}\n🔗 ${data.html_url}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Utilisateur GitHub introuvable.' }, { quoted: msg }); }
  },

  npm: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .npm <package>' }, { quoted: msg });
    try {
      const { data } = await axios.get(`https://registry.npmjs.org/${args[0]}`, { timeout: 10000 });
      const latest = data['dist-tags'].latest;
      await sock.sendMessage(from, {
        image  : { url: IMG },
        caption: `📦 *NPM : ${data.name}*\n\n📝 Description : ${data.description||'N/A'}\n🏷️ Version : ${latest}\n👤 Auteur : ${data.author?.name||'N/A'}\n📜 Licence : ${data.license||'N/A'}\n🔗 https://npmjs.com/package/${args[0]}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Package NPM introuvable.' }, { quoted: msg }); }
  },

  dictionary: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .dictionary <mot>' }, { quoted: msg });
    try {
      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${args[0]}`, { timeout: 10000 });
      const def = data[0]?.meanings[0]?.definitions[0];
      await sock.sendMessage(from, {
        image  : { url: IMG },
        caption: `📖 *Dictionnaire : ${args[0]}*\n\n📝 Définition : ${def?.definition||'N/A'}\n💡 Exemple : ${def?.example||'N/A'}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Mot introuvable.' }, { quoted: msg }); }
  },

  calculat: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .calculat 2+2*3' }, { quoted: msg });
    try {
      const expr   = args.join('').replace(/[^0-9+\-*/().%^]/g,'');
      const result = Function(`"use strict"; return (${expr})`)();
      await sock.sendMessage(from, {
        image  : { url: IMG },
        caption: `🧮 *Calculatrice*\n\n📝 ${expr}\n✅ = *${result}*`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Expression invalide.' }, { quoted: msg }); }
  },

  password: async ({ sock, from, msg, args }) => {
    const len  = parseInt(args[0]) || 16;
    const chars= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pwd = '';
    for (let i=0;i<Math.min(len,32);i++) pwd += chars[Math.floor(Math.random()*chars.length)];
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🔐 *Mot de passe généré*\n\n\`${pwd}\`\n\n🔒 Longueur : ${pwd.length} caractères`,
    }, { quoted: msg });
  },

  horoscope: async ({ sock, from, msg, args }) => {
    const signs = ['Bélier','Taureau','Gémeaux','Cancer','Lion','Vierge','Balance','Scorpion','Sagittaire','Capricorne','Verseau','Poissons'];
    const msgs  = ['Belle journée en perspective !','Méfie-toi des fausses promesses.','L\'amour est dans l\'air !','Journée idéale pour prendre des décisions.','La chance te sourit aujourd\'hui !'];
    const rand  = a => a[Math.floor(Math.random()*a.length)];
    const sign  = args[0] || rand(signs);
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🔮 *Horoscope — ${sign}*\n\n${rand(msgs)}\n\n⭐ Chance du jour : ${Math.floor(Math.random()*5)+1}/5`,
    }, { quoted: msg });
  },

  recipe: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .recipe <plat>' }, { quoted: msg });
    await sock.sendMessage(from, { image: { url: IMG }, caption: `🍽️ *Recette : ${args.join(' ')}*\n\n_Recherche de recettes bientôt disponible !_` }, { quoted: msg });
  },

  book: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .book <titre>' }, { quoted: msg });
    await sock.sendMessage(from, { image: { url: IMG }, caption: `📚 *Livre : ${args.join(' ')}*\n\n_Recherche de livres bientôt disponible !_` }, { quoted: msg });
  },

  Idch: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `📢 *Channels DENTSU*\n\n🔗 ${config.CHANNEL_LINK}\n🔗 ${config.CHANNEL_LINK2}\n\n📌 Newsletter JID : ${config.NEWSLETTER_JID}`,
    }, { quoted: msg });
  },
};
