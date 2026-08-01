const config  = require('../config');
const store   = require('../store');
const moment  = require('moment-timezone');

const IMG = config.MENU_IMAGE;

async function sendMenu(sock, from, msg, section, text) {
  await sock.sendMessage(from, {
    image    : { url: IMG },
    caption  : text,
    mimetype : 'image/jpeg',
  }, { quoted: msg });
}

module.exports = {
  menu: async ({ sock, from, msg, sender, config: cfg }) => {
    const now  = moment().tz(cfg.TIMEZONE);
    const date = now.format('DD/MM/YYYY');
    const time = now.format('HH:mm');
    const user = msg.pushName || sender?.split('@')[0] || 'User';
    const text = `
╔══════════════════════════════╗
║     🤖  ${cfg.BOT_NAME}     ║
╠══════════════════════════════╣
║  NameBot : ${cfg.BOT_NAME}
║  Version : ${cfg.VERSION}
║  Dev     : ${cfg.DEV_NAME}
║  Date    : ${date}  ${time}
║  User    : ${user}
║  Cmds    : ${cfg.TOTAL_CMDS}+
║  Mode    : ${cfg.MODE}
║  Web     : w.dev/NatsuorDentsu
╠══════════════════════════════╣
║  ${cfg.PREFIX}aimenu      → 🧠 Intelligence Artificielle
║  ${cfg.PREFIX}groupmenu   → 👥 Gestion de groupe
║  ${cfg.PREFIX}ownermenu   → 👑 Owner / Admin
║  ${cfg.PREFIX}funmenu     → 🎉 Fun & Social
║  ${cfg.PREFIX}gamemenu    → 🎮 Jeux
║  ${cfg.PREFIX}soundmenu   → 🎵 Son & Audio
║  ${cfg.PREFIX}othermenu   → 🔧 Autres outils
║  ${cfg.PREFIX}animemenu   → 🎌 Anime
║  ${cfg.PREFIX}dlmenu      → 📥 Téléchargeur
║  ${cfg.PREFIX}globalmenu  → 🌐 Global
║  ${cfg.PREFIX}searchmenu  → 🔍 Recherche
╚══════════════════════════════╝
📢 ${cfg.CHANNEL_LINK}
💬 ${cfg.GROUP_LINK}
✈️  ${cfg.TELEGRAM}`.trim();
    await sendMenu(sock, from, msg, 'main', text);
  },

  aimenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔══════════════╗
║  🧠 AI MENU  ║
╚══════════════╝
${cfg.PREFIX}ai          → IA générale
${cfg.PREFIX}gpt         → ChatGPT
${cfg.PREFIX}gpt4        → GPT-4
${cfg.PREFIX}gpt5        → GPT-5
${cfg.PREFIX}metaai      → Meta AI
${cfg.PREFIX}codeai      → Code IA
${cfg.PREFIX}photoai     → Photo IA
${cfg.PREFIX}gemini      → Google Gemini
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'ai', text);
  },

  groupmenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔════════════════╗
║  👥 GROUP MENU  ║
╚════════════════╝
${cfg.PREFIX}tagall      → Mentionner tous
${cfg.PREFIX}hidetag     → Tag caché
${cfg.PREFIX}promote     → Promouvoir admin
${cfg.PREFIX}demote      → Rétrograder admin
${cfg.PREFIX}kick        → Exclure membre
${cfg.PREFIX}add         → Ajouter membre
${cfg.PREFIX}left        → Quitter groupe
${cfg.PREFIX}grouplink   → Lien du groupe
${cfg.PREFIX}resetlink   → Reset lien
${cfg.PREFIX}kickadmins  → Kick tous admins
${cfg.PREFIX}kickall     → Kick tous membres
${cfg.PREFIX}listadmins  → Liste admins
${cfg.PREFIX}listonline  → Membres en ligne
${cfg.PREFIX}opengc      → Ouvrir groupe
${cfg.PREFIX}closegc     → Fermer groupe
${cfg.PREFIX}antilink    → Anti-lien
${cfg.PREFIX}creategroup → Créer groupe
${cfg.PREFIX}join        → Rejoindre
${cfg.PREFIX}welcome     → Message bienvenue (auto)
${cfg.PREFIX}goodbye     → Message au revoir (auto)
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'group', text);
  },

  ownermenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔════════════════╗
