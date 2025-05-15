from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TicketCreate(BaseModel):
    visitor_type: str
    age_group: str
    gender: str
    location_name: str
    location_coords: str


class TicketOut(TicketCreate):
    id: int
    issued_at: datetime

    class Config:
        orm_mode = True


class UserOut(BaseModel):
    username: str
    role: str


class UserLogin(BaseModel):
    username: str
    password: str
