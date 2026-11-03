# 🤖 mtagi - Complete Project Guide (Scratch to Advance)
> **Project Name:** mtagi  
> **Created & Developed by:** Abhishek Gupta  
> **Language:** Hinglish (Hindi + English)  

---

## 📌 1. Project Overview (mtagi kya hai?)

**mtagi** ek modern, production-ready, full-stack AI Chatbot application hai jise **Abhishek Gupta** ne banaya hai. Ye chatbot sirf ek normal AI wrapper nahi hai, balki isme:

1. **Persistent Memory:** Ye user ka naam, personality traits aur preferences conversations ke beech yaad rakhta hai (LibSQL database ke through).
2. **Ultra-Fast LLM Inference:** Groq ke LPUs (Language Processing Units) ka use karta hai jisse tokens supersonic speed se stream hote hain.
3. **Live Web Search:** Agar aap current affairs ya latest news puchte ho, toh ye Exa AI search engine ke zariye real-time web search karke answer karta hai.
4. **Auto-Titling:** Conversation start hote hi background me titler agent context samajhkar conversation ka short aur clean title generate karta hai.
5. **Real-time Reasoning:** Groq ke thinking models se reasoning deltas live display hote hain collapsible UI format me.

---

## 🛠️ 2. Tech Stack: Scratch Se Advance Tak Kya Kya Use Hua Hai?

Is project me modern web development aur AI engineering ke sabhi top tools aur frameworks use kiye gaye hain:

### ⚡ A. Runtime & Package Manager
- **Bun (`v1.4.4`)**: Node.js se 10x-20x fast JavaScript runtime aur package manager. Ye dependencies ko super fast resolve aur install karta hai (`bun.lock`).
- **Node.js (`v20+ / v26`)**: Underlying JavaScript execution environment.

### 🌐 B. Frontend & Full-Stack Framework
- **TanStack Start**: React ke liye modern full-stack SSR (Server-Side Rendering) framework.
- **TanStack Router**: File-based type-safe routing (`src/routes/index.tsx`, `src/routes/c/$threadId.tsx`, `src/routes/api/chat.ts`).
- **TanStack Query (React Query)**: Data fetching, caching, aur server state synchronization ke liye (threads, memory updates).
- **React 19**: React ka latest version jisme modern Server Functions, Actions, aur React Compiler optimized rendering shamil hain.

### 🧠 C. AI Agent Architecture (Mtagi Framework)
- **Mastra Core (`@mastra/core`)**: AI agent framework jo tools, memory, workflow orchestration aur LLM providers manage karta hai.
- **Mastra AI SDK (`@mastra/ai-sdk`)**: Vercel AI SDK ke streams ko Mastra agents ke sath bridge karta hai.
- **Mastra Memory (`@mastra/memory`)**: Working memory (cross-thread persistent data) aur conversation threads ko store karta hai.
- **Mastra LibSQL (`@mastra/libsql`)**: SQLite/LibSQL storage adapter jo chat history ko local database me persist karta hai (`mtagi.db`).

### 🚀 D. AI Models & Cloud APIs
- **Groq API**:
  - High-speed LPUs inference provider.
  - **Models used:**
    - `groq/qwen/qwen3.8-27b` (Primary default model - super fast & stable)
    - `groq/openai/gpt-oss-120b` (Deep reasoning & complex task model)
    - `groq/openai/gpt-oss-20b` (Fast conversational model)
- **Exa AI (`exa-js`)**:
  - AI-native search engine API jo web pages crawl karke clean text content return karta hai real-time answers ke liye.

### 🎨 E. UI & Styling
- **Tailwind CSS v4**: Ultra-fast utility-first CSS framework.
- **Base UI (`@base-ui/react`) & Shadcn UI**: Unstyled accessible components (dialogs, popovers, tooltips, buttons).
- **Streamdown**: Markdown streaming renderer with syntax highlighting, LaTeX math KaTeX support, aur Mermaid diagrams.
- **Lucide Icons & Hugeicons**: Clean, modern icons across the UI.

---

## 🔄 3. Architecture & Data Flow (Kaise Kaam Karta Hai?)

```
[User Browser]
      │
      │ 1. User Message Input
      ▼
[TanStack Start Frontend UI]
      │
      │ 2. POST /api/chat (Fetch Stream)
      ▼
[API Route Handler: src/routes/api/chat.ts]
      │
      ├─► [mtagi Agent: src/mtagi/agents/assistant.ts]
      │         │
      │         ├─► [Working Memory (mtagi.db)] (Checks user profile & past traits)
      │         │
      │         ├─► [Exa Web Search Tool] (Triggers if web search toggle is enabled)
      │         │
      │         └─► [Groq API Cloud] (Generates tokens & reasoning)
      │
      ├─► [Titler Agent: src/mtagi/agents/titler.ts] (Auto generates thread title)
      │
      │ 3. Streaming Response (UIMessageStream)
      ▼
[User Browser (UI Updates in Real-Time)]
```

