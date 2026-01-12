"""Test Project CRUD endpoints"""

import pytest
from uuid import uuid4
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate
from tests.conftest import override_get_db


client = TestClient(app)


class TestProjectEndpoints:
    """Test project CRUD endpoints"""

    @pytest.fixture(autouse=True)
    def setup(self, db_session: Session, auth_headers: dict):
        """Setup test data and fixtures"""
        self.db_session = db_session
        self.auth_headers = auth_headers
        self.project_data = {
            "name": "Test Project",
            "description": "A test project"
        }

    def test_create_project_success(self):
        """Test creating a new project"""
        response = client.post(
            "/api/v1/projects",
            json=self.project_data,
            headers=self.auth_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == self.project_data["name"]
        assert data["description"] == self.project_data["description"]
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data
        assert "created_by" in data

    def test_create_project_without_description(self):
        """Test creating a project without description"""
        project_data = {"name": "Test Project"}
        response = client.post(
            "/api/v1/projects",
            json=project_data,
            headers=self.auth_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == project_data["name"]
        assert data["description"] is None

    def test_create_project_missing_name(self):
        """Test creating a project without name fails"""
        project_data = {"description": "Missing name"}
        response = client.post(
            "/api/v1/projects",
            json=project_data,
            headers=self.auth_headers
        )

        assert response.status_code == 422  # Validation error

    def test_create_project_unauthorized(self):
        """Test creating a project without authentication fails"""
        response = client.post(
            "/api/v1/projects",
            json=self.project_data
        )

        assert response.status_code == 401

    def test_list_projects_empty(self):
        """Test listing projects when none exist"""
        response = client.get(
            "/api/v1/projects",
            headers=self.auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_list_projects_with_data(self):
        """Test listing projects with existing data"""
        # Create a project first
        client.post(
            "/api/v1/projects",
            json=self.project_data,
            headers=self.auth_headers
        )

        # List projects
        response = client.get(
            "/api/v1/projects",
            headers=self.auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert any(p["name"] == self.project_data["name"] for p in data)

    def test_list_projects_pagination(self):
        """Test listing projects with pagination"""
        # Create multiple projects
        for i in range(3):
            client.post(
                "/api/v1/projects",
                json={"name": f"Project {i}", "description": f"Description {i}"},
                headers=self.auth_headers
            )

        # List with limit
        response = client.get(
            "/api/v1/projects?skip=0&limit=2",
            headers=self.auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 2

    def test_list_projects_unauthorized(self):
        """Test listing projects without authentication fails"""
        response = client.get("/api/v1/projects")

        assert response.status_code == 401

    def test_get_project_success(self):
        """Test getting a project by ID"""
        # Create a project
        create_response = client.post(
            "/api/v1/projects",
            json=self.project_data,
            headers=self.auth_headers
        )
        project_id = create_response.json()["id"]

        # Get the project
        response = client.get(
            f"/api/v1/projects/{project_id}",
            headers=self.auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == project_id
        assert data["name"] == self.project_data["name"]
        assert data["description"] == self.project_data["description"]

    def test_get_project_not_found(self):
        """Test getting a non-existent project returns 404"""
        fake_id = str(uuid4())
        response = client.get(
            f"/api/v1/projects/{fake_id}",
            headers=self.auth_headers
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_get_project_unauthorized(self):
        """Test getting a project without authentication fails"""
        fake_id = str(uuid4())
        response = client.get(f"/api/v1/projects/{fake_id}")

        assert response.status_code == 401

    def test_update_project_success(self):
        """Test updating a project"""
        # Create a project
        create_response = client.post(
            "/api/v1/projects",
            json=self.project_data,
            headers=self.auth_headers
        )
        project_id = create_response.json()["id"]

        # Update the project
        update_data = {
            "name": "Updated Project",
            "description": "Updated description"
        }
        response = client.put(
            f"/api/v1/projects/{project_id}",
            json=update_data,
            headers=self.auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == project_id
        assert data["name"] == update_data["name"]
        assert data["description"] == update_data["description"]

    def test_update_project_partial(self):
        """Test partially updating a project"""
        # Create a project
        create_response = client.post(
            "/api/v1/projects",
            json=self.project_data,
            headers=self.auth_headers
        )
        project_id = create_response.json()["id"]

        # Update only name
        update_data = {"name": "New Name"}
        response = client.put(
            f"/api/v1/projects/{project_id}",
            json=update_data,
            headers=self.auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "New Name"
        assert data["description"] == self.project_data["description"]

    def test_update_project_not_found(self):
        """Test updating a non-existent project returns 404"""
        fake_id = str(uuid4())
        response = client.put(
            f"/api/v1/projects/{fake_id}",
            json={"name": "Updated"},
            headers=self.auth_headers
        )

        assert response.status_code == 404

    def test_update_project_unauthorized(self):
        """Test updating a project without authentication fails"""
        fake_id = str(uuid4())
        response = client.put(
            f"/api/v1/projects/{fake_id}",
            json={"name": "Updated"}
        )

        assert response.status_code == 401

    def test_delete_project_success(self):
        """Test deleting a project"""
        # Create a project
        create_response = client.post(
            "/api/v1/projects",
            json=self.project_data,
            headers=self.auth_headers
        )
        project_id = create_response.json()["id"]

        # Delete the project
        response = client.delete(
            f"/api/v1/projects/{project_id}",
            headers=self.auth_headers
        )

        assert response.status_code == 204

        # Verify it's deleted
        get_response = client.get(
            f"/api/v1/projects/{project_id}",
            headers=self.auth_headers
        )
        assert get_response.status_code == 404

    def test_delete_project_not_found(self):
        """Test deleting a non-existent project returns 404"""
        fake_id = str(uuid4())
        response = client.delete(
            f"/api/v1/projects/{fake_id}",
            headers=self.auth_headers
        )

        assert response.status_code == 404

    def test_delete_project_unauthorized(self):
        """Test deleting a project without authentication fails"""
        fake_id = str(uuid4())
        response = client.delete(f"/api/v1/projects/{fake_id}")

        assert response.status_code == 401

    def test_crud_workflow(self):
        """Test complete CRUD workflow"""
        # Create
        create_response = client.post(
            "/api/v1/projects",
            json=self.project_data,
            headers=self.auth_headers
        )
        assert create_response.status_code == 201
        project_id = create_response.json()["id"]

        # Read
        get_response = client.get(
            f"/api/v1/projects/{project_id}",
            headers=self.auth_headers
        )
        assert get_response.status_code == 200

        # Update
        update_response = client.put(
            f"/api/v1/projects/{project_id}",
            json={"name": "Updated"},
            headers=self.auth_headers
        )
        assert update_response.status_code == 200
        assert update_response.json()["name"] == "Updated"

        # List (verify it's in the list)
        list_response = client.get(
            "/api/v1/projects",
            headers=self.auth_headers
        )
        assert list_response.status_code == 200
        projects = list_response.json()
        assert any(p["id"] == project_id for p in projects)

        # Delete
        delete_response = client.delete(
            f"/api/v1/projects/{project_id}",
            headers=self.auth_headers
        )
        assert delete_response.status_code == 204

        # Verify deletion
        final_get = client.get(
            f"/api/v1/projects/{project_id}",
            headers=self.auth_headers
        )
        assert final_get.status_code == 404
