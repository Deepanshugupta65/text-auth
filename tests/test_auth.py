from tests.conftest import client


def test_register_user(db):

    response = client.post(
        "/auth/register",
        json={
            "email": "test1@example.com",
            "password": "Test1234"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "User registered successfully"
    assert "user_id" in data


def test_duplicate_email(db):

    # First create the user
    client.post(
        "/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "Test1234"
        }
    )

    # Now try to create the same user again
    response = client.post(
        "/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "Test1234"
        }
    )

    assert response.status_code == 400

    data = response.json()

    assert data["detail"] == "Email already registered"


def test_login_user(db):

    # Create user first
    client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "Test1234"
        }
    )

    # Login
    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "Test1234"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "user"


def test_login_wrong_password(db):

    # Create user
    client.post(
        "/auth/register",
        json={
            "email": "wrongpass@example.com",
            "password": "Test1234"
        }
    )

    # Try to login with wrong password
    response = client.post(
        "/auth/login",
        json={
            "email": "wrongpass@example.com",
            "password": "WrongPassword"
        }
    )

    assert response.status_code == 400

    data = response.json()

    assert data["detail"] == "Invalid email or password"


def test_jwt_protected_task(db):

    # 1. Create a user
    client.post(
        "/auth/register",
        json={
            "email": "jwtuser@example.com",
            "password": "Test1234"
        }
    )

    # 2. Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "jwtuser@example.com",
            "password": "Test1234"
        }
    )

    assert login_response.status_code == 200

    # 3. Get the token
    token = login_response.json()["access_token"]

    # 4. Use the token to access protected task API
    response = client.post(
        "/tasks/",
        json={
            "title": "Learn JWT"
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    # 5. Check that protected API allows the user
    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Learn JWT"

# No JWT → user cannot create a task. 
def test_create_task_without_token(db):

    response = client.post(
        "/tasks/",
        json={
            "title": "Should not be created"
        }
    )

    assert response.status_code in [401, 403]
def test_create_task_with_invalid_token(db):

    response = client.post(
        "/tasks/",
        json={
            "title": "Should not be created"
        },
        headers={
            "Authorization": "Bearer this_is_not_a_real_token"
        }
    )

    assert response.status_code in [401, 403]    