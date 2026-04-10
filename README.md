# ⚡ Life Dashboard — To-Do List Life Dashboard

> A clean, minimal, and beautifully designed personal productivity dashboard built with pure HTML, CSS, and Vanilla JavaScript. No frameworks. No backend. Just your browser.

---

## 🌟 Live Preview

Open `index.html` directly in your browser — no server or install required.

---

## 📸 Screenshots

> *Dark Mode (default)*
> *Light Mode*

---

## 📋 Features

### ✅ Core Features (MVP)

| Feature | Description |
|--------|-------------|
| 🕐 **Live Clock** | Real-time digital clock (HH:MM:SS) updated every second |
| 📅 **Date Display** | Shows current day, month, and year |
| 👋 **Smart Greeting** | Greeting changes based on time of day (Morning / Afternoon / Evening / Night) |
| ⏱️ **Focus Timer** | Countdown timer with animated SVG ring progress |
| ▶️ **Timer Controls** | Start, Pause, and Reset buttons |
| ✅ **To-Do List** | Add, edit, mark as done, and delete tasks |
| 💾 **Local Storage** | All tasks and links are saved in the browser — no account needed |
| 🔗 **Quick Links** | Save and open your favorite websites with one click |

---

### 🏆 Bonus Challenges (3/5 Implemented)

| Challenge | Status | Description |
|-----------|--------|-------------|
| 🌙 **Light / Dark Mode** | ✅ Done | Toggle between dark and light theme, respects system preference |
| ✏️ **Custom Name in Greeting** | ✅ Done | Set your name to personalize the greeting (e.g., *Good Morning, Rizky!*) |
| ⏳ **Change Pomodoro Duration** | ✅ Done | Choose from 5, 10, 15, 20, 25, 30, 45, or 60 minutes |
| 🚫 **Prevent Duplicate Tasks** | ✅ Done | App blocks adding identical task names (case-insensitive check) |
| 🔤 **Sort Tasks** | ✅ Done | Sort by A→Z, Z→A, Done Last, Done First, or Default order |

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| **HTML5** | Page structure & semantic markup |
| **CSS3** | Styling, animations, glassmorphism, dark/light theme |
| **Vanilla JavaScript (ES6+)** | App logic, DOM manipulation, timer, storage |
| **CSS Custom Properties** | Dynamic theming (dark/light mode via `[data-theme]`) |
| **Web Storage API** | `localStorage` for persisting tasks, links, name, and theme |
| **SVG** | Animated circular progress ring for the focus timer |
| **Google Fonts** | `Inter` and `Space Grotesk` for premium typography |

> ⚠️ No frameworks, no libraries, no build tools — 100% native web technologies.

---

## 📁 Folder Structure

```
CodingCamp-6Apr26-RizkyDN/
│
├── index.html          # Main HTML file (entry point)
│
├── css/
│   └── style.css       # All styles (theme, layout, animations)
│
├── js/
│   └── app.js          # All JavaScript logic
│
└── README.md           # Project documentation
```

> 📌 **Folder Rules Applied:**
> - Only **1 CSS file** inside `css/`
> - Only **1 JavaScript file** inside `js/`

---

## 🚀 How to Run

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/your-username/CodingCamp-6Apr26-RizkyDN.git
   ```

2. **Open** `index.html` in any modern browser:
   ```
   Double-click index.html
   — or —
   Right-click → Open with → Chrome / Firefox / Edge
   ```

3. That's it! No installation, no server, no setup. 🎉

---

## 💡 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + T` | Focus the task input field |
| `Alt + Space` | Start / Pause the focus timer |
| `Enter` | Submit a new task or quick link |
| `Escape` | Cancel task edit |

---

## 🌐 Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Google Chrome | ✅ |
| Mozilla Firefox | ✅ |
| Microsoft Edge | ✅ |
| Safari | ✅ |

---

## 🧠 How Data is Stored

All data is stored **locally in your browser** using the `localStorage` API:

| Key | Data Stored |
|-----|------------|
| `tasks` | Array of to-do task objects |
| `quickLinks` | Array of saved link objects |
| `userName` | Your custom name for greeting |
| `theme` | Current theme preference (`dark` or `light`) |

> No data is sent to any server. Everything stays on your device.

---

## 👨‍💻 Author

**Rizky Dwi Nugroho**  
Coding Camp — RevoU Software Engineering Track  
📅 April 2026

---

## 📄 License

This project is created for educational purposes as part of the RevoU Coding Camp program.
