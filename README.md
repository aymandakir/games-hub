# 🎮 HUB GAMES

A beautiful, Apple-inspired game hub featuring HTML5 games. Built with vanilla JavaScript, HTML5 Canvas, and modern CSS.

## 🚀 Live Demo

**🎯 Game Hub**: [https://games-hub-kappa.vercel.app](https://games-hub-kappa.vercel.app)

**🦛 Hippo Pumpkin Game**: [https://games-hub-kappa.vercel.app/hippo-game.html](https://games-hub-kappa.vercel.app/hippo-game.html)

**⚔️ Aetheris: The Symbol War**: [https://games-hub-kappa.vercel.app/aetheris-game](https://games-hub-kappa.vercel.app/aetheris-game) *(Coming Soon)*

## 🎯 Featured Games

### Hippo Pumpkin 🦛
Guide your hippo through a Halloween adventure! Collect all 15 pumpkins using arrow keys or touch controls. Smooth animations and particle effects await!

### Aetheris: The Symbol War ⚔️
A narrative-driven RPG where battles are resolved using Rock-Paper-Scissors. Choose between Kael or Lyra and restore the balance between three ancient forces.

## 🛠️ Local Development

### Game Hub (Simple HTML)
Simply open `index.html` in your browser or use a local server:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server -p 8000
```

### Aetheris Game (Next.js)
```bash
cd aetheris-game
npm install
npm run dev
```

Then visit `http://localhost:3000`

## 📁 Project Structure

```
.
├── index.html              # Main hub page
├── hippo-game.html         # Hippo Pumpkin game
├── aetheris-game/          # Complete Next.js RPG
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── lib/               # Game systems & logic
│   └── public/            # Static assets
├── RPS-RPG-Design-Document.md  # Complete game design
└── README.md              # This file
```

## 🎨 Features

- **Game Hub**: Clean, Apple-inspired design
- **Hippo Pumpkin**: Fully responsive, touch controls, particle effects
- **Aetheris RPG**: Complete RPG with audio, particles, save/load, and more
- **Responsive**: Works on desktop, tablet, and mobile
- **No Dependencies**: Hub and Hippo game are pure HTML/CSS/JS
- **Modern Stack**: Aetheris uses Next.js 14, TypeScript, Tailwind CSS

## 🚀 Deployment

This project is deployed on Vercel:
- **Hub**: https://games-hub-kappa.vercel.app
- Auto-deploys on push to main branch

## 📝 License

MIT License - feel free to use and modify!

## 👤 Author

Built with passion by **Ayman**

---

**Repository**: https://github.com/aymandakir/games-hub
