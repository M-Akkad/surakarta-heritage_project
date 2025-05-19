from fastapi import APIRouter, Depends, HTTPException
from typing import List
from grpc import Status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserLogin, UserOut
from app.auth import admin_required
from app.schemas import UserCreate
from app.auth import hash_password
from fastapi import status
from pydantic import BaseModel



router = APIRouter()


@router.get("/", response_model=List[UserOut])
def list_users(
        db: Session = Depends(get_db),
        admin=Depends(admin_required)
):
    return [UserOut.from_orm(u) for u in db.query(User).all()]


@router.patch("/{username}/role", response_model=UserOut)
def change_role(
        username: str,
        role: str,
        db: Session = Depends(get_db),
        admin=Depends(admin_required)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.role = role
    db.commit()
    return UserOut.from_orm(user)


@router.delete("/id/{user_id}", response_model=dict)
def delete_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": f"User {user_id} deleted successfully"}



@router.post("/", response_model=UserOut)
def create_user(
    user: UserLogin,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    exists = db.query(User).filter(User.username == user.username).first()
    if exists:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Username already exists")

    hashed = hash_password(user.password)

    new_user = User(
        username=user.username,
        hashed_password=hashed,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


class PasswordUpdate(BaseModel):
    new_password: str

@router.post("/{username}/reset-password")
def reset_password(
    username: str,
    body: PasswordUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(404, "User not found")

    hashed = hash_password(body.new_password)
    user.hashed_password = hashed
    db.commit()
    return {"detail": "Password updated"}