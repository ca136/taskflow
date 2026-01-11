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
├── styles/            # Global styles
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

## Environment Variables

Create a `.env.local` file (see `.env.example`):

```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=TaskFlow
```

## Architecture

See [ARCHITECTURE.md](../ARCHITECTURE.md) for detailed frontend architecture information.

## Setup Instructions

See [SETUP.md](../SETUP.md#frontend-setup) for detailed setup instructions.
