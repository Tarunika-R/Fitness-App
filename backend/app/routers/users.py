"""
User Registration API.

POST /users
  - Accepts first_name, last_name, (optional) email.
  - Prevents duplicate registration for the same first + last name
    (case-insensitive) -> 409 Conflict.
  - Returns the generated userId on success -> 201 Created.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
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


@router.get("/lookup", response_model=schemas.UserResponse)
def lookup_user(
    first_name: str = Query(..., min_length=1),
    last_name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
):
    """
    Lets an already-registered user 'sign back in' by name, since this
    app has no password auth — identity is the first+last name pair,
    same as the uniqueness rule used at registration.
    """
    user = crud.get_user_by_name(db, first_name, last_name)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No user found named '{first_name} {last_name}'. Please register first.",
        )
    return schemas.UserResponse(
        userId=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        created_at=user.created_at,
    )
