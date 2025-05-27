from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Ticket, User
from app.schemas import TicketCreate, TicketOut
from typing import List, Dict
from passlib.context import CryptContext
from fastapi import HTTPException, status

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_ticket(db, ticket_in: TicketCreate, owner_id: int) -> TicketOut:
    data = ticket_in.dict()
    data["owner_id"] = owner_id
    db_ticket = Ticket(**data)
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return TicketOut.from_orm(db_ticket)


def search_tickets(db: Session, query: str) -> List[TicketOut]:
    tickets = db.query(Ticket).filter(Ticket.location_name.contains(query)).all()
    return [TicketOut.from_orm(t) for t in tickets]


def update_ticket(db: Session, ticket_id: int, ticket_in: TicketCreate) -> TicketOut:
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    for field, value in ticket_in.dict().items():
        setattr(db_ticket, field, value)
    db.commit()
    db.refresh(db_ticket)
    return TicketOut.from_orm(db_ticket)


def delete_ticket(db: Session, ticket_id: int) -> None:
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    db.delete(db_ticket)
    db.commit()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_ctx.verify(plain_password, hashed_password)


def authenticate_user(db: Session, username: str, password: str) -> User:
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    return user


def get_ticket_stats(db: Session) -> Dict:
    total = db.query(func.count(Ticket.id)).scalar() or 0

    stats = {
        "total_tickets": total,
        "local_count": 0,
        "tourist_count": 0,
        "age_distribution": {},
        "location_distribution": {},
        "issued_at_distribution": {}
    }

    by_type = (
        db.query(Ticket.visitor_type, func.count(Ticket.id))
        .group_by(Ticket.visitor_type)
        .all()
    )
    for visitor_type, count in by_type:
        key = f"{visitor_type}_count"
        stats[key] = count

    age_counts = (
        db.query(Ticket.age_group, func.count(Ticket.id))
        .group_by(Ticket.age_group)
        .all()
    )
    stats["age_distribution"] = {k: v for k, v in age_counts}

    loc_counts = (
        db.query(Ticket.location_name, func.count(Ticket.id))
        .group_by(Ticket.location_name)
        .all()
    )
    stats["location_distribution"] = {k: v for k, v in loc_counts}

    date_counts = (
        db.query(func.strftime("%Y-%m-%d", Ticket.issued_at), func.count(Ticket.id))
        .group_by(func.strftime("%Y-%m-%d", Ticket.issued_at))
        .all()
    )
    stats["issued_at_distribution"] = {k: v for k, v in date_counts}

    return stats