║  👑 OWNER MENU  ║
╚════════════════╝
${cfg.PREFIX}setpp       → Changer photo profil bot
${cfg.PREFIX}ban         → Bannir utilisateur
${cfg.PREFIX}unban       → Débannir utilisateur
${cfg.PREFIX}self        → Mode privé
${cfg.PREFIX}public      → Mode public
${cfg.PREFIX}autotyping  → Auto-typing
${cfg.PREFIX}block       → Bloquer contact
${cfg.PREFIX}unblock     → Débloquer contact
${cfg.PREFIX}delete      → Supprimer message
${cfg.PREFIX}mode        → Changer mode
${cfg.PREFIX}ping        → Latence du bot
${cfg.PREFIX}alive       → Statut du bot
${cfg.PREFIX}runtime     → Temps de fonctionnement
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'owner', text);
  },

  funmenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔══════════════╗
║  🎉 FUN MENU  ║
╚══════════════╝
${cfg.PREFIX}truth       → Vérité
${cfg.PREFIX}dare        → Défi
${cfg.PREFIX}joke        → Blague
${cfg.PREFIX}meme        → Mème
${cfg.PREFIX}ship        → Compatibilité amoureuse
${cfg.PREFIX}rate        → Évaluation aléatoire
${cfg.PREFIX}flirt       → Flirt
${cfg.PREFIX}roast       → Insulte fun
${cfg.PREFIX}compliment  → Compliment
${cfg.PREFIX}triviafact  → Fait trivia
${cfg.PREFIX}inspire     → Citation inspirante
${cfg.PREFIX}ascii       → Art ASCII
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'fun', text);
  },

  gamemenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔═══════════════╗
║  🎮 GAME MENU  ║
╚═══════════════╝
${cfg.PREFIX}rps         → Pierre-Feuille-Ciseaux
${cfg.PREFIX}dice        → Dé
${cfg.PREFIX}coin        → Pile ou Face
${cfg.PREFIX}coinbattle  → Bataille de pièces
${cfg.PREFIX}numberbattle→ Bataille de nombres
${cfg.PREFIX}hangman     → Pendu
${cfg.PREFIX}tictactoe   → Morpion
${cfg.PREFIX}guess       → Deviner le nombre
${cfg.PREFIX}math        → Calcul rapide
${cfg.PREFIX}emojiquiz   → Quiz emoji
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'game', text);
  },

  soundmenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔════════════════╗
║  🎵 SOUND MENU  ║
╚════════════════╝
${cfg.PREFIX}bass        → Effet bass boost
${cfg.PREFIX}blown       → Son soufflé
${cfg.PREFIX}deep        → Voix grave
${cfg.PREFIX}fast        → Vitesse rapide
${cfg.PREFIX}reverse     → Son inversé
${cfg.PREFIX}robot       → Voix robot
${cfg.PREFIX}slow        → Vitesse lente
${cfg.PREFIX}tts         → Texte en voix
${cfg.PREFIX}say         → Dire un message
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'sound', text);
  },

  othermenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔═══════════════╗
║  🔧 OTHER MENU ║
╚═══════════════╝
${cfg.PREFIX}qrcode      → Générer QR code
${cfg.PREFIX}shorturl    → Raccourcir URL
${cfg.PREFIX}jid         → Voir JID
${cfg.PREFIX}getpp       → Voir photo profil
${cfg.PREFIX}github      → Infos GitHub
${cfg.PREFIX}npm         → Infos package npm
${cfg.PREFIX}dictionary  → Dictionnaire
${cfg.PREFIX}recipe      → Recette de cuisine
${cfg.PREFIX}book        → Livre
${cfg.PREFIX}calculat    → Calculatrice avancée
${cfg.PREFIX}horoscope   → Horoscope
${cfg.PREFIX}password    → Générer mot de passe
${cfg.PREFIX}Idch        → ID channel
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'other', text);
  },

  animemenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔═══════════════╗
