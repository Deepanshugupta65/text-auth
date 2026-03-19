from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

# login api 

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=2)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


#  get_current_user()

# depend used for dependcy injec , httpex- used for error like 401,403
from fastapi import Depends, HTTPException
# httpbeared -> read tokens from request header, httpauthcre- -> holds token info
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# jwt used to decode token , jwterror -> handle invlaid token
from jose import jwt, JWTError
#  used for db operations
from sqlalchemy.orm import Session

# created db session , user ur table model
from app.db.session import SessionLocal
from app.model.user import User

# this read authorization bearer token
security = HTTPBearer()

def get_db():
    # create db connection
    db = SessionLocal()
    try:
        # send db session to fun using it
        yield db
    finally:
        # closes db after req ends
        db.close()

def get_current_user(
        # read toekn from header and stores in credentials , db session injected
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    # extract actual token string
    token = credentials.credentials

    try:
        # verify token and extract data inside token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # extract user_id from token
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        # if token is expired , modefied ,wrong then reject requests
        raise HTTPException(status_code=401, detail="Invalid token")
    #  find user in database
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user           