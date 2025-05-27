from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TicketCreate(BaseModel):
    visitor_type: str
    age_group: str
    gender: str
    location_name: str
    # make coords optional with a default
    location_coords: Optional[str] = None


class TicketOut(TicketCreate):
    id: int
    issued_at: datetime

    class Config:
        # Pydantic V2: enable attribute-based population (replaces orm_mode)
        from_attributes = True


class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str
    admin_code: Optional[str] = None
    role: Optional[str] = "user"


class UserCreate(BaseModel):
    username: str
    password: str
    role: str
