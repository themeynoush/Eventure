# Eventure – Local Events Radar

Discover nearby events, hotels, and restaurants, check-in, chat with others in real time, and manage content via an admin dashboard. Built with Next.js App Router, Prisma (Postgres), NextAuth (JWT/credentials), Leaflet, and Socket.io.

## Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- Prisma + PostgreSQL
- NextAuth (JWT Credentials)
- Socket.io (presence + chat)
- Leaflet + OSM tiles

## Quickstart

1) Clone and install
```bash
git clone <your-repo-url> && cd eventure
npm install
```

2) Configure environment
```bash
cp .env.example .env
# edit DATABASE_URL, NEXTAUTH_SECRET, external API keys
```

3) Run Postgres (docker)
```bash
docker run --name eventure-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=eventure -p 5432:5432 -d postgres:16
```

4) Initialize DB
```bash
npm run prisma:generate
npm run prisma:push
npm run db:seed
```

5) Start socket server and web app
```bash
npm run dev:all
# Next.js: http://localhost:3000
# Socket.io: http://localhost:4001
```

6) Login
- Admin user: admin@example.com / admin123
- Create your account at /register

## Deployment
- Frontend/Backend: Vercel
- Database: Supabase or Railway
- Socket server: Railway/Fly.io/Render (set `NEXT_PUBLIC_SOCKET_URL`)
- Set all env vars in your hosting dashboard
- Run migrations with `prisma migrate deploy`

## Project Structure
- `src/app` – routes and UI
  - `layout.tsx` – root layout, providers
  - `page.tsx` – home (map + lists + filters)
  - `(auth)/login` – sign in
  - `(auth)/register` – sign up
  - `profile` – profile editor
  - `messages` – chat UI
  - `admin` – admin dashboard
  - `api/*` – API routes (events, places, users, auth, checkins, conversations, messages, admin)
- `src/components` – `Navbar`, `Map`, `Filters`, `Lists`
- `src/server/auth.ts` – NextAuth config (JWT credentials)
- `src/lib/db.ts` – Prisma client singleton
- `src/lib/validation.ts` – zod schemas
- `src/state/useFiltersStore.ts` – client state
- `prisma/schema.prisma` – data model
- `prisma/seed.ts` – seed data
- `socket-server/index.js` – Socket.io server

## Notes
- Uses browser geolocation to set map center and fetch nearby results
- Filters by category, distance, and date
- Chat uses socket server for realtime fan-out, with REST persistence
- Admin routes protected by middleware
- Replace Google/Eventbrite keys in `.env` for production-quality data
