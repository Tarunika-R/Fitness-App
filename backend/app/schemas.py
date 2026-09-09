"""
Pydantic schemas — these define the request/response contracts and give us
automatic validation (FastAPI returns 422 for malformed JSON out of the box;
we raise explicit 400s ourselves for business-rule mismatches like
sport/metric type errors, per the spec).
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr

from app.models import SportType, MetricType


# ---------- Users ----------

class UserCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    userId: str
    first_name: str
    last_name: str
    email: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Activities ----------

class ActivityCreate(BaseModel):
    userId: str
    sport: SportType
    metric_type: MetricType
    # Meaning depends on metric_type:
    #   DISTANCE_KM  -> kilometers, e.g. 5.2
    #   DURATION_SEC -> seconds, e.g. 125 (== 2:05)
    #   STEPS        -> step count, e.g. 8342
    value: float = Field(..., gt=0)
    activity_date: Optional[datetime] = None


class ActivityResponse(BaseModel):
    id: str
    userId: str
    sport: SportType
    metric_type: MetricType
    raw_value: float
    points: int
    activity_date: datetime

    class Config:
        from_attributes = True


# ---------- Leaderboard ----------

class LeaderboardEntry(BaseModel):
    rank: int
    userId: str
    first_name: str
    last_name: str
    total_points: int
    points_7_days_ago: int
    rank_7_days_ago: int
    trend: str  # "up", "down", or "same"
    rank_change: int  # positive = moved up N spots, negative = moved down N spots


# ---------- Dashboard ----------

class SportBreakdownEntry(BaseModel):
    sport: SportType
    total_points: int
    activity_count: int


class DailyPointsEntry(BaseModel):
    date: str  # ISO date (YYYY-MM-DD)
    points: int


class DashboardResponse(BaseModel):
    userId: str
    first_name: str
    last_name: str
    total_points: int
    current_rank: int
    activity_history: list[ActivityResponse]
    points_over_time: list[DailyPointsEntry]
    sport_breakdown: list[SportBreakdownEntry]
