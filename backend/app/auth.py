# app/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
import uuid
import os

from passlib.context import CryptContext

from app.database import get_db
from app.crud import authenticate_user
from app.models import User
from app.schemas import UserLogin, UserOut

router = APIRouter(tags=["auth"])

# password hashing context
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)


# tell FastAPI where to POST credentials to get a token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# in-memory token store { token_str: UserOut }
tokens: dict[str, UserOut] = {}


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Verify username & password, then return a bearer token.
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    token = str(uuid.uuid4())
    # store a serialized copy of the user
    # tokens[token] = UserOut.from_orm(user)
    tokens[token] = user.id
    return {"access_token": token, "token_type": "bearer"}


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> UserOut:
    """
    Read the Authorization: Bearer <token> header,
    look up the user in our in-memory store.
    """
    # user = tokens.get(token)
    user_id = tokens.get(token)
    if not user_id:
        raise HTTPException(401, "Invalid token")
    user = db.get(User, user_id)
    return UserOut.from_orm(user)






@router.post("/register")
def register(user_in: UserLogin, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.username == user_in.username).first()
    if exists:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Username already exists")

    expected_code = os.getenv("ADMIN_SECRET_CODE", "")

    if user_in.admin_code and user_in.admin_code != expected_code:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Invalid admin code")

    hashed = pwd_ctx.hash(user_in.password)
    role = "admin" if user_in.admin_code == expected_code else "user"

    user = User(username=user_in.username, hashed_password=hashed, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)

    message = "Registered as admin" if role == "admin" else "Registered as user."

    return JSONResponse(status_code=201, content={
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "message": message
    })





@router.get("/me", response_model=UserOut)
def read_current_user(
    current: UserOut = Depends(get_current_user)
):
    """
    Return the currently authenticated user (username & role).
    Frontend should call this after login to know who’s logged in.
    """
    return current

from fastapi.responses import JSONResponse




def admin_required(
    current_user: UserOut = Depends(get_current_user)
) -> UserOut:
    """
    FastAPI dependency: use this on routes that only admins may call.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user
