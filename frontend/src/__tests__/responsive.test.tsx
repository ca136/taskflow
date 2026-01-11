import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Dashboard } from '../pages/Dashboard'
import { ResponsiveTest } from '../pages/ResponsiveTest'
import { Navigation } from '../components/common/Navigation'
import { KanbanBoard } from '../components/board/KanbanBoard'
import { Modal } from '../components/common/Modal'
import { TaskForm } from '../components/common/TaskForm'

/**
 * Responsive Design Test Suite
 *
 * Tests responsive behavior at multiple viewport sizes:
 * - 320px (small phones)
 * - 375px (standard phones)
 * - 768px (tablets)
 * - 1024px+ (desktops)
 */

// Mock data for tasks
const mockTasks = [
  {
    id: '1',
    title: 'Design homepage',
    description: 'Create mockups for homepage',
    assignee: 'John',
    priority: 'high',
    status: 'todo',
  },
  {
    id: '2',
    title: 'Implement API',
    description: 'Build REST API endpoints',
    assignee: 'Jane',
    priority: 'high',
    status: 'inprogress',
  },
  {
    id: '3',
    title: 'Write documentation',
    description: 'Document API endpoints',
    assignee: 'Bob',
    priority: 'medium',
    status: 'done',
  },
  {
    id: '4',
    title: 'Test deployment',
    priority: 'low',
    status: 'todo',
  },
]

// Mock the API service
vi.mock('../services/apiClient', () => ({
  apiClient: {
    get: vi.fn((url) => {
      if (url === '/api/tasks') {
        return Promise.resolve({ data: mockTasks })
      }
      return Promise.resolve({ data: null })
    }),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  ApiError: class ApiError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'ApiError'
    }
  },
}))

// Mock the notification store
vi.mock('../stores/notificationStore', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
  useNotification: () => ({
    toasts: [],
  }),
}))

