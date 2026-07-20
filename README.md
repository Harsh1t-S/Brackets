# Bracket

A coding-practice platform — curated problems, an in-browser workspace, and
progress tracking. Live at [bracketx.vercel.app](https://bracketx.vercel.app).

## Stack

| Part | Tech |
|---|---|
| `client/` | React 18 · Vite · TypeScript · Tailwind v4 · TanStack Query |
| `server/` | Express 5 · TypeScript · Prisma · PostgreSQL |

## Local development

```bash
# API
cd server
cp .env.example .env      # fill in DATABASE_URL + JWT_SECRET
npm install
npx prisma db push        # sync schema
npx prisma db seed        # seed problems (additive — safe to re-run)
npm run dev               # http://localhost:5000

# Client (second terminal)
cd client
npm install
npm run dev               # http://localhost:5173
```

The client's API base URL lives in `client/src/lib/axios.ts`.

## Deployment

- **Client** → Vercel (root directory `client`; SPA rewrites via `client/vercel.json`)
- **API** → Railway (root directory `server`; build `npm run build`, start `npm start`)
- Schema changes: `npx prisma db push` against the production `DATABASE_URL`.

## Scripts

| Where | Command | What |
|---|---|---|
| client | `npm run dev` / `build` / `lint` | Vite dev server / production build / ESLint |
| server | `npm run dev` / `build` / `start` | tsx watch / tsc / run compiled build |
| server | `npx prisma db seed` | Upsert the seed problem set |
