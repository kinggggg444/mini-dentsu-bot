const axios  = require('axios');
const config = require('../config');
const IMG = config.MENU_IMAGE;

const waifu = async (category) => {
  const { data } = await axios.get(`https://api.waifu.pics/sfw/${category}`, { timeout: 10000 });
  return data.url;
};

const animeImg = (cat) => async ({ sock, from, msg }) => {
  try {
    const url = await waifu(cat);
    await sock.sendMessage(from, { image: { url }, caption: `🎌 *${cat.toUpperCase()}* — ${config.BOT_NAME}` }, { quoted: msg });
  } catch { await sock.sendMessage(from, { image: { url: IMG }, caption: `🎌 *${cat}*\n\n_Chargement image anime..._` }, { quoted: msg }); }
};

module.exports = {
  neko   : animeImg('neko'),
  waifu  : animeImg('waifu'),
  megumin: animeImg('megumin'),
  shinobu: animeImg('shinobu'),
  maid   : animeImg('neko'),
  loli   : async ({ sock, from, msg }) => {
    await sock.sendMessage(from, { image: { url: IMG }, caption: '🎌 *Loli*\n\n_Image anime chargée !_' }, { quoted: msg });
  },

  achar: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .achar <nom personnage>' }, { quoted: msg });
    try {
      const { data } = await axios.get(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(args.join(' '))}&limit=1`, { timeout: 10000 });
      const char     = data.data[0];
      if (!char) return sock.sendMessage(from, { text: '❌ Personnage introuvable.' }, { quoted: msg });
      await sock.sendMessage(from, {
        image  : { url: char.images.jpg.image_url },
        caption: `🎌 *${char.name}*\n\n📝 ${char.about?.slice(0,200)||'N/A'}...\n\n⭐ Popularité : #${char.favorites}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Erreur API anime.' }, { quoted: msg }); }
  },

  asearch: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .asearch <anime>' }, { quoted: msg });
    try {
      const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(args.join(' '))}&limit=1`, { timeout: 10000 });
      const anime    = data.data[0];
      if (!anime) return sock.sendMessage(from, { text: '❌ Anime introuvable.' }, { quoted: msg });
      await sock.sendMessage(from, {
        image  : { url: anime.images.jpg.image_url },
        caption: `🎌 *${anime.title}*\n\n📝 ${anime.synopsis?.slice(0,200)||'N/A'}...\n\n⭐ Note : ${anime.score||'N/A'}/10\n📺 Épisodes : ${anime.episodes||'?'}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Erreur API anime.' }, { quoted: msg }); }
  },

  arecommend: async ({ sock, from, msg }) => {
    try {
      const { data } = await axios.get('https://api.jikan.moe/v4/top/anime?limit=5', { timeout: 10000 });
      const list     = data.data.map((a,i) => `${i+1}. *${a.title}* — ⭐${a.score}`).join('\n');
      await sock.sendMessage(from, { image: { url: IMG }, caption: `🎌 *Top Anime Recommandés*\n\n${list}` }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Erreur API anime.' }, { quoted: msg }); }
  },

  aquote: async ({ sock, from, msg }) => {
    const quotes = [
      '"Je ne recule jamais, je ne regrette rien et je ne mens jamais." — Zoro',
      '"Les rêves ne disparaissent que quand on y renonce." — Luffy',
      '"Si tu ne risques pas ta vie, tu ne peux pas créer un avenir." — Shanks',
      '"Peu importe à quel point tu es lent, tu surpasses toujours ceux qui ne bougent pas." — Kakashi',
    ];
    await sock.sendMessage(from, { image: { url: IMG }, caption: `💬 *Citation Anime*\n\n${quotes[Math.floor(Math.random()*quotes.length)]}` }, { quoted: msg });
  },
};
