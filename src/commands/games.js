const config = require('../config');
const IMG = config.MENU_IMAGE;
const rand = a => a[Math.floor(Math.random()*a.length)];

const hangmanWords = ['NATSU','DENTSU','WHATSAPP','TELEGRAM','JAVASCRIPT','PYTHON','ROBOT','SOLEIL','BANANE','MUSIQUE'];
const hangmanGames = new Map();
const ticGames = new Map();

module.exports = {
  rps: async ({ sock, from, msg, args }) => {
    const choices = { pierre:'✊', feuille:'✋', ciseaux:'✌️', p:'✊', f:'✋', c:'✌️' };
    const user = args[0]?.toLowerCase();
    if (!user || !choices[user]) return sock.sendMessage(from, { text: '❓ Usage: .rps pierre | feuille | ciseaux' }, { quoted: msg });
    const botChoice = rand(['pierre','feuille','ciseaux']);
    const wins = { pierre:'ciseaux', feuille:'pierre', ciseaux:'feuille' };
    const userFull = user === 'p' ? 'pierre' : user === 'f' ? 'feuille' : user === 'c' ? 'ciseaux' : user;
    const result = userFull === botChoice ? '🤝 Égalité !' : wins[userFull] === botChoice ? '🎉 Tu as gagné !' : '😈 J\'ai gagné !';
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🎮 *Pierre-Feuille-Ciseaux*\n\nToi : ${choices[userFull] || choices[user]} ${userFull}\nBot : ${choices[botChoice]} ${botChoice}\n\n${result}`,
    }, { quoted: msg });
  },

  dice: async ({ sock, from, msg }) => {
    const v = Math.floor(Math.random()*6)+1;
    const f = ['','⚀','⚁','⚂','⚃','⚄','⚅'];
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🎲 *DÉ LANCÉ !*\n\nRésultat : ${f[v]} *${v}*`,
    }, { quoted: msg });
  },

  coin: async ({ sock, from, msg }) => {
    const r = Math.random() < 0.5 ? '🪙 PILE' : '🪙 FACE';
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🪙 *PILE OU FACE*\n\nRésultat : *${r}*`,
    }, { quoted: msg });
  },

  coinbattle: async ({ sock, from, msg, args }) => {
    const p1 = args[0] || 'Joueur 1', p2 = args[1] || 'Joueur 2';
    const r1 = Math.random() < 0.5 ? 'PILE' : 'FACE';
    const r2 = Math.random() < 0.5 ? 'PILE' : 'FACE';
    const winner = r1 !== r2 ? (Math.random() < 0.5 ? p1 : p2) : 'Personne (égalité !)';
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🪙 *COIN BATTLE*\n\n${p1} : ${r1}\n${p2} : ${r2}\n\n🏆 Gagnant : *${winner}*`,
    }, { quoted: msg });
  },

  numberbattle: async ({ sock, from, msg, args }) => {
    const p1 = args[0] || 'Joueur 1', p2 = args[1] || 'Joueur 2';
    const n1 = Math.floor(Math.random()*100)+1, n2 = Math.floor(Math.random()*100)+1;
    const winner = n1 > n2 ? p1 : n2 > n1 ? p2 : 'Égalité !';
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🔢 *NUMBER BATTLE*\n\n${p1} : ${n1}\n${p2} : ${n2}\n\n🏆 Gagnant : *${winner}*`,
    }, { quoted: msg });
  },

  numbattle: async ({ sock, from, msg, args }) => {
    const p1 = args[0]||'Joueur 1', p2 = args[1]||'Joueur 2';
    const n1 = Math.floor(Math.random()*100)+1, n2 = Math.floor(Math.random()*100)+1;
    const winner = n1>n2?p1:n2>n1?p2:'Égalité';
    await sock.sendMessage(from, { text: `🔢 *Battle*\n${p1}: ${n1} vs ${p2}: ${n2}\n🏆 ${winner}` }, { quoted: msg });
  },

  hangman: async ({ sock, from, msg }) => {
    const word = rand(hangmanWords);
    const key  = from;
    hangmanGames.set(key, { word, guessed: [], tries: 0 });
    const display = word.split('').map(l => '_').join(' ');
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🎯 *PENDU*\n\n\`${display}\`\n\n📝 Devine une lettre avec *.guess LETTRE*\n❤️ Vies : 6/6`,
    }, { quoted: msg });
  },

  tictactoe: async ({ sock, from, msg }) => {
    const board = ['1','2','3','4','5','6','7','8','9'];
    ticGames.set(from, { board, turn: 'X' });
    const display = `${board[0]}|${board[1]}|${board[2]}\n-+-+-\n${board[3]}|${board[4]}|${board[5]}\n-+-+-\n${board[6]}|${board[7]}|${board[8]}`;
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🎮 *TIC TAC TOE*\n\n\`\`\`${display}\`\`\`\n\n✏️ Joue avec *.move NUMÉRO* (1-9)\nTu es : ❌`,
    }, { quoted: msg });
  },

  guess: async ({ sock, from, msg }) => {
    const num = Math.floor(Math.random()*100)+1;
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🎲 *DEVINER LE NOMBRE*\n\nJ\'ai choisi un nombre entre 1 et 100.\nDonne ta réponse avec *.answer NOMBRE*\n\n_(Bientôt en jeu interactif complet !)_`,
    }, { quoted: msg });
  },

  math: async ({ sock, from, msg }) => {
    const ops = ['+','-','*'];
    const op  = rand(ops);
    const a   = Math.floor(Math.random()*20)+1;
    const b   = Math.floor(Math.random()*20)+1;
    const ans = op==='+'?a+b:op==='-'?a-b:a*b;
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🧮 *CALCUL RAPIDE*\n\nCombien fait *${a} ${op} ${b}* ?\n\nRéponds avec *.answer RÉPONSE*\n\n||Réponse : ${ans}||`,
    }, { quoted: msg });
  },

  emojiquiz: async ({ sock, from, msg }) => {
    const quizzes = [
      { e: '🦁👑', a: 'Roi Lion' },
      { e: '❄️👸', a: 'La Reine des Neiges' },
      { e: '🕷️🕸️', a: 'Spider-Man' },
      { e: '🦇🤵', a: 'Batman' },
      { e: '🐠🌊🐟', a: 'Le Monde de Nemo' },
      { e: '👸🍎💤', a: 'Blanche-Neige' },
    ];
    const q = rand(quizzes);
    await sock.sendMessage(from, {
      image  : { url: IMG },
      caption: `🎭 *EMOJI QUIZ*\n\nQuel film/série est représenté ?\n\n*${q.e}*\n\nRéponds avec *.answer RÉPONSE*\n\n||${q.a}||`,
    }, { quoted: msg });
  },
};
