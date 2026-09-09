"""
Leaderboard & Dashboard read APIs.

GET /leaderboard
  - Global ranking of all users by total accumulated points.
  - Includes a week-over-week trend (rank now vs rank 7 days ago).

GET /dashboard/{userId}
  - Personal stats: total points, current rank, full activity history,
    points-over-time (for a trend chart), and sport-preference breakdown
    (for a pie/donut chart).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, crud
from app.database import get_db

router = APIRouter(tags=["Leaderboard & Dashboard"])


@router.get("/leaderboard", response_model=list[schemas.LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    return crud.get_leaderboard(db)


@router.get("/dashboard/{userId}", response_model=schemas.DashboardResponse)
def get_dashboard(userId: str, db: Session = Depends(get_db)):
    dashboard = crud.get_dashboard(db, userId)
    if not dashboard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No user found with userId '{userId}'.",
        )
    return dashboard
