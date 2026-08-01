const config = require('../config');
const IMG = config.MENU_IMAGE;
const axios = require('axios');

const rand = a => a[Math.floor(Math.random()*a.length)];

const TRUTHS = [
  'Quelle est ta plus grande peur secrète ?',
  'As-tu déjà menti à un ami proche ?',
  'Quelle est ta habitude gênante ?',
  'Quelle est la chose dont tu es le plus fier ?',
  'Qui est ton crush secret ?',
  'As-tu déjà volé quelque chose ?',
  'Quel est ton pire souvenir scolaire ?',
  'As-tu déjà pleuré devant un film ?',
];

const DARES = [
  'Envoie un voice note en chantant 10 secondes !',
  'Change ton statut WhatsApp en "Je suis bizarre" pendant 1h !',
  'Envoie un message d\'amour au dernier contact de ta liste !',
  'Fais 15 pompes et envoie une photo comme preuve !',
  'Envoie un selfie ridicule !',
  'Dis "Je t\'aime" à la prochaine personne qui t\'écrit !',
  'Raconte une blague nulle en voice note !',
];

const JOKES = [
  'Pourquoi les plongeurs plongent-ils en arrière ? Sinon ils tomberaient dans le bateau ! 😂',
  'Qu\'est-ce qu\'un crocodile qui surveille les techos ? Un alligateur !',
  'C\'est l\'histoire de deux chasseurs. L\'un tombe mort. L\'autre appelle le 15. "Mon ami est mort !" "Calmez-vous. D\'abord, assurez-vous qu\'il est mort." *Coup de feu* "C\'est fait, et maintenant ?"',
  'Qu\'est-ce qu\'un canif ? Un petit fien !',
  'Pourquoi les Belges mettent-ils leur bière au frigo ? Parce qu\'ils aiment la bière froide ! 🍺',
  'Comment appelle-t-on un chat tombé dans un pot de peinture ? Un chat-peint !',
];

const FLIRTS = [
  'Si tu étais une étoile, tu éclairerais toute la galaxie. ✨',
  'Ton sourire peut guérir tous les maux du monde. 😍',
  'Je cherchais mon bonheur... et j\'ai trouvé ton numéro. ❤️',
  'Tu es si belle/beau que même les étoiles te regardent avec admiration. 🌟',
  'Si les câlins étaient des calories, je voudrais être obèse rien que pour toi. 🤗',
];

const ROASTS = [
  'Tu es la preuve que même les miroirs peuvent se tromper. 😂',
  'Ton cerveau est tellement petit que si tu le cherchais, tu le trouverais sous une puce électronique. 🤣',
  'Tu parles tellement que même Google Maps a du mal à te suivre. 😆',
  'Tu es le genre de personne qui trouve une faute de frappe dans un SMS vocal. 🤦',
];

const COMPLIMENTS = [
  'Tu es brillant(e) comme un diamant dans la nuit ! 💎',
  'Ton intelligence est aussi grande que ton cœur. ❤️',
  'Tu inspires tout le monde autour de toi sans même t\'en rendre compte. 🌟',
  'Tu es exactement le genre de personne dont le monde a besoin. 🙏',
];

const TRIVIA = [
  '🐙 Les pieuvres ont 3 cœurs et du sang bleu.',
  '🐝 Les abeilles peuvent reconnaître les visages humains.',
  '🌊 95% des océans de la Terre n\'ont pas encore été explorés.',
  '🧠 Le cerveau humain génère environ 70 000 pensées par jour.',
  '🦈 Les requins sont plus vieux que les arbres sur Terre.',
  '🐘 Les éléphants sont les seuls animaux qui ne peuvent pas sauter.',
];

