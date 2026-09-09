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

    #  check duplicate email
    def test_duplicate_email(db):
        # first create the user
        client.post(
            "/auth/register",
            json={
                "email":"duplicate@example.com",
                "password":"Test1234"
            }
        )
        # now try to create the same user agian
        response = client.post(
            "/auth/register",
            json={
                "email":"duplicate@example.com",
                "password":"Test1234"
            }
        )
        assert response.status_code ==400
        data = response.json()
        assert data["detail"] =="Email already registered"


        # login test with correct password
        def test_login_user(db):
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
            assert data["user"]["email"] =="test@example.com"
            assert data["user"]["role"] =="user"