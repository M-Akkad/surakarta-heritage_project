from sqlalchemy import Column, Integer, String, DateTime
from .database import Base
import datetime


class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    visitor_type = Column(String)
    age_group = Column(String)
    gender = Column(String)
    location_name = Column(String)
    location_coords = Column(String)
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    role = Column(String)
    hashed_password = Column(String)
