from sqlalchemy.orm import Session
from .models import Ticket, User
from .schemas import TicketCreate
from sqlalchemy import func, and_
from datetime import datetime
from typing import Optional


def create_ticket(db: Session, ticket_data: TicketCreate):
    ticket = Ticket(**ticket_data.dict())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def get_ticket_stats(db: Session):
    return {
        "total": db.query(Ticket).count(),
        "by_age_group": dict(db.query(Ticket.age_group, func.count()).group_by(Ticket.age_group)),
        "by_gender": dict(db.query(Ticket.gender, func.count()).group_by(Ticket.gender)),
        "by_location": dict(db.query(Ticket.location_name, func.count()).group_by(Ticket.location_name))
    }


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if user and user.hashed_password == password:
        return user
    return None


def search_tickets(db: Session, visitor_type: Optional[str], age_group: Optional[str], location_name: Optional[str],
                   start_date: Optional[datetime], end_date: Optional[datetime]):
    query = db.query(Ticket)
    if visitor_type:
        query = query.filter(Ticket.visitor_type == visitor_type)
    if age_group:
        query = query.filter(Ticket.age_group == age_group)
    if location_name:
        query = query.filter(Ticket.location_name == location_name)
    if start_date and end_date:
        query = query.filter(Ticket.issued_at.between(start_date, end_date))
    return query.all()
