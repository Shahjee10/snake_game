# 🐍 Snake Game (Production-Ready)

A fully **production-ready Snake game** built from scratch in just **48 hours** — no game libraries, no shortcuts.

👉 Live Demo: https://snakegame-production-5e00.up.railway.app/  


---

## 🚀 Features

### 🎮 Game Engine
- Custom **Canvas renderer** with neon CRT aesthetic
- Smooth **60 FPS** gameplay using `requestAnimationFrame`
- Real-time **collision detection**
- **Dynamic speed scaling** based on level
- Snake eyes that follow movement direction 👀

### 🔊 Sound System
- Built with **Web Audio API** (no external libraries)
- Procedurally generated sound effects:
  - Eat 🍎
  - Death 💥
  - Level Up 🎉
- **Mute toggle** (persisted across sessions)

### 🔐 Auth & Backend
- **Supabase Authentication** (Email + Password)
- **Row Level Security (RLS)** enabled
- Automatic profile creation using **DB triggers**
- Scores saved to **PostgreSQL** on every game over

### 🏆 Leaderboard
- Global ranking system with 🥇🥈🥉 medals
- Personal **score history**
- Best score per player using **SQL views**

### 🚀 Deployment
- Deployed on **Railway**
- Uses **Nixpacks** for build configuration
- Proper **environment variable management**
- Optimized **Vite production build**

---

## ⚡ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Game Rendering:** Canvas API
- **Audio:** Web Audio API
- **Backend:** Supabase (Auth + Database)
- **Database:** PostgreSQL
- **Deployment:** Railway

---

## 🧠 What I Learned

- Building a game engine from **first principles**
- Working directly with **Canvas API**
- Managing real-time loops and performance
- Designing scalable backend with **RLS**
- Shipping a complete product end-to-end

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Shahjee10/snake_game.git

# Navigate into project
cd snake_game

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🛠️ Build for Production

```bash
npm run build
npm run preview
```

---

## 💡 Future Improvements

- Mobile touch controls 📱
- Power-ups and obstacles ⚡
- Advanced animations & effects ✨

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to:
- Fork the repo
- Create a new branch
- Submit a pull request

---

## 📬 Contact

- LinkedIn: https://www.linkedin.com/in/ahmed-shah-b4a458284  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub — it helps a lot!

---

> Built with passion, shipped fast, and learned a lot 🚀
