from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import get_ticket_stats
from app.auth import admin_required
from app.schemas import UserOut

router = APIRouter()


@router.get("/", response_model=dict)
def read_stats(
        db: Session = Depends(get_db),
        current_admin: UserOut = Depends(admin_required)
):
    """
    Returns overall ticket stats.
    Access restricted to users with role == "admin".
    """
    return get_ticket_stats(db)
