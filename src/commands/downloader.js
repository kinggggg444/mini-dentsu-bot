const axios  = require('axios');
const config = require('../config');
const IMG = config.MENU_IMAGE;

const dlStub = (name) => async ({ sock, from, msg, args }) => {
  if (!args[0]) return sock.sendMessage(from, { text: `❓ Usage: .${name.toLowerCase()} <lien>` }, { quoted: msg });
  await sock.sendMessage(from, {
    image  : { url: IMG },
    caption: `📥 *${name}*\n\n🔗 Lien : ${args[0]}\n\n⏳ Téléchargement... (bientôt disponible)\n\n_API téléchargeur en cours d'intégration !_`,
  }, { quoted: msg });
};

module.exports = {
  fb     : dlStub('Facebook DL'),
  insta  : dlStub('Instagram DL'),
  mega   : dlStub('Mega.nz DL'),
  mp4    : dlStub('MP4 DL'),
  pint   : dlStub('Pinterest DL'),
  play   : dlStub('Play Store DL'),
  video  : dlStub('Video DL'),
  apk    : dlStub('APK DL'),
  edit   : dlStub('Edit DL'),
  git    : dlStub('GitHub DL'),
  gitclone: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .gitclone <repo URL>' }, { quoted: msg });
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `📦 *Git Clone*\n\n🔗 Repo : ${args[0]}\n\nClone ton repo sur ton serveur avec :\n\`git clone ${args[0]}\``,
    }, { quoted: msg });
  },
  song   : dlStub('Song DL'),

  ytmp3: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .ytmp3 <lien YouTube>' }, { quoted: msg });
    await sock.sendMessage(from, { text: '🎵 Conversion YouTube → MP3 en cours...' }, { quoted: msg });
    try {
      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(args[0])}`,
        { timeout: 30000 }
      );
      if (data?.data?.dl) {
        await sock.sendMessage(from, {
          audio    : { url: data.data.dl },
          mimetype : 'audio/mp4',
          ptt      : false,
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { image: { url: IMG }, caption: `🎵 *YouTube MP3*\n\n${args[0]}\n\n_Lien non disponible, essaie un autre._` }, { quoted: msg });
      }
    } catch { await sock.sendMessage(from, { text: '❌ Erreur téléchargement MP3.' }, { quoted: msg }); }
  },

  yta: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .yta <lien YouTube>' }, { quoted: msg });
    await sock.sendMessage(from, { text: '🎵 Extraction audio YouTube...' }, { quoted: msg });
    await sock.sendMessage(from, { image: { url: IMG }, caption: `🎵 *YouTube Audio*\n\nLien : ${args[0]}\n\n_Utilise .ytmp3 pour le téléchargement audio._` }, { quoted: msg });
  },

  ytb: async ({ sock, from, msg, args }) => {
    if (!args[0]) return sock.sendMessage(from, { text: '❓ Usage: .ytb <lien YouTube>' }, { quoted: msg });
    await sock.sendMessage(from, { text: '🎬 Téléchargement vidéo YouTube...' }, { quoted: msg });
    try {
      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(args[0])}`,
        { timeout: 30000 }
      );
      if (data?.data?.dl) {
        await sock.sendMessage(from, {
          video    : { url: data.data.dl },
          mimetype : 'video/mp4',
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { image: { url: IMG }, caption: `🎬 *YouTube Vidéo*\n\n${args[0]}\n\n_Lien non disponible._` }, { quoted: msg });
      }
    } catch { await sock.sendMessage(from, { text: '❌ Erreur téléchargement vidéo.' }, { quoted: msg }); }
  },
};
