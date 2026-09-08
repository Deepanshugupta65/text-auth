from tests.conftest import TestingSessionLocal


def test_database_connection():
    db = TestingSessionLocal()

    try:
        connection = db.connection()
        assert connection is not None
    finally:
        db.close()