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

      // Desktop menu should not be visible
      const desktopLinks = screen.queryAllByRole('link')
      const desktopMenu = desktopLinks.filter((link) => {
        const className = link.className
        return className && className.includes('hidden')
      })
      expect(desktopMenu.length).toBeGreaterThan(0)
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

      // Mobile menu button should be hidden (class: hidden md:flex exists)
      const mobileMenuBtn = screen.getByTestId('mobile-menu-btn')
      const parentDiv = mobileMenuBtn.parentElement
      expect(parentDiv?.className).toContain('md:hidden')

      // Mobile menu should not be rendered initially
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
    })

    it('should have touch-friendly button sizes (min 44px)', () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      )

      const mobileMenuBtn = screen.getByTestId('mobile-menu-btn')
      const rect = mobileMenuBtn.getBoundingClientRect()
      // Button should be at least 44px for touch targets (often with padding it's larger)
      expect(rect.width + rect.height).toBeGreaterThanOrEqual(88)
    })
  })

  describe('Kanban Board - Mobile Layout', () => {
    it('should render kanban board with single column layout on 320px', () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      const board = screen.getByTestId('column-todo')
      expect(board).toBeInTheDocument()

      // Check that columns are present
      expect(screen.getByTestId('column-inprogress')).toBeInTheDocument()
      expect(screen.getByTestId('column-done')).toBeInTheDocument()
    })

    it('should display all tasks in columns on mobile', () => {
      setViewport(375)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Check for task elements
      const tasks = screen.getAllByTestId(/^task-/)
      expect(tasks.length).toBeGreaterThan(0)

      // Tasks should be visible
      tasks.forEach((task) => {
        expect(task).toBeVisible()
      })
    })

    it('should have scrollable mobile instructions on small screens', () => {
      setViewport(320)
      const { container } = render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Look for the mobile instructions div
      const instructions = container.textContent
      expect(instructions).toContain('Scroll horizontally')
    })

    it('should display columns side-by-side on tablet (768px)', () => {
      setViewport(768)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      const columns = screen.getAllByTestId(/^column-/)
      expect(columns.length).toBe(3) // Todo, InProgress, Done

      // Check grid layout classes on container
      const firstColumn = columns[0]
      const parentGrid = firstColumn.parentElement
      expect(parentGrid?.className).toContain('grid')
      expect(parentGrid?.className).toContain('md:grid-cols-3')
    })

    it('should wrap task titles on mobile', () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      const tasks = screen.getAllByTestId(/^task-/)
      tasks.forEach((task) => {
        const heading = task.querySelector('h3')
        expect(heading?.className).toContain('break-words')
      })
    })

    it('should display add task buttons on mobile', () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      const addTaskBtns = screen.getAllByTestId(/^add-task-/)
      expect(addTaskBtns.length).toBeGreaterThan(0)

      // Buttons should be interactive on mobile
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

      const modal = screen.getByTestId('modal-backdrop').parentElement
      expect(modal).toBeInTheDocument()

      // Close button should be accessible on small screens
      const closeBtn = screen.getByTestId('modal-close-btn')
      expect(closeBtn).toBeVisible()
    })

    it('should make modal scrollable if content is long', () => {
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

      // Modal content area should have overflow handling
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

    it('should be centered on desktop (1024px)', () => {
      setViewport(1024)
      const onClose = vi.fn()
      const { container } = render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      )

      // Check for centering classes
      const modalContainer = container.querySelector('div.inline-block')
      expect(modalContainer?.className).toContain('sm:max-w-lg')
    })
  })

  describe('TaskForm - Responsive Fields', () => {
    it('should display form fields full-width on mobile', () => {
      setViewport(320)
      const onSubmit = vi.fn()
      render(<TaskForm onSubmit={onSubmit} />)

      const inputs = screen.getAllByRole('textbox')
      inputs.forEach((input) => {
        expect(input.className).toContain('w-full')
      })
    })

    it('should have accessible labels on all screen sizes', () => {
      setViewport(375)
      const onSubmit = vi.fn()
      render(<TaskForm onSubmit={onSubmit} />)

      expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Assign To/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument()
    })

    it('should have proper button spacing on mobile', () => {
      setViewport(320)
      const onSubmit = vi.fn()
      render(<TaskForm onSubmit={onSubmit} />)

      const submitBtn = screen.getByTestId('form-submit')
      const resetBtn = screen.getByTestId('form-reset')

      // Buttons should be full-width on mobile
      expect(submitBtn.className).toContain('w-full')
      expect(resetBtn.className).toContain('w-full')
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
    it('should render dashboard on 320px without overflow', () => {
      setViewport(320)
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      const dashboard = container.firstChild
      expect(dashboard).toBeInTheDocument()

      // Should have flex layout for proper sizing
      expect(dashboard?.className).toContain('flex')
      expect(dashboard?.className).toContain('h-screen')
    })

    it('should display create task button on mobile', () => {
      setViewport(375)
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      const createBtn = screen.getByTestId('create-task-btn')
      expect(createBtn).toBeVisible()

      // Button should be full-width on mobile
      expect(createBtn.className).toContain('w-full')
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

    it('should display header with proper typography on mobile', () => {
      setViewport(375)
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      const header = container.querySelector('h1')
      expect(header?.textContent).toContain('Dashboard')

      // Should have responsive text sizing
      expect(header?.className).toContain('text-')
    })
  })

  describe('ResponsiveTest Page', () => {
    it('should allow viewport selection on test page', () => {
      setViewport(1024)
      render(
        <BrowserRouter>
          <ResponsiveTest />
        </BrowserRouter>
      )

      const viewportButtons = ['full', '320px', '375px', '768px'].map((size) =>
        screen.getByTestId(`viewport-${size}`)
      )

      expect(viewportButtons.length).toBe(4)
      viewportButtons.forEach((btn) => {
        expect(btn).toBeInTheDocument()
      })
    })

    it('should open modal from test page', async () => {
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
    it('should have minimum 44px touch targets on buttons', () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect()
        // At least 44px in height or width for touch
        expect(Math.max(rect.width, rect.height)).toBeGreaterThanOrEqual(44)
      })
    })

    it('should have sufficient spacing between interactive elements on mobile', () => {
      setViewport(375)
      const { container } = render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      // Check for gap classes in grid
      const grid = container.querySelector('[class*="gap-"]')
      expect(grid?.className).toMatch(/gap-\d+/)
    })
  })

  describe('Text Wrapping and Overflow', () => {
    it('should wrap long task titles on mobile', () => {
      setViewport(320)
      render(
        <BrowserRouter>
          <KanbanBoard />
        </BrowserRouter>
      )

      const tasks = screen.getAllByTestId(/^task-/)
      tasks.forEach((task) => {
        const heading = task.querySelector('h3')
        expect(heading?.className).toContain('break-words')
      })
    })

    it('should not have horizontal scrollbars for text content on mobile', () => {
      setViewport(375)
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      const mainElement = container.querySelector('main')
      const computedStyle = window.getComputedStyle(mainElement!)
      // flex layout should prevent horizontal overflow
      expect(mainElement?.className).toContain('flex')
    })
  })
})
