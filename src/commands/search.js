const axios  = require('axios');
const config = require('../config');
const IMG = config.MENU_IMAGE;

module.exports = {
  img: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .img <recherche>' }, { quoted: msg });
    try {
      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/s/image?query=${encodeURIComponent(args.join(' '))}`,
        { timeout: 15000 }
      );
      const url = data?.data?.[0]?.thumbnail || data?.data?.[0]?.original || null;
      if (url) {
        await sock.sendMessage(from, { image: { url }, caption: `🔍 *Image : ${args.join(' ')}*` }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { image: { url: IMG }, caption: `🔍 *Image : ${args.join(' ')}*\n\n_Aucun résultat trouvé._` }, { quoted: msg });
      }
    } catch { await sock.sendMessage(from, { text: '❌ Erreur recherche image.' }, { quoted: msg }); }
  },

  wiki: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .wiki <sujet>' }, { quoted: msg });
    try {
      const query = encodeURIComponent(args.join(' '));
      const { data } = await axios.get(
        `https://fr.wikipedia.org/api/rest_v1/page/summary/${query}`,
        { timeout: 15000 }
      );
      await sock.sendMessage(from, {
        image  : { url: data.thumbnail?.source || IMG },
        caption: `📖 *Wikipedia : ${data.title}*\n\n${data.extract?.slice(0,500)||'Aucune info.'}...\n\n🔗 ${data.content_urls?.mobile?.page||''}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Article Wikipedia introuvable.' }, { quoted: msg }); }
  },

  yts: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .yts <recherche>' }, { quoted: msg });
    try {
      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/s/yt?query=${encodeURIComponent(args.join(' '))}`,
        { timeout: 15000 }
      );
      const results = data?.data?.slice(0,5).map((v,i) => `${i+1}. *${v.title}*\n   ⏱️ ${v.duration} | 👁️ ${v.views||'N/A'}\n   🔗 ${v.url}`).join('\n\n') || 'Aucun résultat.';
      await sock.sendMessage(from, {
        image  : { url: IMG },
        caption: `🎥 *YouTube Search : ${args.join(' ')}*\n\n${results}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Erreur recherche YouTube.' }, { quoted: msg }); }
  },

  calc: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .calc 2+2' }, { quoted: msg });
    try {
      const expr   = args.join('').replace(/[^0-9+\-*/().%]/g,'');
      const result = Function(`"use strict"; return (${expr})`)();
      await sock.sendMessage(from, {
        image  : { url: IMG },
        caption: `🧮 *Calculatrice*\n\n📝 ${expr} = *${result}*`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Expression invalide.' }, { quoted: msg }); }
  },

  circle: async ({ sock, from, msg, args }) => {
    const r = parseFloat(args[0]);
    if (!r) return sock.sendMessage(from, { text: '❓ Usage: .circle <rayon>' }, { quoted: msg });
    const area = (Math.PI * r * r).toFixed(4);
    const circ = (2 * Math.PI * r).toFixed(4);
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `⭕ *Calcul Cercle*\n\n📏 Rayon : ${r}\n📐 Aire : ${area}\n📏 Circonférence : ${circ}`,
    }, { quoted: msg });
  },

  get: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .get <URL>' }, { quoted: msg });
    try {
      const { data } = await axios.get(args[0], { timeout: 10000 });
      const text = typeof data === 'string' ? data.slice(0,500) : JSON.stringify(data).slice(0,500);
      await sock.sendMessage(from, { text: `🌐 *Réponse HTTP*\n\n${text}...` }, { quoted: msg });
    } catch (e) { await sock.sendMessage(from, { text: `❌ Erreur : ${e.message}` }, { quoted: msg }); }
  },

  tomp3: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .tomp3 <lien vidéo>' }, { quoted: msg });
    await sock.sendMessage(from, { image: { url: IMG }, caption: `🎵 *Conversion MP3*\n\nLien : ${args[0]}\n\n_Utilise .ytmp3 pour YouTube._` }, { quoted: msg });
  },
};
