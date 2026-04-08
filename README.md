# 🤖 AI Task Orchestrator

> An AI-powered goal and roadmap management dashboard that generates intelligent task breakdowns from your goals using Google Gemini AI.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Authentication](#-authentication)

---

## 🌟 Overview

AI Task Orchestrator is a full-stack web application that helps you break down your goals into actionable, AI-generated roadmaps. Provide a goal like *"Learn TypeScript in 30 days"* and the app will automatically generate a structured roadmap with tasks, descriptions, and headings — powered by **Google Gemini AI**.

Each user's data is completely isolated — you can only see and manage your own roadmaps.

---

## ✨ Features

- 🔐 **Secure Authentication** — Email/password login & Google OAuth via Passport.js
- 🤖 **AI Roadmap Generation** — Instantly create structured task roadmaps from any goal using Google Gemini
- 🗂️ **Goal Management** — View, edit, regenerate, and delete your goals and individual tasks
- 📊 **History Tracking** — Browse all past goals with completion and in-progress status
- 🔍 **Global Search** — Search across all your goals by title in real-time
- 👤 **User Profile** — Update your name and email from the settings page
- 🚪 **Session Management** — Secure server-side sessions with cookie-based auth (no localStorage)
- 🎨 **Modern UI** — Dark mode, glassmorphism, micro-animations, and responsive design

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **TypeScript** | Type safety |
| **MongoDB + Mongoose** | Database |
| **Passport.js** | Authentication strategy (Local + Google OAuth) |
| **express-session** | Server-side session management |
| **Google Gemini AI (`@google/genai`)** | AI roadmap generation |
| **bcrypt** | Password hashing |
| **nodemon / tsx** | Development server |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Redux Toolkit** | Global state management |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |
| **React Draggable** | Drag-and-drop task ordering |
| **ShadCN UI** | Component primitives |

---

## 📁 Project Structure

```
Ai-Task Orchestrator/
├── backend/
│   ├── middleware/
│   │   └── auth.middleware.ts      # Session-based auth guard
│   └── src/
│       ├── config/
│       │   └── db.ts               # MongoDB connection
│       ├── controller/
│       │   ├── auth.controller.ts  # Register, Login, Logout, Refresh
│       │   └── goal.controller.ts  # CRUD + AI generation + Settings
│       ├── lib/
│       │   ├── passport.ts         # Passport.js strategy config
│       │   └── prompt.ts           # Gemini AI system prompt
│       ├── model/
│       │   ├── user.model.ts       # User schema
│       │   └── gaols.mondel.ts     # Goal + Task schema
│       ├── router/
│       │   ├── auth.router.ts      # /api/auth routes
│       │   └── goal.route.ts       # /api routes (goals, settings)
│       └── server.ts               # Express app entry point
│
└── frontend/
    ├── app/
    │   ├── features/
    │   │   ├── authSlice.ts        # Authentication state & thunks
    │   │   └── goalSlice.ts        # Goal state & API thunks
    │   ├── hooks/
    │   │   └── reduxHooks.ts       # Typed dispatch & selector hooks
    │   └── store.ts                # Redux store configuration
    └── src/
        ├── components/
        │   ├── layouts/            # DashboardLayout, AuthLayout
        │   └── ui/                 # Sidebar, TopNav, Button, etc.
        ├── features/
        │   └── settings/
        │       └── components/     # ProfileForm, SettingsSidebar, etc.
        ├── pages/
        │   ├── Dashboard.tsx       # Main goal dashboard
        │   ├── MyGoals.tsx         # All goals list
        │   ├── GoalRoadmap.tsx     # Individual roadmap view
        │   ├── History.tsx         # Goal history + search
        │   ├── Settings.tsx        # User profile & settings
        │   ├── Login.tsx           # Login page
        │   └── Signup.tsx          # Registration page
        └── App.tsx                 # Router + auth guard
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Google Cloud** project with OAuth credentials enabled
- **Google Gemini API** key from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Ai-Task-Orchestrator.git
cd Ai-Task-Orchestrator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/ai-task-orchestrator
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_super_secret_session_key
BETTER_AUTH_URL=http://localhost:4001
```

Start the backend server:

```bash
npm run dev
```

The backend will run on **http://localhost:4001**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will run on **http://localhost:5173**

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Backend server port (default: `4001`) | ✅ |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `GEMINI_API_KEY` | Google Gemini AI API key | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `JWT_SECRET` | Session secret key (keep this private!) | ✅ |

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login with email & password | ❌ |
| `GET` | `/logout` | End session and clear cookie | ✅ |
| `GET` | `/me` | Get currently authenticated user | ✅ |
| `POST` | `/refresh` | Verify and refresh session | ✅ |
| `GET` | `/google` | Initiate Google OAuth flow | ❌ |
| `GET` | `/google/callback` | Google OAuth callback | ❌ |

---

### Goal Routes — `/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard` | Get all goals for the user |
| `POST` | `/dashboard` | Create a goal + generate AI roadmap |
| `GET` | `/goals` | Get all user goals |
| `GET` | `/goals/:id` | Get a specific goal by ID |
| `PUT` | `/goals/:id` | Edit goal title |
| `DELETE` | `/goals/:id` | Delete an entire goal |
| `POST` | `/goals/:id/regenerate` | Regenerate AI roadmap for a goal |
| `PUT` | `/goals/:id/tasks/:taskId` | Edit a specific task |
| `DELETE` | `/goals/:id/tasks/:taskId` | Delete a specific task |
| `GET` | `/history` | Get goal history with status counts |
| `GET` | `/search` | Search goals by title (`?query=`) |
| `GET` | `/settings` | Get user profile data |
| `PUT` | `/settings` | Update user name and email |

> All goal routes require authentication via a valid session cookie.

---

## 🔐 Authentication

This app uses **Passport.js with session-based authentication** (no JWT tokens in localStorage).

- Sessions are managed server-side using `express-session`
- The browser automatically sends the `connect.sid` session cookie with every request
- All frontend API calls use `credentials: "include"` to enable cookie transmission
- Google OAuth is also supported for one-click sign-in
- All data is **strictly user-isolated** — users can only access their own goals

---

## 📸 Screenshots

> _Coming soon_

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Built with ❤️ using React, Node.js, and Google Gemini AI</p>
</div>
