from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.crud import get_ticket_stats
from app.database import get_db
from app.auth import admin_required

router = APIRouter()


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), user=Depends(admin_required)):
    return get_ticket_stats(db)
