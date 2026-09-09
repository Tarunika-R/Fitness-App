"""
User Registration API.

POST /users
  - Accepts first_name, last_name, (optional) email.
  - Prevents duplicate registration for the same first + last name
    (case-insensitive) -> 409 Conflict.
  - Returns the generated userId on success -> 201 Created.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, crud
from app.database import get_db

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_name(db, user.first_name, user.last_name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A user named '{user.first_name} {user.last_name}' is already registered.",
        )

    db_user = crud.create_user(db, user)
    return schemas.UserResponse(
        userId=db_user.id,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        email=db_user.email,
        created_at=db_user.created_at,
    )
