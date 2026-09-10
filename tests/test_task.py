from tests.conftest import client
from app.model.user import User

def test_create_task(db):

    # Create a user
    client.post(
        "/auth/register",
        json={
            "email": "taskuser@example.com",
            "password": "Test1234"
        }
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "taskuser@example.com",
            "password": "Test1234"
        }
    )

    assert login_response.status_code == 200

    # Get JWT token
    token = login_response.json()["access_token"]

    # Create task
    response = client.post(
        "/tasks/",
        json={
            "title": "Learn backend testing"
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Learn backend testing"
    assert data["owner_id"] == 1


#  get task 
def test_get_tasks(db):

    # 1. Create a user
    client.post(
        "/auth/register",
        json={
            "email": "gettask@example.com",
            "password": "Test1234"
        }
    )

    # 2. Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "gettask@example.com",
            "password": "Test1234"
        }
    )

    assert login_response.status_code == 200

    # 3. Get JWT token
    token = login_response.json()["access_token"]

    # 4. Create a task first
    create_response = client.post(
        "/tasks/",
        json={
            "title": "My first task"
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert create_response.status_code == 201

    # 5. Get tasks
    response = client.get(
        "/tasks/",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    # 6. Check response
    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["page"] == 1
    assert data["limit"] == 10
    assert len(data["data"]) == 1
    assert data["data"][0]["title"] == "My first task"



#  authorization between two user 

def test_user_cannot_delete_another_users_task(db):

    # 1. Create User A
    client.post(
        "/auth/register",
        json={
            "email": "usera@example.com",
            "password": "Test1234"
        }
    )

    # 2. Login User A
    login_a = client.post(
        "/auth/login",
        json={
            "email": "usera@example.com",
            "password": "Test1234"
        }
    )

    token_a = login_a.json()["access_token"]

    # 3. User A creates a task
    create_response = client.post(
        "/tasks/",
        json={
            "title": "User A task"
        },
        headers={
            "Authorization": f"Bearer {token_a}"
        }
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["id"]

    # 4. Create User B
    client.post(
        "/auth/register",
        json={
            "email": "userb@example.com",
            "password": "Test1234"
        }
    )

    # 5. Login User B
    login_b = client.post(
        "/auth/login",
        json={
            "email": "userb@example.com",
            "password": "Test1234"
        }
    )

    token_b = login_b.json()["access_token"]

    # 6. User B tries to delete User A's task
    response = client.delete(
        f"/tasks/{task_id}",
        headers={
            "Authorization": f"Bearer {token_b}"
        }
    )

    # User B should NOT be allowed
    assert response.status_code == 403

    data = response.json()

    assert data["detail"] == "Not authorized"
    


#   Admin can delete another user's task


def test_admin_can_delete_other_users_task(db):

    # 1. Create normal user
    client.post(
        "/auth/register",
        json={
            "email": "normaluser@example.com",
            "password": "Test1234"
        }
    )

    # 2. Login normal user
    user_login = client.post(
        "/auth/login",
        json={
            "email": "normaluser@example.com",
            "password": "Test1234"
        }
    )

    user_token = user_login.json()["access_token"]

    # 3. Normal user creates a task
    create_response = client.post(
        "/tasks/",
        json={
            "title": "User task"
        },
        headers={
            "Authorization": f"Bearer {user_token}"
        }
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["id"]

    # 4. Create admin user
    client.post(
        "/auth/register",
        json={
            "email": "admin@example.com",
            "password": "Admin1234"
        }
    )

    # 5. Change admin user's role to admin
    admin_user = db.query(User).filter(
        User.email == "admin@example.com"
    ).first()

    admin_user.role = "admin"
    db.commit()

    # 6. Login admin
    admin_login = client.post(
        "/auth/login",
        json={
            "email": "admin@example.com",
            "password": "Admin1234"
        }
    )

    admin_token = admin_login.json()["access_token"]

    # 7. Admin deletes normal user's task
    response = client.delete(
        f"/tasks/{task_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    # Admin should be allowed
    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Task deleted successfully"

#   filter ation

def test_filter_completed_tasks(db):

    # 1. Create user
    client.post(
        "/auth/register",
        json={
            "email": "filter@example.com",
            "password": "Test1234"
        }
    )

    # 2. Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "filter@example.com",
            "password": "Test1234"
        }
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # 3. Create first task
    response1 = client.post(
        "/tasks/",
        json={
            "title": "Completed task"
        },
        headers=headers
    )

    assert response1.status_code == 201

    task1_id = response1.json()["id"]

    # 4. Mark first task as completed
    update_response = client.put(
        f"/tasks/{task1_id}",
        json={
            "completed": True
        },
        headers=headers
    )

    assert update_response.status_code == 200

    # 5. Create second task
    response2 = client.post(
        "/tasks/",
        json={
            "title": "Incomplete task"
        },
        headers=headers
    )

    assert response2.status_code == 201

    # 6. Ask API for only completed tasks
    response = client.get(
        "/tasks/?completed=true",
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["data"]) == 1
    assert data["data"][0]["title"] == "Completed task"
    assert data["data"][0]["completed"] is True
    

# from tests.conftest import client
# from app.model.user import User


# ---------------------------------------------------------
# 1. SEARCH TEST
# ---------------------------------------------------------

def test_search_tasks(db):

    # Create user
    client.post(
        "/auth/register",
        json={
            "email": "search@example.com",
            "password": "Test1234"
        }
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "search@example.com",
            "password": "Test1234"
        }
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create task 1
    client.post(
        "/tasks/",
        json={
            "title": "Learn FastAPI"
        },
        headers=headers
    )

    # Create task 2
    client.post(
        "/tasks/",
        json={
            "title": "Learn Docker"
        },
        headers=headers
    )

    # Search FastAPI
    response = client.get(
        "/tasks/?search=FastAPI",
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["data"]) == 1
    assert data["data"][0]["title"] == "Learn FastAPI"


# ---------------------------------------------------------
# 2. PAGINATION TEST
# ---------------------------------------------------------

def test_task_pagination(db):

    # Create user
    client.post(
        "/auth/register",
        json={
            "email": "pagination@example.com",
            "password": "Test1234"
        }
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "pagination@example.com",
            "password": "Test1234"
        }
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create 3 tasks
    for i in range(1, 4):
        client.post(
            "/tasks/",
            json={
                "title": f"Task {i}"
            },
            headers=headers
        )

    # Ask for 2 tasks
    response = client.get(
        "/tasks/?page=1&limit=2",
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 3
    assert data["page"] == 1
    assert data["limit"] == 2
    assert len(data["data"]) == 2


# ---------------------------------------------------------
# 3. SECOND PAGE PAGINATION TEST
# ---------------------------------------------------------

def test_second_page(db):

    # Create user
    client.post(
        "/auth/register",
        json={
            "email": "page2@example.com",
            "password": "Test1234"
        }
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "page2@example.com",
            "password": "Test1234"
        }
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create 3 tasks
    for i in range(1, 4):
        client.post(
            "/tasks/",
            json={
                "title": f"Task {i}"
            },
            headers=headers
        )

    # Get page 2 with limit 2
    response = client.get(
        "/tasks/?page=2&limit=2",
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 3
    assert data["page"] == 2
    assert data["limit"] == 2
    assert len(data["data"]) == 1


# ---------------------------------------------------------
# 4. UPDATE TASK
# ---------------------------------------------------------

def test_update_task(db):

    # Create user
    client.post(
        "/auth/register",
        json={
            "email": "update@example.com",
            "password": "Test1234"
        }
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "update@example.com",
            "password": "Test1234"
        }
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create task
    create_response = client.post(
        "/tasks/",
        json={
            "title": "Old title"
        },
        headers=headers
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["id"]

    # Update task
    response = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "New title",
            "completed": True
        },
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "New title"
    assert data["completed"] is True


# ---------------------------------------------------------
# 5. DELETE TASK
# ---------------------------------------------------------

def test_delete_task(db):

    # Create user
    client.post(
        "/auth/register",
        json={
            "email": "delete@example.com",
            "password": "Test1234"
        }
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "delete@example.com",
            "password": "Test1234"
        }
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create task
    create_response = client.post(
        "/tasks/",
        json={
            "title": "Delete me"
        },
        headers=headers
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["id"]

    # Delete task
    response = client.delete(
        f"/tasks/{task_id}",
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Task deleted successfully"


# ---------------------------------------------------------
# 6. DELETE NON-EXISTING TASK
# ---------------------------------------------------------

def test_delete_non_existing_task(db):

    # Create user
    client.post(
        "/auth/register",
        json={
            "email": "notfound@example.com",
            "password": "Test1234"
        }
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "notfound@example.com",
            "password": "Test1234"
        }
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Try deleting task that does not exist
    response = client.delete(
        "/tasks/99999",
        headers=headers
    )

    assert response.status_code == 404

    data = response.json()

    assert data["detail"] == "Task not found"


# ---------------------------------------------------------
# 7. USER CAN GET ONLY THEIR OWN TASKS
# ---------------------------------------------------------

def test_user_only_gets_own_tasks(db):

    # -------------------------
    # Create User A
    # -------------------------

    client.post(
        "/auth/register",
        json={
            "email": "usera_get@example.com",
            "password": "Test1234"
        }
    )

    login_a = client.post(
        "/auth/login",
        json={
            "email": "usera_get@example.com",
            "password": "Test1234"
        }
    )

    token_a = login_a.json()["access_token"]

    headers_a = {
        "Authorization": f"Bearer {token_a}"
    }

    # User A creates task
    client.post(
        "/tasks/",
        json={
            "title": "User A Task"
        },
        headers=headers_a
    )

    # -------------------------
    # Create User B
    # -------------------------

    client.post(
        "/auth/register",
        json={
            "email": "userb_get@example.com",
            "password": "Test1234"
        }
    )

    login_b = client.post(
        "/auth/login",
        json={
            "email": "userb_get@example.com",
            "password": "Test1234"
        }
    )

    token_b = login_b.json()["access_token"]

    headers_b = {
        "Authorization": f"Bearer {token_b}"
    }

    # User B creates task
    client.post(
        "/tasks/",
        json={
            "title": "User B Task"
        },
        headers=headers_b
    )

    # User B gets tasks
    response = client.get(
        "/tasks/",
        headers=headers_b
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["data"][0]["title"] == "User B Task"