const INSPIRE = [
  '« Le succès c\'est d\'aller d\'échec en échec sans perdre son enthousiasme. » — Churchill',
  '« Soyez le changement que vous voulez voir dans le monde. » — Gandhi',
  '« La seule façon de faire du bon travail est d\'aimer ce que vous faites. » — Steve Jobs',
  '« Le meilleur moment pour planter un arbre, c\'était il y a 20 ans. Le deuxième c\'est maintenant. » — Proverbe',
  '« Celui qui déplace une montagne commence par déplacer de petites pierres. » — Confucius',
];

const SHIPS = ['💞','❤️‍🔥','💘','💖','✨','🌟','🔥'];

module.exports = {
  truth: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🎯 *VÉRITÉ*\n\n${rand(TRUTHS)}\n\n_Réponds honnêtement... si tu oses ! 😏_`,
    }, { quoted: msg });
  },

  dare: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `⚡ *DÉFI*\n\n${rand(DARES)}\n\n_Tu l\'acceptes ? 😈_`,
    }, { quoted: msg });
  },

  joke: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `😂 *BLAGUE DU MOMENT*\n\n${rand(JOKES)}`,
    }, { quoted: msg });
  },

  meme: async ({ sock, from, msg }) => {
    try {
      const { data } = await axios.get('https://meme-api.com/gimme', { timeout: 10000 });
      await sock.sendMessage(from, { image: { url: data.url }, caption: `😂 *MÈME*\n${data.title}` }, { quoted: msg });
    } catch {
      await sock.sendMessage(from, { text: '❌ Impossible de charger un mème. Réessaie !' }, { quoted: msg });
    }
  },

  ship: async ({ sock, from, msg, args }) => {
    const p1 = args[0] || 'Toi';
    const p2 = args[1] || 'Lui/Elle';
    const pct = Math.floor(Math.random()*101);
    const bar = '█'.repeat(Math.floor(pct/10)) + '░'.repeat(10-Math.floor(pct/10));
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `${rand(SHIPS)} *SHIP METER*\n\n👤 ${p1}\n👤 ${p2}\n\n[${bar}] ${pct}%\n\n${pct>=80?'💞 Amour parfait !':pct>=50?'💕 Bonne compatibilité !':pct>=30?'🤔 Peut mieux faire...':'😬 Oups... pas très compatible !'}`,
    }, { quoted: msg });
  },

  rate: async ({ sock, from, msg, args }) => {
    const thing = args.join(' ') || msg.pushName || 'toi';
    const score = Math.floor(Math.random()*101);
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `⭐ *ÉVALUATION*\n\n🎯 ${thing}\n📊 Score : *${score}/100*\n\n${score>=90?'🌟 Exceptionnel !':score>=70?'✅ Très bien !':score>=50?'👍 Passable.':'😅 Peut mieux faire !'}`,
    }, { quoted: msg });
  },

  flirt: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `💋 *FLIRT*\n\n${rand(FLIRTS)}`,
    }, { quoted: msg });
  },

  roast: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🔥 *ROAST*\n\n${rand(ROASTS)}\n\n_C\'est une blague hein ! 😂_`,
    }, { quoted: msg });
  },

  compliment: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `💐 *COMPLIMENT*\n\n${rand(COMPLIMENTS)}`,
    }, { quoted: msg });
  },

  triviafact: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🤯 *FAIT INSOLITE*\n\n${rand(TRIVIA)}`,
    }, { quoted: msg });
  },

  inspire: async ({ sock, from, msg }) => {
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `✨ *INSPIRATION*\n\n${rand(INSPIRE)}`,
    }, { quoted: msg });
  },

  ascii: async ({ sock, from, msg, args }) => {
    if (!args.length) return sock.sendMessage(from, { text: '❓ Usage: .ascii TEXTE' }, { quoted: msg });
    const text = args.join(' ').toUpperCase().slice(0, 10);
    await sock.sendMessage(from, {
      text: `🎨 *ASCII Art*\n\n\`\`\`${text}\`\`\`\n_Art ASCII généré pour: ${text}_`,
    }, { quoted: msg });
  },
};