║  🎌 ANIME MENU ║
╚═══════════════╝
${cfg.PREFIX}achar       → Personnage anime
${cfg.PREFIX}aquote      → Citation anime
${cfg.PREFIX}arecommend  → Recommandation
${cfg.PREFIX}asearch     → Recherche anime
${cfg.PREFIX}loli        → Image loli
${cfg.PREFIX}maid        → Image maid
${cfg.PREFIX}megumin     → Megumin
${cfg.PREFIX}neko        → Neko
${cfg.PREFIX}shinobu     → Shinobu
${cfg.PREFIX}waifu       → Waifu
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'anime', text);
  },

  dlmenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔══════════════════╗
║  📥 DOWNLOADER   ║
╚══════════════════╝
${cfg.PREFIX}apk         → Télécharger APK
${cfg.PREFIX}fb          → Facebook vidéo
${cfg.PREFIX}insta       → Instagram
${cfg.PREFIX}mega        → Mega.nz
${cfg.PREFIX}mp4         → Vidéo MP4
${cfg.PREFIX}pint        → Pinterest
${cfg.PREFIX}play        → Google Play
${cfg.PREFIX}song        → Chanson
${cfg.PREFIX}video       → Vidéo générale
${cfg.PREFIX}yta         → YouTube audio
${cfg.PREFIX}ytmp3       → YouTube MP3
${cfg.PREFIX}ytb         → YouTube vidéo
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'dl', text);
  },

  globalmenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔════════════════╗
║  🌐 GLOBAL MENU ║
╚════════════════╝
${cfg.PREFIX}anticall    → Anti-appel
${cfg.PREFIX}antidelete  → Anti-suppression
${cfg.PREFIX}antiedit    → Anti-édition
${cfg.PREFIX}antilink    → Anti-lien
${cfg.PREFIX}block       → Bloquer
${cfg.PREFIX}broadcast   → Diffusion
${cfg.PREFIX}del         → Supprimer
${cfg.PREFIX}forward     → Transférer
${cfg.PREFIX}getbio      → Voir bio
${cfg.PREFIX}getname     → Voir nom
${cfg.PREFIX}jid         → Voir JID
${cfg.PREFIX}join        → Rejoindre groupe
${cfg.PREFIX}leaveall    → Quitter tous groupes
${cfg.PREFIX}listgc      → Liste groupes
${cfg.PREFIX}mode        → Mode bot
${cfg.PREFIX}myname      → Mon nom
${cfg.PREFIX}myprivacy   → Ma confidentialité
${cfg.PREFIX}mystatus    → Mon statut
${cfg.PREFIX}quoted      → Message cité
${cfg.PREFIX}save        → Sauvegarder
${cfg.PREFIX}setbio      → Changer bio
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'global', text);
  },

  searchmenu: async ({ sock, from, msg, config: cfg }) => {
    const text = `
╔══════════════════╗
║  🔍 SEARCH MENU  ║
╚══════════════════╝
${cfg.PREFIX}img         → Chercher image
${cfg.PREFIX}wiki        → Wikipedia
${cfg.PREFIX}yts         → Chercher YouTube
${cfg.PREFIX}calc        → Calculatrice
${cfg.PREFIX}circle      → Cercle (math)
${cfg.PREFIX}get         → Requête HTTP
${cfg.PREFIX}shorturl    → Raccourcir URL
${cfg.PREFIX}tomp3       → Convertir en MP3
──────────────────────`.trim();
    await sendMenu(sock, from, msg, 'search', text);
  },
};
