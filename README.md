# Fitness Challenge

A full-stack gamified fitness tracking app. Users log activities across six
sports (running, walking, cycling, gym, swimming, daily steps), which are
normalized into a unified points system and ranked on a global leaderboard.
Each user also gets a personal dashboard with activity history, a
points-over-time trend, and a sport-preference breakdown.

See [`DESIGN.md`](./DESIGN.md) for the full architecture, database schema,
API specifications, and scoring logic writeup.

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React (Vite), Tailwind CSS, Recharts, React Router, Axios

## Project Structure

```
backend/    FastAPI application (see backend/app/)
frontend/   React application (see frontend/src/)
DESIGN.md   Architecture, schema, API spec, and scoring writeup
```

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs (Swagger UI): http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## Core API Endpoints

| Method | Route | Purpose |
|---|---|---|
| POST | `/users` | Register a user |
| POST | `/activities` | Log a fitness activity, returns computed points |
| GET | `/leaderboard` | Global rankings with 7-day trend |
| GET | `/dashboard/{userId}` | Personal stats, history, and charts data |

Full request/response details are in [`DESIGN.md`](./DESIGN.md).
