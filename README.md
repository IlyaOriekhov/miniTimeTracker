# Mini Time Tracker

Mini Time Tracker is a simplified time tracking web app (test task for Viso Academy) that lets you create time entries and see entry history grouped by date with daily totals and a grand total.

## Tech stack

- Frontend: React + TypeScript (Vite) + Material UI
- Backend: Node.js + Express + TypeScript
- Database: Prisma ORM + SQLite/PostgreSQL (via `DATABASE_URL`)

## Features (per requirements)

- Time entry form:
  - Date picker (default: today)
  - Project dropdown (hardcoded options)
  - Hours input
  - Work description textarea
  - Save button
- Entry history:
  - Entries grouped by date
  - Columns: Date | Project | Hours | Description
  - Total hours per day + grand total
- Validation:
  - All fields required
  - Hours must be a positive number
  - Maximum 24 hours per calendar date

## Project structure

- `frontend/` – React + TS client app
- `backend/` – Express + TS REST API

## How to run locally

### Prerequisites

- Node.js (LTS)
- npm

### 1) Backend setup

```bash
cd backend
npm install
```

Create `.env` from example:

```bash
cp .env.example .env
```

Set at least:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start backend:

```bash
npm run dev
```

Backend will be available at `http://localhost:4000` (or the `PORT` you set).

### 2) Frontend setup

```bash
cd ../frontend
npm install
```

Create `.env` from example:

```bash
cp .env.example .env
```

Set API URL:

```env
VITE_API_URL="http://localhost:4000"
```

Start frontend:

```bash
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## API (basic)

> Exact routes may be found in `backend/src/routes`.

Typical endpoints:

- `GET /entries` – list entries
- `POST /entries` – create entry

## Notes

- UI library: MUI is used for basic usability and error handling.
- Prisma is used to manage DB schema and migrations.
