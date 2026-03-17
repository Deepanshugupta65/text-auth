from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.model.user import User
from app.schema.user import UserCreate
from app.core.security import hash_password

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    print("Request received:", user.email)

    existing_user = db.query(User).filter(User.email == user.email).first()
    print("Checked existing user")

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    print("Password hashed")

    new_user = User(
        email=user.email,
        password=hashed_password,
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    print("User saved")

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }

