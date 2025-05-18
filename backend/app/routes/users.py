from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserOut
from app.auth import admin_required


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
