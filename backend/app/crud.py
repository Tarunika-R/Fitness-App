"""
DB access layer — keeps raw SQLAlchemy queries out of the route handlers.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models, schemas
from app.scoring import calculate_points


# ---------- Users ----------

def get_user_by_name(db: Session, first_name: str, last_name: str):
    return (
        db.query(models.User)
        .filter(
            func.lower(models.User.first_name) == first_name.lower(),
            func.lower(models.User.last_name) == last_name.lower(),
        )
        .first()
    )


def get_user_by_id(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        first_name=user.first_name.strip(),
        last_name=user.last_name.strip(),
        email=user.email,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ---------- Activities ----------

def create_activity(db: Session, activity: schemas.ActivityCreate):
    points = calculate_points(activity.sport, activity.value)

    db_activity = models.Activity(
        user_id=activity.userId,
        sport=activity.sport,
        metric_type=activity.metric_type,
        raw_value=activity.value,
        points=points,
        **({"activity_date": activity.activity_date} if activity.activity_date else {}),
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity


def get_total_points(db: Session, user_id: str) -> int:
    total = (
        db.query(func.coalesce(func.sum(models.Activity.points), 0))
        .filter(models.Activity.user_id == user_id)
        .scalar()
    )
    return int(total)


# ---------- Leaderboard ----------

def get_leaderboard(db: Session):
    """
    Builds the global leaderboard: total points per user (all-time),
    plus a week-over-week trend computed by comparing each user's
    current rank to what their rank would have been using only
    points earned up to 7 days ago.
    """
    from datetime import datetime, timedelta, timezone

    cutoff = datetime.now(timezone.utc) - timedelta(days=7)

    users = db.query(models.User).all()

    rows = []
    for user in users:
        total_points = (
            db.query(func.coalesce(func.sum(models.Activity.points), 0))
            .filter(models.Activity.user_id == user.id)
            .scalar()
        )
        points_7_days_ago = (
            db.query(func.coalesce(func.sum(models.Activity.points), 0))
            .filter(
                models.Activity.user_id == user.id,
                models.Activity.activity_date <= cutoff,
            )
            .scalar()
        )
        rows.append({
            "user": user,
            "total_points": int(total_points),
            "points_7_days_ago": int(points_7_days_ago),
        })

    # Current ranking: highest total_points first. Ties broken by earliest
    # registration so ranking is stable/deterministic.
    rows.sort(key=lambda r: (-r["total_points"], r["user"].created_at))
    for i, row in enumerate(rows):
        row["rank"] = i + 1

    # Ranking as of 7 days ago, using the same tie-break rule.
    rows_7d = sorted(rows, key=lambda r: (-r["points_7_days_ago"], r["user"].created_at))
    rank_7d_map = {row["user"].id: i + 1 for i, row in enumerate(rows_7d)}

    leaderboard = []
    for row in rows:
        rank_7_days_ago = rank_7d_map[row["user"].id]
        rank_change = rank_7_days_ago - row["rank"]  # positive = moved up
        if rank_change > 0:
            trend = "up"
        elif rank_change < 0:
            trend = "down"
        else:
            trend = "same"

        leaderboard.append(schemas.LeaderboardEntry(
            rank=row["rank"],
            userId=row["user"].id,
            first_name=row["user"].first_name,
            last_name=row["user"].last_name,
            total_points=row["total_points"],
            points_7_days_ago=row["points_7_days_ago"],
            rank_7_days_ago=rank_7_days_ago,
            trend=trend,
            rank_change=rank_change,
        ))

    return leaderboard


# ---------- Dashboard ----------

def get_dashboard(db: Session, user_id: str):
    user = get_user_by_id(db, user_id)
    if not user:
        return None

    activities = (
        db.query(models.Activity)
        .filter(models.Activity.user_id == user_id)
        .order_by(models.Activity.activity_date.desc())
        .all()
    )

    total_points = sum(a.points for a in activities)

    # Points grouped by calendar day (for the "volume over time" chart).
    daily_totals = {}
    for a in activities:
        day_key = a.activity_date.strftime("%Y-%m-%d")
        daily_totals[day_key] = daily_totals.get(day_key, 0) + a.points
    points_over_time = [
        schemas.DailyPointsEntry(date=day, points=pts)
        for day, pts in sorted(daily_totals.items())
    ]

    # Points + activity count grouped by sport (for the sport-preference breakdown).
    sport_totals = {}
    sport_counts = {}
    for a in activities:
        sport_totals[a.sport] = sport_totals.get(a.sport, 0) + a.points
        sport_counts[a.sport] = sport_counts.get(a.sport, 0) + 1
    sport_breakdown = [
        schemas.SportBreakdownEntry(
            sport=sport, total_points=pts, activity_count=sport_counts[sport]
        )
        for sport, pts in sport_totals.items()
    ]

    # Current rank: reuse the leaderboard computation for consistency.
    leaderboard = get_leaderboard(db)
    current_rank = next((e.rank for e in leaderboard if e.userId == user_id), 0)

    activity_history = [
        schemas.ActivityResponse(
            id=a.id,
            userId=a.user_id,
            sport=a.sport,
            metric_type=a.metric_type,
            raw_value=a.raw_value,
            points=a.points,
            activity_date=a.activity_date,
        )
        for a in activities
    ]

    return schemas.DashboardResponse(
        userId=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        total_points=total_points,
        current_rank=current_rank,
        activity_history=activity_history,
        points_over_time=points_over_time,
        sport_breakdown=sport_breakdown,
    )
