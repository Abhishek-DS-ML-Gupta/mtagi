# mtagi 🤖

> An intelligent, full-stack AI chatbot and autonomous assistant platform created and built by **Abhishek Gupta** (2026). Powered by **Mtagi Agentic Engine**, **Groq LLM Acceleration**, **TanStack Start**, and **React 19**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built by](https://img.shields.io/badge/Author-Abhishek%20Gupta-orange.svg)](#creator--author)
[![Year](https://img.shields.io/badge/Year-2026-green.svg)](#)
[![Runtime](https://img.shields.io/badge/Runtime-Bun%20%7C%20Node%2022+-black.svg)](https://bun.sh)

---

## 🌟 Overview

**mtagi** is an advanced AI chat application that combines cutting-edge agentic workflows with low-latency LLM inference. Designed with persistent cross-thread working memory, real-time web search capabilities, graphic design generation, and automated `.pptx` presentation generation with instant downloads.

---

## ✨ Features

- **🧠 Intelligent Agent (`mtagi`)**: Created by **Abhishek Gupta**, offering direct, helpful, and context-aware responses.
- **⚡ Blazing Fast Inference**: Standardized on Groq's high-throughput infrastructure with automated rate-limit retry backoff and sliding context windows.
- **💾 Persistent Working Memory**: Built on local LibSQL SQLite store (`mtagi.db`), remembering user details, preferences, and traits across conversation threads.
- **🔍 Real-Time Web Search**: Integrated with Exa Search API for up-to-the-minute web intelligence, news, and research.
- **🎨 Canva & Presentation Design Engine**:
  - Automatically drafts complete slide-by-slide blueprints (titles, bullet points, KPI cards, visual themes, speaker notes).
  - **1-Click `.pptx` Download**: Generates ready-to-open 16:9 widescreen PowerPoint presentation files on the fly.
  - **Canva Integration**: Direct links to open designs in Canva, search relevant templates, and connect accounts via OAuth PKCE.
- **🧵 Advanced Thread Management**: Create, view, search, branch, and delete conversations with automatic thread titling.
- **🎨 Modern UI/UX**: Built with Tailwind CSS v4, Radix/Base UI, Dark/Light theme switching, and Streamdown rendering (Mermaid diagrams, KaTeX LaTeX math, code highlighting).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend & SSR** | [React 19](https://react.dev), [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router) |
| **AI & Agent Core** | [Mtagi Engine / Mastra](https://mastra.ai), [Vercel AI SDK](https://sdk.vercel.ai) |
| **LLM Provider** | [Groq](https://groq.com) (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`) |
| **Search Engine** | [Exa AI Search](https://exa.ai) |
| **Design & PPTX** | [Canva Connect REST API](https://www.canva.dev), [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) |
| **Storage & Memory** | [LibSQL](https://github.com/tursodatabase/libsql) (Embedded SQLite) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com), Lucide Icons, Hugeicons |
| **Runtime & Tooling** | [Bun](https://bun.sh), [Vite](https://vitejs.dev), TypeScript, Biome |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.2+) or Node.js (v20.19+ / v22+)
- A [Groq API Key](https://console.groq.com/keys)
- An [Exa API Key](https://dashboard.exa.ai) *(optional, for live web search)*
- Canva Developer Credentials *(optional, for Canva Connect OAuth)*

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhishek-DS-ML-Gupta/Agent_2.git
   cd Agent_2/openchat
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your API credentials:
   ```env
   # LLM Provider
   GROQ_API_KEY=your_groq_api_key_here

   # Web Search
   EXA_API_KEY=your_exa_api_key_here

   # Canva Developer API (Optional)
   CANVA_CLIENT_ID=your_canva_client_id
   CANVA_CLIENT_SECRET=your_canva_client_secret
   CANVA_REDIRECT_URI=http://localhost:3000/api/canva/callback
   ```

---

## 💻 Running the Application

### Development Server
```bash
bun run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

### Test Mtagi Agent Engine
```bash
bun run test:mastra
```

### Production Build
```bash
bun run build
bun run preview
```

### Linting & Formatting
```bash
bun run lint
bun run format
bun run check
```

---

## 📁 Project Architecture

```
openchat/
├── src/
│   ├── components/            # UI components (sidebar, chat-interface, message renderers)
│   ├── config/                # Model settings & persistent working memory schemas
│   ├── lib/                   # PPTX builder, Canva OAuth service, chat helpers
│   ├── mtagi/                 # Core AI agent engine
│   │   ├── agents/            # Assistant agent & titler agent
│   │   ├── tools/             # Real-time Web Search & Canva design tools
│   │   └── index.ts           # Mtagi instance & LLM interceptors
│   ├── routes/                # TanStack Start file-based routing
│   │   ├── api/chat.ts        # Streaming chat endpoint
│   │   ├── api/download/pptx.ts # Instant .pptx presentation download
│   │   ├── api/canva/         # Canva OAuth authorization & callbacks
│   │   └── index.tsx          # Main chat interface view
│   └── styles.css             # Tailwind CSS v4 root stylesheet
├── scripts/                   # Verification & test scripts
├── mtagi.db                   # Local LibSQL SQLite memory store
├── LICENSE                    # MIT License (2026 Abhishek Gupta)
└── README.md                  # Project documentation
```

---

## 👤 Creator & Author

**Abhishek Gupta**  
- **Role**: Creator, AI Architect & Lead Developer  
- **Year**: 2026  
- **Project**: mtagi (Agent_2)  
- **GitHub**: [@Abhishek-DS-ML-Gupta](https://github.com/Abhishek-DS-ML-Gupta)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Abhishek Gupta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
