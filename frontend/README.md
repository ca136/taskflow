# TaskFlow Frontend

React 18 + TypeScript + Vite application for TaskFlow project management.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

## Development

The frontend is built with:
- **React 18**: Modern UI library
- **TypeScript**: Type safety
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and caching
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling
- **Axios**: HTTP client

## Directory Structure

```
src/
├── components/         # Reusable React components
│   ├── common/        # UI components
│   ├── layout/        # Layout components
│   ├── forms/         # Form components
│   └── kanban/        # Kanban board components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── store/             # Zustand state stores
├── services/          # API client and utilities
├── types/             # TypeScript interfaces
├── config/            # Configuration files
├── styles/            # Global styles
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

## Environment Variables

### Setup

1. Copy the example environment file:
```bash
cp .env.example .env.development
```

2. Update variables as needed for your environment.

### Available Variables

- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

### Environment Files

- `.env.example` - Template with all available variables
- `.env.development` - Development environment (auto-loaded by Vite)
- `.env.production` - Production environment (optional, for production builds)

### How Vite Loads Environment Files

Vite automatically loads environment files based on the environment:
- Development: `.env` + `.env.development`
- Production: `.env` + `.env.production`

Environment variables must be prefixed with `VITE_` to be exposed to client-side code.

### Using Environment Variables in Code

```typescript
import config from '@/config/environment'

// Access via config object
const apiUrl = config.apiUrl
```

## Architecture

See [ARCHITECTURE.md](../ARCHITECTURE.md) for detailed frontend architecture information.

## Setup Instructions

See [SETUP.md](../SETUP.md#frontend-setup) for detailed setup instructions.
