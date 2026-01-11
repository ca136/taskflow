# TaskFlow Frontend

React 18 + TypeScript + Vite application for TaskFlow project management. A modern, type-safe frontend with state management, API integration, and responsive UI.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR
npm run dev:prod        # Start with production build

# Building
npm run build            # Build for production
npm run preview          # Preview production build locally

# Quality Assurance
npm test                 # Run test suite
npm run type-check       # TypeScript type checking
npm run lint             # ESLint code analysis
npm run lint:fix         # Fix linting issues automatically
npm run format           # Format code with Prettier

# Cleanup
npm run clean            # Remove build artifacts
```

---

## 🏗️ Architecture

### Tech Stack

| Purpose | Technology | Version |
|---------|-----------|---------|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.6.3 |
| Build Tool | Vite | 5.4.2 |
| Styling | Tailwind CSS | 3.4.3 |
| Server State | React Query | 5.50.1 |
| Client State | Zustand | 4.5.2 |
| Routing | React Router | 6.x |
| Forms | React Hook Form | 7.x |
| HTTP Client | Axios | 1.x |
| Testing | Vitest | Latest |

### State Management Strategy

TaskFlow uses a **hybrid state management approach**:

- **React Query**: Server state (API responses, cache invalidation)
- **Zustand**: Client state (auth, UI preferences, modals)
- **React Context**: Theme, i18n, global preferences
- **Component State**: Local component logic with `useState`

```typescript
// Example: Using both React Query + Zustand
function TaskBoard() {
  // Server state from API
  const { data: tasks } = useQuery(['tasks'], fetchTasks);
  
  // Client state for UI
  const { selectedFilter } = useTaskStore();
  
  // Filtered view
  const filtered = tasks?.filter(t => t.status === selectedFilter);
}
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Store / React Query Mutation
    ↓
API Service Call
    ↓
Backend API
    ↓
Response
    ↓
Cache Update / Store Update
    ↓
Component Re-render
    ↓
Updated UI
```

---

## 📁 Directory Structure

### Core Directories

```
src/
├── api/                          # API client and utilities
│   ├── client.ts                 # Axios instance configuration
│   ├── endpoints/                # API endpoint definitions
│   │   ├── auth.ts               # Authentication endpoints
│   │   ├── projects.ts           # Project endpoints
│   │   └── tasks.ts              # Task endpoints
│   └── hooks.ts                  # React Query hooks
│
├── components/                   # Reusable UI components
│   ├── common/                   # Generic/shared components
│   │   ├── Button.tsx            # Button component
│   │   ├── Modal.tsx             # Modal component
│   │   ├── Loader.tsx            # Loading spinner
│   │   └── ErrorBoundary.tsx     # Error boundary
│   │
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Sidebar.tsx           # Sidebar navigation
│   │   └── MainLayout.tsx        # Main layout wrapper
│   │
│   ├── forms/                    # Form components
│   │   ├── LoginForm.tsx         # Login form
│   │   ├── ProjectForm.tsx       # Project creation/edit
│   │   └── TaskForm.tsx          # Task creation/edit
│   │
│   ├── kanban/                   # Kanban board components
│   │   ├── Board.tsx             # Main board component
│   │   ├── Column.tsx            # Kanban column
│   │   ├── Card.tsx              # Task card
│   │   └── DragDropContext.tsx   # Drag-drop setup
│   │
│   └── tasks/                    # Task-specific components
│       ├── TaskList.tsx
│       ├── TaskDetail.tsx
│       └── TaskActions.tsx
│
├── pages/                        # Route-level page components
│   ├── DashboardPage.tsx         # Dashboard/home
│   ├── ProjectPage.tsx           # Project details page
│   ├── BoardPage.tsx             # Kanban board page
│   ├── LoginPage.tsx             # Login page
│   ├── NotFoundPage.tsx          # 404 page
│   └── ErrorPage.tsx             # Error page
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication hook
│   ├── useProjects.ts            # Projects hook
│   ├── useTasks.ts               # Tasks hook
│   ├── useLocalStorage.ts        # Local storage hook
│   └── usePagination.ts          # Pagination hook
│
├── store/                        # Zustand state stores
│   ├── auth.store.ts             # Auth state
│   ├── project.store.ts          # Project state
│   ├── task.store.ts             # Task state
│   ├── ui.store.ts               # UI state (modals, etc)
│   └── index.ts                  # Store exports
│
├── types/                        # TypeScript type definitions
│   ├── api.types.ts              # API response types
│   ├── entities.types.ts         # Domain entity types
│   ├── forms.types.ts            # Form-specific types
│   └── index.ts                  # Type exports
│
├── utils/                        # Utility functions
│   ├── formatDate.ts             # Date formatting
│   ├── api.utils.ts              # API utilities
│   ├── validation.ts             # Form validation
│   ├── error.ts                  # Error handling
│   └── constants.ts              # App constants
│
├── styles/                       # Global styles
│   ├── global.css                # Global CSS
│   ├── variables.css             # CSS variables
│   └── themes/                   # Theme definitions
│
├── assets/                       # Static assets
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── App.tsx                       # Root component
├── main.tsx                      # Entry point
├── App.css                       # Root styles
└── index.css                     # Global index styles
```

---

## 🧠 Component Development Guide

### Creating a New Component

**Always use TypeScript interfaces for props:**

```typescript
// components/mycomponent/MyComponent.tsx
import React from 'react';
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
  loading?: boolean;
}

