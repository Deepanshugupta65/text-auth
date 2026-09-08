from tests.conftest import client


def test_register_user():

    response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "Test1234"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "User registered successfully"
    assert "user_id" in data