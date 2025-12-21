Westgate-Sindjelic
Overview
A full-stack web application designed for a semi-pro soccer club. Built with Next.js (App Router), Node.js, PostgreSQL, and Docker.

Future Project Structure (Roadmap)
This is the planned structure for the club website. Use this as your guide while building:

westgate-sindjelic/    (the aim of what the repo should look like in the end)
├─ frontend/
│  ├─ src/app/
│  │  ├─ (auth)/               # Grouped routes for Auth
│  │  │  ├─ login/page.tsx      # Log-in page
│  │  │  └─ signup/page.tsx     # Sign-up page
│  │  ├─ teams/
│  │  │  ├─ [id]/page.tsx       # Dynamic page for specific teams
│  │  │  └─ page.tsx            # Overview of all club teams
│  │  ├─ players/
│  │  │  └─ page.tsx            # Player roster/profiles
│  │  ├─ schedule/
│  │  │  └─ page.tsx            # Upcoming matches & results
│  │  ├─ layout.tsx             # Global Nav & Footer
│  │  └─ page.tsx               # Homepage (Landing Page)
│  ├─ components/               # Reusable UI (Buttons, Cards, Nav)
│  └─ lib/                      # Frontend utilities (API fetching)
├─ backend/
│  ├─ routes/                   # API Endpoints
│  │  ├─ auth.js                # Auth logic (JWT/Sessions)
│  │  ├─ players.js             # Player data endpoints
│  │  └─ matches.js             # Match/Score endpoints
│  ├─ models/                   # Database schemas
│  ├─ index.js                  # Server entry point
│  └─ package.json
├─ docker-compose.yml           # Database & App orchestration
└─ README.md


How It Works
Authentication: Users can sign up and log in to access member-only areas (like internal team stats).

Dynamic Routing: The teams/[id] structure allows you to have one template that works for every team in the club (Seniors, U21s, etc.).

Data Flow: Next.js Frontend ↔ Node.js Backend ↔ PostgreSQL Database.

Quick Start
1. Prerequisite: macOS Port Fix

Before starting, ensure AirPlay Receiver is turned OFF in your macOS System Settings (General > AirPlay & Handoff). This frees up Port 5000 for your Backend API.

2. Launch the Environment

Everything is automated via Docker. Run the following in the root folder:

docker compose up --build


3. Links

Frontend: http://localhost:3000 (Your soccer site)

Backend API: http://localhost:5000 (Data source)

Database Details
Type: PostgreSQL

Database Name: westgate_db

User: user | Password: password

Access: Accessible locally on port 5432 if using a DB manager like TablePlus or pgAdmin.






Made By:
- Lav Bujak (bujaklav@gmail.com)
- 
- 