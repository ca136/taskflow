# Contributing to TaskFlow

Thank you for your interest in contributing to TaskFlow! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/taskflow.git`
3. Add upstream: `git remote add upstream https://github.com/ca136/taskflow.git`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Setup

Follow the [SETUP.md](./SETUP.md) guide to set up your development environment.

## Making Changes

### Code Style

#### Python Backend
- Follow PEP 8 style guide
- Use type hints for all functions
- Format with Black: `black .`
- Lint with Flake8: `flake8 .`
- Type check with MyPy: `mypy app --ignore-missing-imports`

```python
# Good example
async def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectResponse:
    """Retrieve a project by ID."""
    project = await db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return project
```

#### JavaScript/TypeScript Frontend
- Use ESLint configuration provided
- Format with Prettier
- Write functional components with hooks
- Use TypeScript for type safety

```typescript
// Good example
interface ProjectListProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  isLoading: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelect,
  isLoading,
}) => {
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onSelect(project)}
        />
      ))}
    </div>
  );
};
```

### Commit Messages

Follow conventional commits:

```
feat: add user authentication
fix: resolve database connection timeout
docs: update setup instructions
test: add tests for project service
refactor: simplify task filtering logic
style: fix linting issues
chore: update dependencies
```

Format:
- Type: feat, fix, docs, test, refactor, style, chore
- Scope (optional): feature area
- Subject: imperative mood, no period, under 50 chars
- Body (optional): explain what and why, not how

### Branching Strategy

- `main` - Production ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

## Testing

### Before Submitting a PR

#### Backend
```bash
cd backend

# Run tests
pytest

# Check coverage
pytest --cov=app

# Lint
black .
flake8 .
mypy app --ignore-missing-imports
```

#### Frontend
```bash
cd frontend

# Run tests
npm run test

# Check types
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

### Writing Tests

#### Backend Tests
```python
# tests/api/test_projects.py
from httpx import AsyncClient
import pytest

@pytest.mark.asyncio
async def test_create_project(
    client: AsyncClient,
    authenticated_user: User,
):
    """Test creating a new project."""
    response = await client.post(
        "/api/v1/projects",
        json={"name": "Test Project"},
        headers={"Authorization": f"Bearer {authenticated_user.token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Project"
```

#### Frontend Tests
```typescript
// src/components/__tests__/ProjectCard.test.tsx
import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';

describe('ProjectCard', () => {
  it('renders project information', () => {
    const project = { id: 1, name: 'Test', description: 'Test project' };
    render(<ProjectCard project={project} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Test project')).toBeInTheDocument();
  });
});
```

## Submitting Changes

1. Push your branch: `git push origin feature/your-feature-name`
2. Create a Pull Request on GitHub
3. Fill out the PR template with:
   - Description of changes
   - Type of change (feat, fix, etc.)
   - Testing performed
   - Screenshots (if UI changes)

### PR Title Format
```
[TYPE] Short description

Example:
[FEAT] Add task filtering by status
[FIX] Resolve CORS issue with frontend
[DOCS] Update API documentation
```

## Code Review Process

1. At least one approval required
2. All CI checks must pass
3. No merge conflicts
4. Follow project guidelines

### Review Checklist
- [ ] Code follows style guide
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No unnecessary dependencies added
- [ ] Performance impact considered
- [ ] Security implications reviewed

## Reporting Issues

### Bug Report
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

### Feature Request
- Clear description of use case
- Why this feature is needed
- Possible implementation approach
- Any design mockups (if applicable)

## Documentation

### Updating Docs
1. Update relevant markdown files
2. Follow existing markdown style
3. Include examples where applicable
4. Link to related documentation

### Code Comments
- Explain the "why", not the "what"
- Keep comments up-to-date
- Use docstrings for functions/classes

```python
# Good docstring
def create_project(
    name: str,
    owner_id: int,
    db: Session,
) -> Project:
    """
    Create a new project.
    
    Args:
        name: Project name
        owner_id: ID of the project owner
        db: Database session
    
    Returns:
        Created project instance
    
    Raises:
        ValueError: If project name is empty
    """
```

## Performance Considerations

- Profile code for bottlenecks
- Optimize database queries (use indexes, eager loading)
- Minimize frontend bundle size
- Cache where appropriate
- Use async/await properly in backend

## Security Considerations

- Never commit secrets or credentials
- Validate all user input
- Sanitize database queries
- Use environment variables for config
- Check OWASP guidelines
- Review authentication logic

## Dependency Management

### Adding Dependencies

Backend (Python):
```bash
cd backend
pip install new-package
pip freeze > requirements.txt
git add requirements.txt
```

Frontend (JavaScript):
```bash
cd frontend
npm install new-package
git add package.json package-lock.json
```

Discuss large dependencies in a PR first.

## Asking for Help

- Comment on the issue with questions
- Use GitHub Discussions for general questions
- Ask in PR comments during review
- Check existing issues and PRs first

## Release Process

1. Update version in files (if applicable)
2. Update CHANGELOG
3. Create git tag
4. Deploy to production

## Additional Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Setup Guide](./SETUP.md)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Questions?

- Check existing issues and PRs
- Review documentation
- Start a GitHub Discussion
- Comment on relevant issues

Thank you for contributing to TaskFlow! 🚀
