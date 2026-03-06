# 🤖 Little AI Beings

> Визуальный симулятор команды AI-агентов / Visual AI agent team simulator

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Language](https://img.shields.io/badge/Language-RU%20%7C%20EN-blue)](#-multilanguage)

**[🇷🇺 Русский](#-описание) | [🇬🇧 English](#-description)**

---

## 🇷🇺 Описание

Интерактивное веб-приложение, где команда AI-агентов работает над вашей задачей прямо на экране. Агенты перемещаются по офисным зонам, общаются, исследуют, генерируют идеи и выдают структурированный результат.

### ✨ Возможности

- **6 уникальных агентов** с разными ролями:
  - 🎩 **Макс** — Менеджер (планирует и координирует)
  - 🔍 **Рита** — Исследователь (ищет в библиотеке знаний)
  - 💡 **Игорь** — Идеи (генерирует креативные решения)
  - 🔬 **Аня** — Аналитик (работает с архивом данных)
  - ✍️ **Вася** — Писатель (создаёт финальный контент)
  - ⚡ **Коля** — Критик (проверяет качество)

- **6 офисных зон**: Общий стол, Кабинет менеджера, Библиотека, Архив, Лаборатория, Доска результатов
- **Поддержка Anthropic Claude API** и **локальных моделей Ollama**
- **Управление в реальном времени**: пауза, корректировка задачи, заморозка агентов
- **7 типов результатов**: контент-паки, документы, код, аналитика, стратегия, исследование, презентация
- **4 стиля персонажей**: Современный, Минималистичный, Детальный, Точка
- **Мультиязычность**: 🇷🇺 Русский / 🇬🇧 English

---

## 🇬🇧 Description

An interactive web app where an AI agent team works on your task in real time. Agents move across office zones, communicate, research, brainstorm, and produce structured output.

### ✨ Features

- **6 unique agents** with distinct roles:
  - 🎩 **Max** — Manager (plans & coordinates)
  - 🔍 **Rita** — Researcher (searches the knowledge library)
  - 💡 **Igor** — Ideas (generates creative solutions)
  - 🔬 **Anna** — Analyst (works with the data archive)
  - ✍️ **Vasya** — Writer (creates the final content)
  - ⚡ **Kolya** — Critic (reviews quality)

- **6 office zones**: Common Area, Manager's Office, Knowledge Library, Internal Archive, Laboratory, Results Board
- **Supports Anthropic Claude API** and **local Ollama models**
- **Real-time control**: pause, mid-session corrections, agent freeze
- **7 output types**: content packs, documents, code, analysis, strategy, research, presentations
- **4 character styles**: Modern, Minimal, Detailed, Dot
- **Multilanguage**: 🇷🇺 Russian / 🇬🇧 English

---

## 🚀 Quick Start / Быстрый старт

### 1. Clone / Клонировать

```bash
git clone https://github.com/YOUR_USERNAME/little-ai-beings.git
cd little-ai-beings
```

### 2. Install / Установить

```bash
npm install
```

### 3. Configure API key / Настроить API ключ

```bash
cp .env.example .env
# Edit .env and add your Anthropic key
```

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

> 🔑 Get your key at [console.anthropic.com](https://console.anthropic.com)  
> ⚠️ Never commit `.env` to git — it's already in `.gitignore`

### 4. Run / Запустить

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🦙 Ollama (Local / Локально — бесплатно)

Run AI agents completely locally without any API key:

1. Install [Ollama](https://ollama.com)
2. Start with CORS enabled:
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```
3. Pull a model:
   ```bash
   ollama pull llama3
   # or: ollama pull mistral
   # or: ollama pull phi3
   ```
4. In the app, switch to **🦙 Ollama** in the top bar

---

## 🌐 Multilanguage

The UI and all agent prompts switch between **Russian** and **English** via the language dropdown (🇷🇺/🇬🇧) in the top-right corner. Agent names also adapt:

| ID | 🇷🇺 Russian | 🇬🇧 English |
|----|------------|------------|
| manager | Макс | Max |
| researcher | Рита | Rita |
| ideas | Игорь | Igor |
| analyst | Аня | Anna |
| writer | Вася | Vasya |
| critic | Коля | Kolya |

---

## 🏗 Project Structure / Структура

```
little-ai-beings/
├── src/
│   ├── App.jsx        # Main application + i18n + agents
│   └── main.jsx       # Entry point
├── index.html
├── vite.config.js
├── package.json
├── .env.example       # API key template
├── .gitignore
└── README.md
```

---

## 🔧 Build / Сборка

```bash
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

---

## 🖥 Deploy / Деплой

### Vercel (recommended)
```bash
npm i -g vercel
vercel
# Add VITE_ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
# Add env var VITE_ANTHROPIC_API_KEY in Netlify settings
```

---

## ⚙️ How It Works / Как это работает

```
User Task → Max (Manager) analyzes & picks team
     ↓
Step 1: Agents move to their zones
Step 2: Manager briefs the team
Step 3: Team works in the Laboratory
Step 4: Final review & board output
     ↓
Structured JSON result rendered in modal
```

---

## 👤 Author / Автор

**Marat Levykin**

- 📺 YouTube: [@maratArtificialInelligence](https://www.youtube.com/@maratArtificialInelligence)
- 💬 VK: [vk.com/ProfAI](https://vk.com/ProfAI)

---

## 📄 License / Лицензия

[MIT](LICENSE) — free to use, modify and distribute.
