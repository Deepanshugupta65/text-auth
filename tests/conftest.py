import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))


import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


#  import base task user table for test
from app.db.base import Base
from app.model.task import Task
from app.model.user import User
#  step 4:
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import get_db

TEST_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/textauth_test"

test_engine = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine
)
#  by this all my python models and create their tables inside textauth_test
Base.metadata.create_all(bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db

    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture
def db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()