# Westgate-Sindjelic

## Overview

Full-stack web app using Next.js (Pages Router) + TypeScript for frontend, PostgreSQL for database, and Docker for local DB. Backend logic is handled via API routes and separate DB helpers.

## Structure

```
westgate-sindjelic/
├─ frontend/          # Next.js pages & components
│  ├─ pages/          # Pages Router
│  │   ├─ index.tsx
│  │   └─ api/        # API routes (server-side)
│  ├─ components/     # Reusable UI components
│  ├─ styles/         # CSS
│  ├─ _app.tsx        # Global wrapper
│  └─ _document.tsx   # HTML structure
├─ backend/           # DB helpers and scripts
│  ├─ lib/db.ts       # PostgreSQL connection
│  └─ scripts/        # Optional seed/migration scripts
├─ docker-compose.yml # Docker PostgreSQL
├─ .env.local         # Env variables (DATABASE_URL)
├─ package.json
├─ tsconfig.json
└─ next-env.d.ts
```

## How It Works

* Pages render UI and call API routes.
* API routes run server-side and query the database using backend helpers.
* Data flows: `Browser → Frontend Page → API Route → Database → API Route → Frontend → Browser`

## Quick Start

1. Install dependencies: `npm install`
2. Start Docker DB: `docker-compose up -d`
   - Automatically creates database `westgate_db` with user `postgres`
3. (Optional) Seed the database: `ts-node backend/scripts/seed.ts`
4. Run app: `npm run dev`
5. Visit: [http://localhost:3000](http://localhost:3000)