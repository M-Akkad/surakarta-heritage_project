from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.crud import create_ticket, update_ticket, delete_ticket
from app.schemas import TicketCreate, TicketOut, UserOut
from app.database import get_db
from app.auth import get_current_user
from app.models import Ticket

router = APIRouter()


@router.get("/", response_model=List[TicketOut])
def list_tickets(
        db: Session = Depends(get_db),
        current_user: UserOut = Depends(get_current_user)
):
    if current_user.role == "admin":
        # admin: all tickets
        return db.query(Ticket).all()
    # normal user: only own tickets
    return db.query(Ticket).filter(Ticket.owner_id == current_user.id).all()


@router.post("/", response_model=TicketOut)
def issue_ticket(
        ticket: TicketCreate,
        db: Session = Depends(get_db),
        current_user: UserOut = Depends(get_current_user)
):
    # attach owner_id
    return create_ticket(db, ticket, owner_id=current_user.id)


@router.put("/{ticket_id}", response_model=TicketOut)
def edit_ticket(
        ticket_id: int,
        ticket: TicketCreate,
        db: Session = Depends(get_db),
        current_user: UserOut = Depends(get_current_user)
):
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # allow admin OR owner
    if current_user.role != "admin" and current_user.id != db_ticket.owner_id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to edit this ticket."
        )

    return update_ticket(db, ticket_id, ticket)


@router.delete("/{ticket_id}", status_code=204)
def delete_ticket_route(
        ticket_id: int,
        db: Session = Depends(get_db),
        current_user: UserOut = Depends(get_current_user)
):
    db_ticket = db.query(Ticket).get(ticket_id)
    if not db_ticket:
        raise HTTPException(404, "Ticket not found")

    # Only allow delete if admin OR owner of the ticket
    if current_user.role != "admin" and db_ticket.owner_id != current_user.id:
        raise HTTPException(403, "Not permitted")

    db.delete(db_ticket)
    db.commit()


@router.get("/{ticket_id}", response_model=TicketOut)
def get_ticket(
        ticket_id: int,
        db: Session = Depends(get_db),
        current_user: UserOut = Depends(get_current_user),
):
    db_ticket = db.query(Ticket).get(ticket_id)
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if current_user.role != "admin" and db_ticket.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not permitted")
    return db_ticket
