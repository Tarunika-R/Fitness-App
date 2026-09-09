"""
Fitness Challenge API — entrypoint.

Run locally with:
    cd backend
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000

Interactive API docs (Swagger UI) will be at http://localhost:8000/docs
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import users, activities, leaderboard

# Create tables on startup if they don't exist yet.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fitness Challenge API",
    description="Gamified fitness tracking with unified scoring and leaderboard.",
    version="1.0.0",
)

# Allow the React dev server (and any origin, for simplicity in this project)
# to call the API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(activities.router)
app.include_router(leaderboard.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "fitness-challenge-api"}
