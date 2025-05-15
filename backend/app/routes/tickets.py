from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, List
from app.schemas import TicketCreate, TicketOut
from app.crud import create_ticket, search_tickets
from app.database import get_db
from app.auth import get_current_user

router = APIRouter()


@router.post("/tickets", response_model=TicketOut)
def issue_ticket(ticket: TicketCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create_ticket(db, ticket)


@router.get("/tickets/search", response_model=List[TicketOut])
def filter_tickets(
        visitor_type: Optional[str] = None,
        age_group: Optional[str] = None,
        location_name: Optional[str] = None,
        start_date: Optional[datetime] = Query(None, alias="from"),
        end_date: Optional[datetime] = Query(None, alias="to"),
        db: Session = Depends(get_db),
        user=Depends(get_current_user)
):
    return search_tickets(db, visitor_type, age_group, location_name, start_date, end_date)
