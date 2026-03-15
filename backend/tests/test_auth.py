"""Auth endpoint tests — register, login, refresh, token validation."""

import pytest
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.asyncio
async def test_register(client: AsyncClient):
    resp = await client.post("/api/v1/auth/register", json={
        "email": "new@example.com",
        "username": "newuser",
        "full_name": "New User",
        "password": "StrongPass1",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "new@example.com"
    assert data["username"] == "newuser"
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_register_weak_password(client: AsyncClient):
    resp = await client.post("/api/v1/auth/register", json={
        "email": "weak@example.com",
        "username": "weakuser",
        "full_name": "Weak User",
        "password": "short",
    })
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_register_duplicate(client: AsyncClient, test_user: User):
    resp = await client.post("/api/v1/auth/register", json={
        "email": test_user.email,
        "username": "otheruser",
        "full_name": "Other",
        "password": "StrongPass1",
    })
    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_login(client: AsyncClient, test_user: User):
    resp = await client.post("/api/v1/auth/login", json={
        "username": "testuser",
        "password": "TestPass1",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, test_user: User):
    resp = await client.post("/api/v1/auth/login", json={
        "username": "testuser",
        "password": "WrongPass1",
    })
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_refresh(client: AsyncClient, test_user: User):
    # Login first
    login_resp = await client.post("/api/v1/auth/login", json={
        "username": "testuser",
        "password": "TestPass1",
    })
    refresh_token = login_resp.json()["refresh_token"]

    # Use refresh token
    resp = await client.post("/api/v1/auth/refresh", json={
        "refresh_token": refresh_token,
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()


@pytest.mark.asyncio
async def test_refresh_with_access_token_fails(client: AsyncClient, test_user: User):
    login_resp = await client.post("/api/v1/auth/login", json={
        "username": "testuser",
        "password": "TestPass1",
    })
    access_token = login_resp.json()["access_token"]

    resp = await client.post("/api/v1/auth/refresh", json={
        "refresh_token": access_token,
    })
    assert resp.status_code == 401
