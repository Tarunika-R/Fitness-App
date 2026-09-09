"""
ORM models.

User        -> a registered participant, unique on (first_name, last_name).
Activity    -> a single logged fitness entry, always stores the raw value
               the user submitted AND the computed points (so history is
               auditable and re-scoring logic changes don't silently
               corrupt old records).
"""
import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Float, Integer, DateTime, ForeignKey, UniqueConstraint, Enum
)
from sqlalchemy.orm import relationship

from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class SportType(str, enum.Enum):
    RUNNING = "running"
    WALKING = "walking"
    CYCLING = "cycling"
    GYM = "gym"
    SWIMMING = "swimming"
    DAILY_STEPS = "daily_steps"


class MetricType(str, enum.Enum):
    DISTANCE_KM = "distance_km"
    DURATION_SEC = "duration_sec"
    STEPS = "steps"


# Which metric type is valid for which sport — used for validation in the
# ingestion API (mismatched sport/metric must return 400).
SPORT_METRIC_MAP = {
    SportType.RUNNING: MetricType.DISTANCE_KM,
    SportType.WALKING: MetricType.DISTANCE_KM,
    SportType.CYCLING: MetricType.DISTANCE_KM,
    SportType.GYM: MetricType.DURATION_SEC,
    SportType.SWIMMING: MetricType.DURATION_SEC,
    SportType.DAILY_STEPS: MetricType.STEPS,
}


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("first_name", "last_name", name="uq_user_first_last_name"),
    )


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)

    sport = Column(Enum(SportType), nullable=False)
    metric_type = Column(Enum(MetricType), nullable=False)

    # Raw value as submitted by the client, in the unit implied by metric_type:
    #   DISTANCE_KM -> kilometers (float)
    #   DURATION_SEC -> seconds (int, stored as float column for simplicity)
    #   STEPS -> step count (int)
    raw_value = Column(Float, nullable=False)

    points = Column(Integer, nullable=False)

    # When the activity was performed (defaults to submission time if not given).
    activity_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="activities")