---

## 📂 4. Project Structure (Kaunsi File Kya Karti Hai?)

### 📁 `src/mtagi/` (The Brain of the Chatbot)
- **`src/mtagi/index.ts`**:
  - Central entry point jaha Mtagi instance create hota hai.
  - LibSQL local database configure hoti hai (`mtagi.db`).
  - **Custom Groq Payload Interceptor:** Groq ke payload se `reasoning_content` automatically strip karta hai taaki multi-turn chat me error na aaye.
- **`src/mtagi/agents/assistant.ts`**:
  - Main chatbot agent configuration.
  - Chatbot identity: `mtagi - created by Abhishek Gupta`.
  - Memory aur Web Search tool binding.
- **`src/mtagi/agents/titler.ts`**:
  - Automatic conversation titler agent (`qwen/qwen3.8-27b`).
  - First message ke baad short and smart title generate karta hai.
- **`src/mtagi/tools/web-search.ts`**:
  - Exa AI integration jo live web search queries perform karta hai.

### 📁 `src/config/` (Settings & Schemas)
- **`src/config/models.ts`**:
  - Groq models ki list aur default model selection (`Qwen 3.8 27B`).
- **`src/config/working-memory.ts`**:
  - Zod schema jo define karta hai chatbot ko kya yaad rakhna hai (name, communication traits, preferences).

### 📁 `src/routes/` (TanStack Router Pages & APIs)
- **`src/routes/__root.tsx`**: Root HTML layout, page title ("mtagi - by Abhishek Gupta"), global styles.
- **`src/routes/index.tsx`**: Landing new chat page.
- **`src/routes/c/$threadId.tsx`**: Saved chat thread page jo previous conversation load karta hai.
- **`src/routes/api/chat.ts`**: Server-side streaming endpoint jo AI SDK protocol ke through chunks stream karta hai.

### 📁 `src/server/` (Server Functions)
- **`src/server/threads.ts`**: Threads create, list, clone aur delete karne ke server functions.
- **`src/server/memory.ts`**: Working memory read/update karne ke server functions.
- **`src/server/messages.ts`**: Past messages recall karne ke server functions.

---

## ⚡ 5. Important Bugs Fixed & Optimization (Crucial Engineering Insights)

Jab project OpenRouter se Groq me migrate kiya gaya, tab kuch critical edge-cases solve kiye gaye:

1. **Groq `reasoning_content` Schema Conflict**:
   - *Problem:* Groq ke thinking models reasoning produce karte hain jo memory me store hoti hai. Next turn par jab Mastra purani history Groq ko bhejta hai, toh Groq `property 'reasoning_content' is unsupported` keh kar error throw karta tha.
   - *Solution:* Humne `src/mtagi/index.ts` me global fetch interceptor lagaya jo outgoing requests se `reasoning_content` strip karta hai, bina UI stream ko effect kiye.
2. **Memory Tool Call Nullability**:
   - *Problem:* Groq models optional schema parameters me `null` bhej dete hain. Zod ka `z.string().optional()` reject kar deta tha.
   - *Solution:* Schemas ko `z.string().nullable().optional()` me update kiya.
3. **Observability TLS Socket Drops**:
   - *Problem:* `CloudExporter` background me bina token ke Mastra Cloud par traces send karne ki koshish karta tha jisse socket disconnection warnings aate the.
   - *Solution:* `CloudExporter` ko remove karke clean offline `DefaultExporter` rakha.

---

## 🚀 6. How to Run the Project (Commands)

### Step 1: Environment Variables Setup (`.env`)
File: `openchat/.env`
```env
GROQ_API_KEY=your-groq-api-key
EXA_API_KEY=your-exa-api-key
```

### Step 2: Start Development Server
```bash
~/.bun/bin/bun run dev
```
Server start ho jayega: **`http://localhost:3000`**

### Step 3: Production Build
```bash
~/.bun/bin/bun run build
```

---

## 👨‍💻 7. Developer Credits
- **Project Name:** mtagi
- **Lead Developer:** Abhishek Gupta
- **Technologies:** React 19, TanStack Start, Mastra / Mtagi, Groq LPUs, Exa AI, LibSQL