export const MyComponent: FC<MyComponentProps> = ({
  title,
  onAction,
  loading = false,
}) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <button onClick={onAction} disabled={loading}>
        {loading ? 'Loading...' : 'Action'}
      </button>
    </div>
  );
};

export default MyComponent;
```

### Component Best Practices

1. **Use Functional Components with Hooks**
   ```typescript
   // ✅ Good
   const MyComponent: FC<Props> = () => {
     const [state, setState] = useState();
   };
   
   // ❌ Avoid
   class MyComponent extends React.Component {}
   ```

2. **Props Destructuring**
   ```typescript
   // ✅ Good - explicit, typed
   interface Props { id: string; name: string; }
   const Component: FC<Props> = ({ id, name }) => {};
   
   // ❌ Avoid - implicit, untyped
   const Component = (props) => props.id;
   ```

3. **Custom Hooks for Logic**
   ```typescript
   // ✅ Extract logic into custom hooks
   const { tasks, loading } = useTasks();
   
   // ❌ Don't put all logic in component
   ```

4. **Memoization for Performance**
   ```typescript
   // ✅ Memoize expensive components
   export const ExpensiveComponent = memo(({ data }) => {
     return <div>{data}</div>;
   });
   ```

### Component Example: Task Card

```typescript
// components/kanban/Card.tsx
import React, { FC, memo } from 'react';
import { Task } from '@/types';
import { formatDate } from '@/utils/formatDate';
import styles from './Card.module.css';

