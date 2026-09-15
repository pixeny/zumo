# Zumo

An "Adaptive OS"-style marketing site + live chat support platform: a dark
landing page, an AI live-chat widget backed by Supabase + an LLM, and a small
internal dashboard (Contact Center inbox, CRM, Storage, Analytics, AI Team
settings).

## Stack
- **Client**: React + Vite, plain CSS
- **Backend**: Node.js + Express (chat AI replies, ImgHippo uploads)
- **Database/Auth/Realtime**: Supabase
- **Image hosting**: ImgHippo API

## 1. Set up Supabase
1. Create a project at supabase.com.
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) — creates
   all tables, RLS policies, and enables Realtime on `conversations`/`messages`.
3. In Authentication settings, enable **Anonymous sign-ins** (used by the chat
   widget for visitors) and **Email** sign-in (used by agents).
4. Copy your Project URL, `anon` public key, and `service_role` secret key.

## 2. Configure environment variables
```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```
Fill in:
- `client/.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `server/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (**never** expose
  this in the client), `IMGHIPPO_API_KEY`, `ANTHROPIC_API_KEY`

## 3. Install & run
```bash
cd client && npm install && npm run dev
cd server && npm install && npm run dev
```
Client runs on http://localhost:5173, server on http://localhost:8787.

## 4. Create your first agent account
Sign up at `/signup` — this creates a Supabase auth user and a `profiles` row
with `role: 'agent'`, giving access to `/dashboard`.

## Notes
- Branding is centralized in [`client/src/config/brand.js`](client/src/config/brand.js).
- The AI assistant's name/persona/system prompt are editable from
  `/dashboard/ai-team` (stored in the `ai_settings` table) and used by
  `server/src/routes/chat.js` when generating replies.
- Anonymous visitors get a Supabase anonymous session; their conversation is
  tracked in `localStorage` so the widget resumes the same thread on reload.
