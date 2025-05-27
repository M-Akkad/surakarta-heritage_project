import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load variables .env file
load_dotenv()

raw_url = os.getenv("DATABASE_URL")

engine = create_engine(
    raw_url,
    connect_args={"check_same_thread": False} if raw_url.startswith("sqlite") else {}
)

db_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = db_session()
    try:
        yield db
    finally:
        db.close()
