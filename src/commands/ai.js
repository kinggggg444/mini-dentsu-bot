const axios  = require('axios');
const config = require('../config');

const IMG = config.MENU_IMAGE;

const stub = (name) => async ({ sock, from, msg }) => {
  await sock.sendMessage(from, {
    image  : { url: IMG },
    caption: `🧠 *${name}*\n\nDonne-moi ta question / prompt :\nEx: .${name.toLowerCase()} Comment fonctionne Node.js ?\n\n_Commande active dans la prochaine mise à jour !_`,
  }, { quoted: msg });
};

const gptQuery = async (prompt) => {
  const { data } = await axios.get(
    `https://api.siputzx.my.id/api/ai/chatgpt?prompt=${encodeURIComponent(prompt)}`,
    { timeout: 20000 }
  );
  return data?.data || data?.result || 'Pas de réponse.';
};

const geminiQuery = async (prompt) => {
  const { data } = await axios.get(
    `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(prompt)}`,
    { timeout: 20000 }
  );
  return data?.data || data?.result || 'Pas de réponse.';
};

module.exports = {
  ai: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .ai <ta question>' }, { quoted: msg });
    const prompt = args.join(' ');
    await sock.sendMessage(from, { text: '🧠 Génération en cours...' }, { quoted: msg });
    try {
      const res = await gptQuery(prompt);
      await sock.sendMessage(from, {
        image  : { url: IMG },
        caption: `🤖 *DENTSU AI*\n\n❓ ${prompt}\n\n💬 ${res}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Erreur API.' }, { quoted: msg }); }
  },

  gpt: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .gpt <question>' }, { quoted: msg });
    await sock.sendMessage(from, { text: '💭 GPT en train de répondre...' }, { quoted: msg });
    try {
      const res = await gptQuery(args.join(' '));
      await sock.sendMessage(from, {
        image  : { url: IMG },
        caption: `🤖 *ChatGPT*\n\n❓ ${args.join(' ')}\n\n💬 ${res}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Erreur GPT.' }, { quoted: msg }); }
  },

  gemini: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .gemini <question>' }, { quoted: msg });
    await sock.sendMessage(from, { text: '✨ Gemini en train de répondre...' }, { quoted: msg });
    try {
      const res = await geminiQuery(args.join(' '));
      await sock.sendMessage(from, {
        image  : { url: IMG },
        caption: `✨ *Google Gemini*\n\n❓ ${args.join(' ')}\n\n💬 ${res}`,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Erreur Gemini.' }, { quoted: msg }); }
  },

  gpt4    : stub('GPT-4'),
  gpt5    : stub('GPT-5'),
  metaai  : stub('Meta AI'),
  codeai  : async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .codeai <ta question de code>' }, { quoted: msg });
    await sock.sendMessage(from, { text: '💻 Code AI en cours...' }, { quoted: msg });
    try {
      const res = await gptQuery(`En tant qu'expert développeur, réponds en code: ${args.join(' ')}`);
      await sock.sendMessage(from, {
        image  : { url: IMG },
        caption: `💻 *Code AI*\n\n❓ ${args.join(' ')}\n\n\`\`\`\n${res}\n\`\`\``,
      }, { quoted: msg });
    } catch { await sock.sendMessage(from, { text: '❌ Erreur Code AI.' }, { quoted: msg }); }
  },
  photoai : stub('Photo AI'),
};
