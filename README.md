# Cyberbullying Support Platform

**🏆 1st place: Tech4Good Hackathon (IADE × PSP challenge, 2026)**

A full-stack platform built for the **Portuguese Public Security Police (PSP)** to help victims of cyberbullying understand what is happening to them, keep evidence, and know when and how to report it.

A user pastes a message or uploads a screenshot of a conversation; the backend uses **Google Gemini** to classify it (harassment, threat, image exposure, impersonation…), rate its severity and suggest concrete next steps, including whether to contact the police. The platform also has an AI support assistant, educational content and a map of PSP stations.

---

## Features

- **Text triage**: classifies a message into a category and severity (`low` / `medium` / `high`), with a short summary, the signals detected and recommended actions.
- **Screenshot analysis**: multimodal triage of uploaded images (prints of chats, posts or comments).
- **Support assistant**: chat sessions with an AI assistant, stored per user; plus a lightweight website chatbot.
- **History**: every analysis and chat is saved and visible in the user's profile.
- **PSP station locator**: Google Maps view of nearby stations.
- **Learning pages**: types of cyberbullying, how to act, where to get help.

## Architecture

```
┌─────────────────────────────┐   REST /api/v1 + JWT   ┌──────────────────────────────────────┐
│ psp-frontend                │ ─────────────────────▶ │ psp-backend (NestJS)                 │
│ React · Vite · Tailwind     │                        │                                      │
│ Framer Motion · Google Maps │ ◀───────────────────── │ auth · ai-triage · print-analysis    │
└─────────────────────────────┘                        │ chat · chatbot · users               │
                                                       └───────┬───────────────────┬──────────┘
                                                               │ Prisma            │ @google/genai
                                                               ▼                   ▼
                                                          PostgreSQL          Gemini API
```

**Backend** (`psp-backend/`): NestJS, organised by feature modules.

| Module | Responsibility |
|---|---|
| `auth` | Register / login, bcrypt hashing, JWT (Passport strategy + guard) |
| `ai-triage` | Text analysis → structured triage result, stored as an `AnalysisRequest` |
| `print-analysis` | Image upload (Multer: type and 10 MB size limits) → multimodal analysis |
| `chat` | Persistent assistant conversations (`ChatSession`, `ChatMessage`) |
| `chatbot` | Stateless website assistant |
| `users` | Profile, history of analyses and chats |
| `integrations/gemini` | Single Gemini client; prompts force JSON output, which is parsed and **validated with zod** before it reaches the database |

Cross-cutting: global exception filter, logging and response interceptors, `class-validator` DTOs, **Joi validation of environment variables at startup**, Helmet, global **rate limiting** (also limits spending on the AI API), and **Swagger** at `/api/docs`.

Uploaded evidence is kept on the server and only read by the backend; it is never exposed as a public static folder.

### Data model (Prisma)

`User` · `AnalysisRequest` (input type, status, classification, severity) · `UploadedEvidence` · `ChatSession` · `ChatMessage` (role: user / assistant / system)

## API (main routes)

Prefix: `/api/v1` · full reference in Swagger (`/api/docs`).

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register`, `/auth/login` | Account and JWT |
| `GET` | `/auth/me` | Current user |
| `POST` | `/ai-triage/analyze-text` | Analyse a message |
| `POST` | `/print-analysis/upload` | Upload a screenshot for analysis |
| `GET` | `/print-analysis/:id/result` | Result of an image analysis |
| `POST` | `/chat/sessions` | Start an assistant conversation |
| `POST` | `/chat/sessions/:id/messages` | Send a message |
| `POST` | `/chatbot/message` | Website chatbot |
| `GET` | `/users/me/history`, `/users/me/analyses`, `/users/me/chats` | User history |

## Running locally

Requirements: Node.js 20+, PostgreSQL, a Gemini API key and (for the map) a Google Maps key.

```bash
# backend
cd psp-backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run start:dev                 # http://localhost:3000/api/v1 · docs at /api/docs

# frontend
cd ../psp-frontend
cp .env.example .env              # VITE_API_URL=http://localhost:3000/api/v1
npm install
npm run dev                       # http://localhost:5173
```

All keys are read from environment variables; the backend refuses to start if a required one is missing.

## Tech stack

| | |
|---|---|
| Backend | TypeScript, NestJS 11, Prisma 7, PostgreSQL, Passport JWT, bcrypt, Multer, Joi, zod, Helmet, @nestjs/throttler, Swagger |
| AI | Google Gemini (`@google/genai`): text and image input, JSON output |
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router, Google Maps (`@vis.gl/react-google-maps`) |