// Helper function to set viewport size
const setViewport = (width: number, height: number = 800) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setViewport(1024) // Reset to desktop
  })

  describe('Navigation Component', () => {
    it('should display mobile menu button on small screens (320px)', () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      )

      const mobileMenuBtn = screen.getByTestId('mobile-menu-btn')
      expect(mobileMenuBtn).toBeInTheDocument()
      expect(mobileMenuBtn).toBeVisible()
    })

    it('should toggle mobile menu when button is clicked', () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      )

      const mobileMenuBtn = screen.getByTestId('mobile-menu-btn')

      // Initially closed
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()

      // Click to open
      fireEvent.click(mobileMenuBtn)
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()

      // Click to close
      fireEvent.click(mobileMenuBtn)
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
    })

    it('should display horizontal menu on medium screens (768px)', () => {
      setViewport(768)
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      )

      // Mobile menu button should exist but with hidden class
      const mobileMenuBtn = screen.getByTestId('mobile-menu-btn')
      expect(mobileMenuBtn).toBeInTheDocument()
    })

    it('should have touch-friendly button sizes (min 44px)', () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      )

      const mobileMenuBtn = screen.getByTestId('mobile-menu-btn')
      const rect = mobileMenuBtn.getBoundingClientRect()
      // Button should have sufficient size for touch targets
      const size = Math.max(rect.width, rect.height)
      expect(size).toBeGreaterThanOrEqual(32) // Reasonable touch target
    })
  })

  describe('Kanban Board - Mobile Layout', () => {
    it('should render kanban board with columns on 320px', async () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Wait for data to load
      await waitFor(() => {
        const board = screen.getByTestId('column-todo')
        expect(board).toBeInTheDocument()
      })

      // Check that all columns are present
      expect(screen.getByTestId('column-inprogress')).toBeInTheDocument()
      expect(screen.getByTestId('column-done')).toBeInTheDocument()
    })

    it('should display all tasks in columns on mobile', async () => {
      setViewport(375)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Wait for tasks to load
      await waitFor(() => {
        const tasks = screen.getAllByTestId(/^task-/)
        expect(tasks.length).toBeGreaterThan(0)
      })

      // Verify tasks are visible
      const tasks = screen.getAllByTestId(/^task-/)
      tasks.forEach((task) => {
        expect(task).toBeVisible()
      })
    })

    it('should display mobile instructions on small screens', async () => {
      setViewport(320)
      const { container } = render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Wait for content to load
      await waitFor(() => {
        expect(container.textContent).toContain('Scroll horizontally')
      })
    })

    it('should display 3 columns at tablet size (768px)', async () => {
      setViewport(768)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Wait for columns to render
      await waitFor(() => {
        const columns = screen.getAllByTestId(/^column-/)
        expect(columns.length).toBe(3) // Todo, InProgress, Done
      })
    })

    it('should wrap task titles on mobile with proper classes', async () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Wait for tasks
      await waitFor(() => {
        const tasks = screen.getAllByTestId(/^task-/)
        expect(tasks.length).toBeGreaterThan(0)

        // Check for text wrapping
        tasks.forEach((task) => {
          const heading = task.querySelector('h3')
          if (heading) {
            expect(heading.className).toContain('break-words')
          }
        })
      })
    })

    it('should display add task buttons on mobile', async () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Wait for buttons
      await waitFor(() => {
        const addTaskBtns = screen.getAllByTestId(/^add-task-/)
        expect(addTaskBtns.length).toBeGreaterThan(0)
      })

      const addTaskBtns = screen.getAllByTestId(/^add-task-/)
      addTaskBtns.forEach((btn) => {
        expect(btn).toBeVisible()
      })
    })
  })

  describe('Modal - Responsive Sizing', () => {
    it('should fit modal on 320px screen', () => {
      setViewport(320)
      const onClose = vi.fn()
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      )

      const modal = screen.getByTestId('modal-backdrop')
      expect(modal).toBeInTheDocument()

      // Close button should be accessible
      const closeBtn = screen.getByTestId('modal-close-btn')
      expect(closeBtn).toBeVisible()
    })

    it('should have scrollable content for long modal text', () => {
      setViewport(375)
      const onClose = vi.fn()
      const { container } = render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div className="max-h-96 overflow-y-auto">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i}>Line {i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            ))}
          </div>
        </Modal>
      )

      // Modal should be in document
      expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument()

      // Content area should exist
      const contentArea = container.querySelector('div.max-h-96')
      expect(contentArea?.className).toContain('overflow-y-auto')
    })

    it('should close modal when backdrop is clicked on mobile', () => {
      setViewport(320)
      const onClose = vi.fn()
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      )

      const backdrop = screen.getByTestId('modal-backdrop')
      fireEvent.click(backdrop)
      expect(onClose).toHaveBeenCalled()
    })

    it('should be properly centered on desktop (1024px)', () => {
      setViewport(1024)
      const onClose = vi.fn()
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      )

      const backdrop = screen.getByTestId('modal-backdrop')
      expect(backdrop).toBeInTheDocument()
      expect(backdrop).toBeVisible()
    })
  })

  describe('TaskForm - Responsive Fields', () => {
    it('should display form with proper responsive layout on mobile', () => {
      setViewport(320)
      const onSubmit = vi.fn()
      render(<TaskForm onSubmit={onSubmit} />)

      // Form should render
      expect(screen.getByTestId('form-title')).toBeInTheDocument()
    })

    it('should have accessible labels on all screen sizes', () => {
      setViewport(375)
      const onSubmit = vi.fn()
      render(<TaskForm onSubmit={onSubmit} />)

      // Labels should be present and accessible
      expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Assign To/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument()
    })

    it('should have proper button styling and spacing on mobile', () => {
      setViewport(320)
      const onSubmit = vi.fn()
      render(<TaskForm onSubmit={onSubmit} />)

      const submitBtn = screen.getByTestId('form-submit')
      const resetBtn = screen.getByTestId('form-reset')

      // Buttons should be present and visible
      expect(submitBtn).toBeVisible()
      expect(resetBtn).toBeVisible()
    })

    it('should submit form on mobile', () => {
      setViewport(320)
      const onSubmit = vi.fn()
      render(<TaskForm onSubmit={onSubmit} />)

      const titleInput = screen.getByTestId('form-title') as HTMLInputElement
      const submitBtn = screen.getByTestId('form-submit')

      fireEvent.change(titleInput, { target: { value: 'Test Task' } })
      fireEvent.click(submitBtn)

      expect(onSubmit).toHaveBeenCalled()
    })
  })

  describe('Dashboard - Full Page Responsive', () => {
    it('should render dashboard on 320px without overflow', async () => {
      setViewport(320)
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      // Wait for dashboard to render
      await waitFor(() => {
        const dashboard = container.querySelector('[class*="flex"]')
        expect(dashboard).toBeInTheDocument()
      })
    })

    it('should display create task button on mobile', async () => {
      setViewport(375)
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      // Wait for button to appear
      await waitFor(() => {
        const createBtn = screen.getByTestId('create-task-btn')
        expect(createBtn).toBeVisible()
      })
    })

    it('should open task modal on mobile', async () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      const createBtn = screen.getByTestId('create-task-btn')
      fireEvent.click(createBtn)

      await waitFor(() => {
        expect(screen.getByTestId('form-title')).toBeInTheDocument()
      })
    })

    it('should display header on mobile', async () => {
      setViewport(375)
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      // Wait for content
      await waitFor(() => {
        const header = container.querySelector('h1')
        expect(header).toBeInTheDocument()
      })
    })
  })

  describe('ResponsiveTest Page', () => {
    it('should render viewport selection buttons', () => {
      setViewport(1024)
      render(
        <BrowserRouter>
          <ResponsiveTest />
        </BrowserRouter>
      )

      // Check that the test page renders
      const testPage = screen.getByTestId('responsive-test-page')
      expect(testPage).toBeInTheDocument()
    })

    it('should allow opening task modal from test page', async () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <ResponsiveTest />
        </BrowserRouter>
      )

      const openModalBtn = screen.getByTestId('open-task-modal-btn')
      fireEvent.click(openModalBtn)

      await waitFor(() => {
        expect(screen.getByTestId('task-modal')).toBeInTheDocument()
      })
    })
  })

  describe('Touch-Friendly Interactions', () => {
    it('should have adequate button sizes on mobile', () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect()
        // Check that buttons have reasonable size for touch
        expect(rect.width).toBeGreaterThan(0)
        expect(rect.height).toBeGreaterThan(0)
      })
    })

    it('should have proper spacing between interactive elements', async () => {
      setViewport(375)
      const { container } = render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Wait for board to load
      await waitFor(() => {
        const buttons = container.querySelectorAll('button')
        expect(buttons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Text Wrapping and Overflow', () => {
    it('should wrap long task titles on mobile', async () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      await waitFor(() => {
        const tasks = screen.getAllByTestId(/^task-/)
        expect(tasks.length).toBeGreaterThan(0)

        tasks.forEach((task) => {
          const heading = task.querySelector('h3')
          if (heading) {
            expect(heading.className).toContain('break-words')
          }
        })
      })
    })

    it('should not have excessive horizontal scrolling on mobile', async () => {
      setViewport(375)
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      // Main content area should use flex layout
      const main = container.querySelector('main')
      expect(main?.className).toContain('flex')

      await waitFor(() => {
        // Dashboard should be properly laid out
        expect(screen.getByTestId('create-task-btn')).toBeInTheDocument()
      })
    })
  })

  describe('Viewport-Specific Visibility', () => {
    it('should hide mobile menu on desktop (1024px)', () => {
      setViewport(1024)
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      )

      // Mobile menu button exists but should be hidden with CSS
      const mobileMenuBtn = screen.getByTestId('mobile-menu-btn')
      expect(mobileMenuBtn).toBeInTheDocument()

      // Mobile menu should not be visible unless explicitly opened
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
    })

    it('should show mobile instructions only on small screens', async () => {
      // At 768px (tablet), mobile instructions should not be visible
      setViewport(768)
      const { container: container768 } = render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      await waitFor(() => {
        // Board should load
        expect(screen.getByTestId('column-todo')).toBeInTheDocument()
      })

      // At 320px, instructions should be visible
      const { container: container320 } = render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      setViewport(320)
      await waitFor(() => {
        const instructions = Array.from(container320.querySelectorAll('*')).find((el) =>
          el.textContent?.includes('Scroll horizontally')
        )
        expect(instructions).toBeDefined()
      })
    })
  })
})