interface CardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const Card: FC<CardProps> = memo(
  ({ task, onDragStart, onEdit, onDelete }) => {
    return (
      <div
        className={styles.card}
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{task.title}</h3>
          <span className={`${styles.priority} ${styles[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(task.createdAt)}</span>
          <div className={styles.actions}>
            <button onClick={() => onEdit(task)} title="Edit">
              ✏️
            </button>
            <button onClick={() => onDelete(task.id)} title="Delete">
              🗑️
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';
```

---

## 🔌 API Integration

### Setting Up API Endpoints

**1. Create API configuration:**

```typescript
// api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/store';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
```

**2. Define endpoint functions:**

```typescript
// api/endpoints/tasks.ts
import client from '../client';
import { Task } from '@/types';

export const taskAPI = {
  list: (projectId: string) =>
    client.get<Task[]>(`/api/v1/projects/${projectId}/tasks`),
  
  get: (taskId: string) =>
    client.get<Task>(`/api/v1/tasks/${taskId}`),
  
  create: (projectId: string, data: Partial<Task>) =>
    client.post<Task>(`/api/v1/projects/${projectId}/tasks`, data),
  
  update: (taskId: string, data: Partial<Task>) =>
    client.put<Task>(`/api/v1/tasks/${taskId}`, data),
  
  delete: (taskId: string) =>
    client.delete(`/api/v1/tasks/${taskId}`),
};
```

**3. Create React Query hooks:**

```typescript
// api/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from './endpoints/tasks';

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskAPI.list(projectId),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<Task> }) =>
      taskAPI.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
```

**4. Use in components:**

```typescript
function TaskList() {
  const { data: tasks, loading, error } = useTasks('project-1');
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {tasks?.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  );
}
```

---

## 🎨 Styling with Tailwind CSS

### Tailwind Setup

- **Configuration**: `tailwind.config.js` - custom colors, fonts, plugins
- **CSS Directives**: `index.css` - Tailwind imports (@tailwind directives)
- **PurgeCSS**: Automatically removes unused styles in production

### Styling Best Practices

**1. Use utility classes:**
```typescript
// ✅ Prefer utility classes
<div className="flex gap-4 p-6 bg-blue-50 rounded-lg">

// ❌ Avoid arbitrary CSS
<div style={{ display: 'flex', gap: '16px' }}>
```

**2. Extract repeated patterns to components:**
```typescript
// ✅ Create reusable components
export const Card: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    {children}
  </div>
);
```

**3. Use CSS Modules for complex styles:**
```typescript
// ✅ CSS Modules for scoped styles
import styles from './Component.module.css';

<div className={styles.card}>
  {/* Styles are scoped to this component */}
</div>
```

---

## 🧪 Testing

### Test Structure

```
tests/
├── unit/                  # Unit tests
│   ├── utils.test.ts
│   └── hooks.test.ts
├── integration/           # Integration tests
│   ├── api.integration.test.ts
│   └── auth.integration.test.ts
└── e2e/                   # End-to-end tests
    └── kanban.e2e.test.ts
```

### Writing Tests

```typescript
// __tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth', () => {
  it('should login user', async () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.login('user@example.com', 'password');
    });
    
    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## 🔐 Environment Variables

Create `.env.local` (not committed to git):

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CRASH_REPORTING=false

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

**Note**: Prefix all variables with `VITE_` for Vite to expose them.

---

## 📦 Building for Production

### Build Command
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Output
```
dist/
├── index.html                   # Entry HTML
├── assets/
│   ├── index-[hash].js          # Main bundle
│   ├── vendor-[hash].js         # Dependencies
│   └── styles-[hash].css        # Compiled CSS
└── [other assets]
```

### Performance Optimization
- ✅ Code splitting by route
- ✅ Tree-shaking unused code
- ✅ Minification and compression
- ✅ Image optimization
- ✅ CSS purging

### Deployment

**Option 1: Static Hosting (Vercel, Netlify)**
```bash
npm run build
# Deploy dist/ folder
```

**Option 2: Docker**
```bash
docker build -t taskflow-frontend -f Dockerfile .
docker run -p 3000:80 taskflow-frontend
```

---

## 🐛 Debugging

### Browser DevTools
- **React DevTools**: Inspect component hierarchy and state
- **Redux DevTools**: View Zustand state (via browser extension)
- **Network Tab**: Monitor API calls

### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

### Logging
```typescript
// Use conditional logging
if (import.meta.env.DEV) {
  console.log('Debug:', data);
}
```

---

## 📚 Resources

- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **React Query**: https://tanstack.com/query/latest
- **Zustand**: https://github.com/pmndrs/zustand
- **TypeScript**: https://www.typescriptlang.org

---

## 🔗 Related Documentation

- [Backend README](../backend/README.md) - Backend development guide
- [Architecture Guide](../docs/ARCHITECTURE.md) - System design
- [API Reference](../docs/API.md) - API endpoints
- [Contributing Guide](../CONTRIBUTING.md) - Contribution guidelines

---

## 💡 Tips for Development

1. **Use `console.log` sparingly** - Use browser DevTools instead
2. **Keep components small** - Easier to test and maintain
3. **Memoize expensive operations** - Use `useMemo` and `useCallback`
4. **Extract constants** - Define strings and numbers as constants
5. **Write meaningful variable names** - `user` not `u`
6. **Comment complex logic** - Explain the "why", not the "what"

---

**Happy coding! 🚀**
