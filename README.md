# 🤖 MINI-NATSU-MD

<p align="center">
  <img src="https://files.catbox.moe/s1ggtt.jpeg" width="200" style="border-radius:20px"/>
</p>

<p align="center">
  <b>Bot WhatsApp Multi-Numéros propulsé par Baileys</b><br/>
  <i>Rapide • Léger • Puissant</i>
</p>

<p align="center">
  <a href="https://github.com/kinggggg444/mini-dentsu-bot/stargazers"><img src="https://img.shields.io/github/stars/kinggggg444/mini-dentsu-bot?style=social" alt="Stars"/></a>
  <a href="https://github.com/kinggggg444/mini-dentsu-bot/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License"/></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18.x-brightgreen" alt="Node"/>
  <img src="https://img.shields.io/badge/platform-WhatsApp-25D366?logo=whatsapp" alt="WhatsApp"/>
</p>

---

## ✨ Fonctionnalités

| Catégorie | Fonctionnalités |
|---|---|
| 📊 **Statuts** | Vue automatique des statuts, like automatique avec emojis aléatoires |
| 🎵 **Médias** | Téléchargement YouTube MP3/MP4, images, vidéos, audio, documents |
| 🎨 **Stickers** | Création de stickers depuis images et vidéos |
| 🔊 **Audio** | Google Text-to-Speech (TTS) intégré |
| 🤖 **Auto** | Enregistrement vocal automatique, réponses automatiques |
| 🔐 **Sécurité** | Système OTP pour le pairing sécurisé des numéros |
| 👥 **Multi-numéros** | Support simultané de plusieurs numéros WhatsApp |
| 🌐 **Interface Web** | Panel de connexion via navigateur |
| 🛡️ **Admin** | Gestion des administrateurs, liste noire |

---

## 🚀 Déployer sur Render

### Étape 1 — Forker ce dépôt

Clique sur **Fork** en haut à droite de cette page.

### Étape 2 — Créer un service sur Render

1. Va sur [render.com](https://render.com) et connecte-toi
2. Clique sur **New → Web Service**
3. Connecte ton dépôt GitHub `mini-dentsu-bot`
4. Remplis les champs :

| Champ | Valeur |
|---|---|
| **Name** | `mini-dentsu-bot` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |

### Étape 3 — Variables d'environnement

Dans Render → **Environment**, ajoute :

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Ton GitHub Personal Access Token |
| `PORT` | `8000` (optionnel, Render le gère) |

### Étape 4 — Déployer 🎉

Clique sur **Create Web Service** — ton bot sera en ligne en quelques minutes !

---

## 🖥️ Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/kinggggg444/mini-dentsu-bot.git
cd mini-dentsu-bot

# Installer les dépendances
npm install

# Lancer le bot
npm start
```

Ouvre ensuite [http://localhost:8000](http://localhost:8000) dans ton navigateur pour connecter ton numéro WhatsApp.

---

## ⚙️ Configuration

Modifie les paramètres dans `pair.js` (section `config`) :

```js
const config = {
    PREFIX: '.',              // Préfixe des commandes
    OWNER_NUMBER: 'TON_NUMERO', // Ton numéro WhatsApp (avec indicatif)
    AUTO_VIEW_STATUS: 'true', // Vue auto des statuts
    AUTO_LIKE_STATUS: 'true', // Like auto des statuts
    AUTO_RECORDING: 'true',   // Simulation d'enregistrement vocal
};
```

---

## 📦 Stack technique

- **[Baileys](https://github.com/whiskeysockets/baileys)** — Librairie WhatsApp Web
- **Express.js** — Serveur web & API
- **Jimp / Sharp** — Traitement d'images
- **FFmpeg** — Conversion audio/vidéo
- **Octokit** — Intégration GitHub
- **Cheerio** — Web scraping
- **Node.js ≥ 18**

---

## 🔗 Liens utiles

- 📢 **Canal WhatsApp** : [Rejoindre](https://whatsapp.com/channel/0029VbC1s7fFnSz1YhZYc01h)
- 🐛 **Signaler un bug** : [Issues](https://github.com/kinggggg444/mini-dentsu-bot/issues)

---

## 📄 Licence

Distribué sous licence **Apache 2.0** — voir [LICENSE](./LICENSE) pour plus de détails.

---

<p align="center">
  Made with ❤️ by <b>Alva tech</b>
</p>
