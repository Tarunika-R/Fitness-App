"""
Activity Ingestion API.

POST /activities
  - Validates that metric_type matches the sport (e.g. Running + STEPS
    is invalid) -> 400 Bad Request.
  - Validates the referenced user exists -> 404 Not Found.
  - Computes points via the scoring engine and persists the activity.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, crud
from app.database import get_db
from app.models import SPORT_METRIC_MAP

router = APIRouter(prefix="/activities", tags=["Activities"])


@router.post("", response_model=schemas.ActivityResponse, status_code=status.HTTP_201_CREATED)
def log_activity(activity: schemas.ActivityCreate, db: Session = Depends(get_db)):
    # 1. Confirm the user exists.
    user = crud.get_user_by_id(db, activity.userId)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No user found with userId '{activity.userId}'.",
        )

    # 2. Validate sport/metric type match (e.g. Running must use DISTANCE_KM,
    #    not STEPS or DURATION_SEC). This is the "mismatched sport/metric" case.
    expected_metric = SPORT_METRIC_MAP.get(activity.sport)
    if expected_metric is None or expected_metric != activity.metric_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Invalid metric_type '{activity.metric_type.value}' for sport "
                f"'{activity.sport.value}'. Expected '{expected_metric.value if expected_metric else 'N/A'}'."
            ),
        )

    # 3. Persist + score.
    db_activity = crud.create_activity(db, activity)

    return schemas.ActivityResponse(
        id=db_activity.id,
        userId=db_activity.user_id,
        sport=db_activity.sport,
        metric_type=db_activity.metric_type,
        raw_value=db_activity.raw_value,
        points=db_activity.points,
        activity_date=db_activity.activity_date,
    )
