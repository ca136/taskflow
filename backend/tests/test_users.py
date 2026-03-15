"""User endpoint tests — profile management and authorization."""

import pytest
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.asyncio
async def test_get_me(auth_client: AsyncClient, test_user: User):
    resp = await auth_client.get("/api/v1/users/me")
    assert resp.status_code == 200
    assert resp.json()["username"] == "testuser"


@pytest.mark.asyncio
async def test_get_me_unauthenticated(client: AsyncClient):
    resp = await client.get("/api/v1/users/me")
    assert resp.status_code == 403  # No bearer token


@pytest.mark.asyncio
async def test_update_me(auth_client: AsyncClient):
    resp = await auth_client.patch("/api/v1/users/me", json={"full_name": "Updated Name"})
    assert resp.status_code == 200
    assert resp.json()["full_name"] == "Updated Name"


@pytest.mark.asyncio
async def test_delete_me(auth_client: AsyncClient):
    resp = await auth_client.delete("/api/v1/users/me")
    assert resp.status_code == 204
