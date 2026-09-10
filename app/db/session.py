from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/textauth"
)

# DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/textauth"

# DATABASE_URL = "postgresql://postgres:postgres@postgres:5432/textauth"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
