import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from .env file
load_dotenv()

# Retrieve the DATABASE_URL, fallback to sqlite if not defined or empty
raw_url = os.getenv("DATABASE_URL")


# Create the SQLAlchemy engine; sqlite needs check_same_thread
engine = create_engine(
    raw_url,
    connect_args={"check_same_thread": False} if raw_url.startswith("sqlite") else {}
)

# Session factory and declarative base for models
db_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a database session and closes it after use.
    """
    db = db_session()
    try:
        yield db
    finally:
        db.close()
