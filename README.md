# 🤖 AI Interview Assistant

> _An AI-powered interview simulator built entirely in React — no backend required._
---

## 🧠 Overview

**AI Interview Assistant** is a web-based interactive platform that simulates real interviews using AI.  
Candidates can upload their resumes, interact with an AI interviewer, and get scored automatically — all inside the browser.  

It’s built with **React**, uses **Zustand** for global state management, and calls the **Groq API** directly from the frontend for question generation and evaluation.  
No backend or database setup required 🚀  

---

## ✨ Features

- 🧾 **Smart Resume Parsing** — Extracts name, email, and phone using regex or prompts user for missing data.  
- 💬 **AI-Powered Chat Interview** — Real-time, conversational interview simulation powered by Groq API.  
- ⚙️ **Zustand State Management** — Lightweight and fast global state for candidate details, chat logs, and results.  
- 🧠 **Dynamic Question Flow** — Each question adapts to candidate’s previous response contextually.  
- 👩‍💼 **Interviewer Dashboard** — Separate view to review candidate performance and scores.  
---

## 🧩 Tech Stack

| Layer | Tools Used |
|:------|:------------|
| **Frontend** | React (Vite) |
| **State Management** | Zustand |
| **Styling** | Tailwind CSS |
| **Resume Parsing** | pdf.js, mammoth.js |
| **AI Integration** | Groq API |
| **Build Tool** | Vite |

---

## 🏗️ Project Structure
AI-Interview-Assistant/
│
├── public/
│ └── favicon.ico
│
├── src/
│ ├── components/
│ │ ├── ChatBox.jsx
│ │ ├── ResumeUpload.jsx
│ │ └── ResultCard.jsx
│ │
│ ├── pages/
│ │ ├── IntervieweePage.jsx
│ │ └── InterviewerPage.jsx
│ │
│ ├── store/
│ │ └── useInterviewStore.js
│ │
│ ├── styles/
│ │ └── interviewee.css
│ │
│ ├── utils/
│ │ └── resumeParser.js
│ │
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
│
├── .env.example
├── .gitignore
├── package.json
└── README.md

---

## ⚙️ Setup Instructions

### 🔹 1. Clone the Repository
```bash
git clone https://github.com/charvi16/AI-Interview-Assistant.git
cd AI-Interview-Assistant

🔹 2. Install Dependencies
npm install

🔹 3. Create Environment File

Create a file named .env in the root directory:

VITE_GROQ_API_KEY=your_api_key_here


⚠️ Don’t commit .env to GitHub. It’s already listed in .gitignore.

🔹 4. Run the App
npm run dev


Now open http://localhost:5173
 in your browser.
