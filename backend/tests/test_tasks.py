"""Tests for task endpoints"""

import pytest
from fastapi.testclient import TestClient
from app.models import Task, Project
from app.schemas import TaskCreate, TaskUpdate


def test_create_task(client, db_session):
    """Test creating a new task"""
    # First create a project
    project = Project(name="Test Project", description="Test Description")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    # Create task
    task_data = {
        "title": "Test Task",
        "description": "Test task description",
        "project_id": project.id,
        "status": "todo",
        "priority": "medium"
    }
    response = client.post("/api/v1/tasks", json=task_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["project_id"] == project.id


def test_create_task_invalid_project(client):
    """Test creating a task with non-existent project"""
    task_data = {
        "title": "Test Task",
        "description": "Test task description",
        "project_id": 9999,
        "status": "todo",
        "priority": "medium"
    }
    response = client.post("/api/v1/tasks", json=task_data)
    assert response.status_code == 404


def test_list_tasks(client, db_session):
    """Test listing all tasks"""
    # Create project
    project = Project(name="Test Project")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    # Create multiple tasks
    for i in range(3):
        task = Task(
            title=f"Task {i}",
            description=f"Description {i}",
            project_id=project.id,
            status="todo"
        )
        db_session.add(task)
    db_session.commit()
    
    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3


def test_list_tasks_with_project_filter(client, db_session):
    """Test listing tasks filtered by project"""
    # Create projects
    project1 = Project(name="Project 1")
    project2 = Project(name="Project 2")
    db_session.add_all([project1, project2])
    db_session.commit()
    db_session.refresh(project1)
    db_session.refresh(project2)
    
    # Create tasks for different projects
    task1 = Task(title="Task 1", project_id=project1.id, status="todo")
    task2 = Task(title="Task 2", project_id=project2.id, status="todo")
    db_session.add_all([task1, task2])
    db_session.commit()
    
    # Filter by project1
    response = client.get(f"/api/v1/tasks?project_id={project1.id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Task 1"


def test_get_task(client, db_session):
    """Test getting a task by ID"""
    # Create project and task
    project = Project(name="Test Project")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    task = Task(
        title="Test Task",
        description="Test Description",
        project_id=project.id,
        status="todo"
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    
    response = client.get(f"/api/v1/tasks/{task.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["id"] == task.id


def test_get_nonexistent_task(client):
    """Test getting a non-existent task"""
    response = client.get("/api/v1/tasks/9999")
    assert response.status_code == 404


def test_update_task(client, db_session):
    """Test updating a task"""
    # Create project and task
    project = Project(name="Test Project")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    task = Task(
        title="Original Title",
        description="Original Description",
        project_id=project.id,
        status="todo"
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    
    # Update task
    update_data = {
        "title": "Updated Title",
        "description": "Updated Description",
        "status": "in_progress",
        "priority": "high"
    }
    response = client.put(f"/api/v1/tasks/{task.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["status"] == "in_progress"
    assert data["priority"] == "high"


def test_update_nonexistent_task(client):
    """Test updating a non-existent task"""
    update_data = {"title": "Updated Title"}
    response = client.put("/api/v1/tasks/9999", json=update_data)
    assert response.status_code == 404


def test_delete_task(client, db_session):
    """Test deleting a task"""
    # Create project and task
    project = Project(name="Test Project")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    task = Task(title="Test Task", project_id=project.id, status="todo")
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    task_id = task.id
    
    # Delete task
    response = client.delete(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 204
    
    # Verify it's gone
    response = client.get(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 404


def test_delete_nonexistent_task(client):
    """Test deleting a non-existent task"""
    response = client.delete("/api/v1/tasks/9999")
    assert response.status_code == 404


def test_update_task_status(client, db_session):
    """Test updating task status"""
    # Create project and task
    project = Project(name="Test Project")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    task = Task(title="Test Task", project_id=project.id, status="todo")
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    
    # Update status
    response = client.patch(
        f"/api/v1/tasks/{task.id}/status",
        json={"status": "in_progress"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "in_progress"


def test_update_status_nonexistent_task(client):
    """Test updating status of non-existent task"""
    response = client.patch(
        "/api/v1/tasks/9999/status",
        json={"status": "in_progress"}
    )
    assert response.status_code == 404


def test_update_status_invalid_status(client, db_session):
    """Test updating task with invalid status"""
    # Create project and task
    project = Project(name="Test Project")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    task = Task(title="Test Task", project_id=project.id, status="todo")
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    
    # Try to update with invalid status
    response = client.patch(
        f"/api/v1/tasks/{task.id}/status",
        json={"status": "invalid_status"}
    )
    assert response.status_code == 422  # Validation error


def test_task_fields_preserved(client, db_session):
    """Test that unspecified fields are preserved when updating"""
    # Create project and task
    project = Project(name="Test Project")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    task = Task(
        title="Original Title",
        description="Original Description",
        project_id=project.id,
        status="todo",
        priority="high"
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    
    # Update only title
    update_data = {"title": "New Title"}
    response = client.put(f"/api/v1/tasks/{task.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    
    # Verify other fields are preserved
    assert data["title"] == "New Title"
    assert data["description"] == "Original Description"
    assert data["priority"] == "high"


def test_create_task_minimal_data(client, db_session):
    """Test creating a task with minimal required data"""
    # Create project
    project = Project(name="Test Project")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    
    # Create task with only required fields
    task_data = {
        "title": "Minimal Task",
        "project_id": project.id
    }
    response = client.post("/api/v1/tasks", json=task_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Minimal Task"
    assert data["status"] == "todo"  # Default status


def test_list_tasks_empty(client):
    """Test listing tasks when none exist"""
    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
