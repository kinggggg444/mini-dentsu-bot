const config = require('../config');
const IMG = config.MENU_IMAGE;

const stub = (name) => async ({ sock, from, msg }) => {
  await sock.sendMessage(from, {
    image  : { url: IMG },
    caption: `🎵 *${name}*\n\n⚠️ Réponds à un audio/voice note avec cette commande.\n\n_Traitement audio disponible dans la prochaine mise à jour !_`,
  }, { quoted: msg });
};

module.exports = {
  bass    : stub('BASS BOOST'),
  blown   : stub('BLOWN EFFECT'),
  deep    : stub('DEEP VOICE'),
  fast    : stub('FAST SPEED'),
  reverse : stub('REVERSE AUDIO'),
  robot   : stub('ROBOT VOICE'),
  slow    : stub('SLOW SPEED'),

  tts: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .tts <texte>' }, { quoted: msg });
    const text = args.join(' ');
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🗣️ *TTS — Text to Speech*\n\n📝 Texte : ${text}\n\n_Génération audio bientôt disponible !_`,
    }, { quoted: msg });
  },

  say: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .say <texte>' }, { quoted: msg });
    await sock.sendMessage(from, { text: `🔊 ${args.join(' ')}` }, { quoted: msg });
  },
};
