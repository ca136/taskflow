"""Project endpoint tests — CRUD and authorization."""

import pytest
from httpx import AsyncClient

from app.core.security import create_access_token, get_password_hash
from app.models.user import User


@pytest.mark.asyncio
async def test_create_project(auth_client: AsyncClient):
    resp = await auth_client.post("/api/v1/projects/", json={
        "name": "My Project",
        "description": "A test project",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "My Project"


@pytest.mark.asyncio
async def test_list_projects(auth_client: AsyncClient):
    await auth_client.post("/api/v1/projects/", json={"name": "P1"})
    await auth_client.post("/api/v1/projects/", json={"name": "P2"})
    resp = await auth_client.get("/api/v1/projects/")
    assert resp.status_code == 200
    assert len(resp.json()) == 2


@pytest.mark.asyncio
async def test_update_project(auth_client: AsyncClient):
    create_resp = await auth_client.post("/api/v1/projects/", json={"name": "Original"})
    pid = create_resp.json()["id"]
    resp = await auth_client.patch(f"/api/v1/projects/{pid}", json={"name": "Renamed"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "Renamed"


@pytest.mark.asyncio
async def test_delete_project(auth_client: AsyncClient):
    create_resp = await auth_client.post("/api/v1/projects/", json={"name": "To Delete"})
    pid = create_resp.json()["id"]
    resp = await auth_client.delete(f"/api/v1/projects/{pid}")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_cannot_access_other_users_project(auth_client: AsyncClient, db_session):
    # Create another user
    other = User(
        email="other@example.com",
        username="otheruser",
        full_name="Other",
        hashed_password=get_password_hash("OtherPass1"),
    )
    db_session.add(other)
    await db_session.commit()
    await db_session.refresh(other)

    # Create project as other user
    other_token = create_access_token(str(other.id))
    resp = await auth_client.post(
        "/api/v1/projects/",
        json={"name": "Other's Project"},
        headers={"Authorization": f"Bearer {other_token}"},
    )
    pid = resp.json()["id"]

    # Try to access as test_user — should be 403
    resp = await auth_client.get(f"/api/v1/projects/{pid}")
    assert resp.status_code == 403
