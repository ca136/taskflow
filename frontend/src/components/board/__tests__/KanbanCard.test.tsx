import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from '../KanbanCard'
import type { Task } from '../../../types'

/**
 * Helper function to render KanbanCard with required dnd-kit context
 */
const renderWithDnd = (component: React.ReactElement) => {
  return render(
    <DndContext>
      <SortableContext items={[]} strategy={verticalListSortingStrategy}>
        {component}
      </SortableContext>
    </DndContext>
  )
}

describe('KanbanCard', () => {
  let mockTask: Task
  let mockOnDelete: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Create a fresh mock task for each test
    mockTask = {
      id: 'task-1',
      boardId: 'board-1',
      title: 'Test Task',
      description: 'This is a test task description',
      assignee: 'John Doe',
      priority: 'medium',
      column: 'todo',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }

    mockOnDelete = vi.fn()
  })

  describe('Rendering', () => {
    it('should render the task title', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const title = screen.getByText('Test Task')
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H3')
    })

    it('should render the task description when provided', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const description = screen.getByText('This is a test task description')
      expect(description).toBeInTheDocument()
    })

    it('should not render description when not provided', () => {
      const taskWithoutDescription = { ...mockTask, description: undefined }
      renderWithDnd(<KanbanCard task={taskWithoutDescription} />)
      
      expect(screen.queryByText('This is a test task description')).not.toBeInTheDocument()
    })

    it('should render the priority badge with correct text', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const priorityBadge = screen.getByText('Medium')
      expect(priorityBadge).toBeInTheDocument()
    })

    it('should render priority badge for low priority', () => {
      const lowPriorityTask = { ...mockTask, priority: 'low' as const }
      renderWithDnd(<KanbanCard task={lowPriorityTask} />)
      
      const priorityBadge = screen.getByText('Low')
      expect(priorityBadge).toBeInTheDocument()
    })

    it('should render priority badge for high priority', () => {
      const highPriorityTask = { ...mockTask, priority: 'high' as const }
      renderWithDnd(<KanbanCard task={highPriorityTask} />)
      
      const priorityBadge = screen.getByText('High')
      expect(priorityBadge).toBeInTheDocument()
    })

    it('should render the assignee when provided', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const assignee = screen.getByText('John Doe')
      expect(assignee).toBeInTheDocument()
    })

    it('should not render assignee section when not provided', () => {
      const taskWithoutAssignee = { ...mockTask, assignee: undefined }
      renderWithDnd(<KanbanCard task={taskWithoutAssignee} />)
      
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })

    it('should render delete button with proper aria-label', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const deleteButton = screen.getByLabelText('Delete task')
      expect(deleteButton).toBeInTheDocument()
    })

    it('should have delete button with title attribute', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const deleteButton = screen.getByLabelText('Delete task')
      expect(deleteButton).toHaveAttribute('title', 'Delete task')
    })

    it('should render the card container with proper classes', () => {
      const { container } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      const cardDiv = container.querySelector('[class*="rounded-lg"]')
      expect(cardDiv).toBeInTheDocument()
      expect(cardDiv).toHaveClass('shadow-md')
    })
  })

  describe('Delete Functionality', () => {
    it('should call onDelete with correct task id when delete button is clicked', async () => {
      const user = userEvent.setup()
      renderWithDnd(<KanbanCard task={mockTask} onDelete={mockOnDelete} />)
      
      const deleteButton = screen.getByLabelText('Delete task')
      // Fire click event directly to ensure it triggers
      deleteButton.click()
      
      expect(mockOnDelete).toHaveBeenCalledOnce()
      expect(mockOnDelete).toHaveBeenCalledWith('task-1')
    })

    it('should not call onDelete if callback is not provided', async () => {
      const user = userEvent.setup()
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const deleteButton = screen.getByLabelText('Delete task')
      // Should not throw error
      deleteButton.click()
    })

    it('should stop event propagation when delete button is clicked', async () => {
      const handlePropagation = vi.fn()
      renderWithDnd(
        <div onClick={handlePropagation}>
          <KanbanCard task={mockTask} onDelete={mockOnDelete} />
        </div>
      )
      
      const deleteButton = screen.getByLabelText('Delete task')
      deleteButton.click()
      
      // Propagation should be stopped in handleDelete, so parent click handler
      // should not be called for the delete button click
      expect(handlePropagation).not.toHaveBeenCalled()
    })

    it('should call onDelete only once when delete button is clicked', async () => {
      renderWithDnd(<KanbanCard task={mockTask} onDelete={mockOnDelete} />)
      
      const deleteButton = screen.getByLabelText('Delete task')
      deleteButton.click()
      
      expect(mockOnDelete).toHaveBeenCalledTimes(1)
    })

    it('should handle delete with different task IDs', () => {
      const task2 = { ...mockTask, id: 'task-xyz-123' }
      const onDelete2 = vi.fn()
      renderWithDnd(<KanbanCard task={task2} onDelete={onDelete2} />)
      
      const deleteButton = screen.getByLabelText('Delete task')
      deleteButton.click()
      
      expect(onDelete2).toHaveBeenCalledWith('task-xyz-123')
    })
  })

  describe('Drag Functionality', () => {
    it('should have grabbable cursor by default', () => {
      const { container } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      const cardDiv = container.firstChild
      expect(cardDiv).toHaveClass('cursor-grab')
    })

    it('should have grabbing cursor when dragging', () => {
      const { container } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      const cardDiv = container.firstChild
      expect(cardDiv).toHaveClass('active:cursor-grabbing')
    })

    it('should render with drag attributes from useSortable hook', () => {
      const { container } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      const cardDiv = container.firstChild as HTMLElement
      // The div should be renderable and properly attached to the DOM
      expect(cardDiv).toBeInTheDocument()
    })
  })

  describe('Priority Badge Styling', () => {
    it('should apply low priority colors', () => {
      const lowPriorityTask = { ...mockTask, priority: 'low' as const }
      renderWithDnd(<KanbanCard task={lowPriorityTask} />)
      
      const badge = screen.getByText('Low')
      expect(badge).toHaveClass('bg-blue-100')
      expect(badge).toHaveClass('text-blue-800')
    })

    it('should apply medium priority colors', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const badge = screen.getByText('Medium')
      expect(badge).toHaveClass('bg-yellow-100')
      expect(badge).toHaveClass('text-yellow-800')
    })

    it('should apply high priority colors', () => {
      const highPriorityTask = { ...mockTask, priority: 'high' as const }
      renderWithDnd(<KanbanCard task={highPriorityTask} />)
      
      const badge = screen.getByText('High')
      expect(badge).toHaveClass('bg-red-100')
      expect(badge).toHaveClass('text-red-800')
    })

    it('should fallback to low priority colors for unknown priority', () => {
      const taskWithUnknownPriority = {
        ...mockTask,
        priority: 'unknown' as any,
      }
      const { container } = renderWithDnd(
        <KanbanCard task={taskWithUnknownPriority} />
      )
      
      const badge = container.querySelector('[class*="bg-blue-100"]')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Delete Button Interactivity', () => {
    it('should show delete icon SVG', () => {
      const { container } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      const svgElement = container.querySelector('svg')
      expect(svgElement).toBeInTheDocument()
      expect(svgElement?.getAttribute('width')).toBe('16')
      expect(svgElement?.getAttribute('height')).toBe('16')
    })

    it('should have hover state on delete button', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const deleteButton = screen.getByLabelText('Delete task')
      expect(deleteButton).toHaveClass('hover:text-red-600')
    })

    it('should render delete SVG with correct stroke attributes', () => {
      const { container } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      const svgElement = container.querySelector('svg')
      expect(svgElement).toHaveAttribute('stroke', 'currentColor')
      expect(svgElement).toHaveAttribute('stroke-width', '2')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long task titles', () => {
      const longTitle = 'A'.repeat(200)
      const taskWithLongTitle = { ...mockTask, title: longTitle }
      renderWithDnd(<KanbanCard task={taskWithLongTitle} />)
      
      const title = screen.getByText(longTitle)
      expect(title).toBeInTheDocument()
    })

    it('should handle very long descriptions', () => {
      const longDescription = 'This is a very long description. '.repeat(20)
      const taskWithLongDescription = {
        ...mockTask,
        description: longDescription,
      }
      renderWithDnd(<KanbanCard task={taskWithLongDescription} />)
      
      // Should render the text (may be truncated with line-clamp-2)
      expect(screen.getByText(new RegExp(longDescription.substring(0, 30)))).toBeInTheDocument()
    })

    it('should handle tasks with empty strings', () => {
      const taskWithEmpty = {
        ...mockTask,
        title: '',
        description: '',
        assignee: '',
      }
      renderWithDnd(<KanbanCard task={taskWithEmpty} />)
      
      expect(screen.getByLabelText('Delete task')).toBeInTheDocument()
    })

    it('should handle null/undefined optional fields', () => {
      const minimalTask = {
        id: 'task-minimal',
        boardId: 'board-1',
        title: 'Minimal Task',
        description: undefined,
        assignee: undefined,
        priority: 'low' as const,
        column: 'todo' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }
      renderWithDnd(<KanbanCard task={minimalTask} />)
      
      expect(screen.getByText('Minimal Task')).toBeInTheDocument()
      expect(screen.getByText('Low')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      const h3 = container.querySelector('h3')
      expect(h3).toBeInTheDocument()
      expect(h3?.textContent).toBe('Test Task')
    })

    it('should have proper button semantics on delete button', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const deleteButton = screen.getByRole('button', { name: /delete task/i })
      expect(deleteButton).toBeInTheDocument()
      expect(deleteButton.tagName).toBe('BUTTON')
    })

    it('should have descriptive aria-label on delete button', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const deleteButton = screen.getByLabelText(/delete task/i)
      expect(deleteButton).toBeInTheDocument()
    })

    it('should have proper title attribute for tooltip', () => {
      renderWithDnd(<KanbanCard task={mockTask} />)
      
      const deleteButton = screen.getByLabelText('Delete task')
      expect(deleteButton).toHaveAttribute('title')
      expect(deleteButton.getAttribute('title')).toBe('Delete task')
    })

    it('should have flex layout classes on header', () => {
      const { container } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      const header = container.querySelector('.flex.items-start')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Multiple Cards Rendering', () => {
    it('should render multiple cards without interference', () => {
      const task2 = { ...mockTask, id: 'task-2', title: 'Task 2' }
      const task3 = { ...mockTask, id: 'task-3', title: 'Task 3' }
      
      const onDelete1 = vi.fn()
      const onDelete2 = vi.fn()
      const onDelete3 = vi.fn()

      render(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <div>
              <KanbanCard task={mockTask} onDelete={onDelete1} />
              <KanbanCard task={task2} onDelete={onDelete2} />
              <KanbanCard task={task3} onDelete={onDelete3} />
            </div>
          </SortableContext>
        </DndContext>
      )
      
      expect(screen.getByText('Test Task')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
      expect(screen.getByText('Task 3')).toBeInTheDocument()
      
      const deleteButtons = screen.getAllByLabelText('Delete task')
      expect(deleteButtons).toHaveLength(3)
    })

    it('should call correct onDelete for each card', () => {
      const task2 = { ...mockTask, id: 'task-2', title: 'Task 2' }
      const onDelete1 = vi.fn()
      const onDelete2 = vi.fn()

      renderWithDnd(
        <>
          <KanbanCard task={mockTask} onDelete={onDelete1} />
          <KanbanCard task={task2} onDelete={onDelete2} />
        </>
      )
      
      const deleteButtons = screen.getAllByLabelText('Delete task')
      deleteButtons[0].click()
      
      expect(onDelete1).toHaveBeenCalledWith('task-1')
      expect(onDelete2).not.toHaveBeenCalled()
    })
  })

  describe('Props Updates', () => {
    it('should update when task prop changes', () => {
      const { rerender } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      expect(screen.getByText('Test Task')).toBeInTheDocument()
      
      const updatedTask = { ...mockTask, title: 'Updated Task' }
      rerender(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <KanbanCard task={updatedTask} />
          </SortableContext>
        </DndContext>
      )
      
      expect(screen.getByText('Updated Task')).toBeInTheDocument()
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument()
    })

    it('should update description when task prop changes', () => {
      const { rerender } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      expect(screen.getByText('This is a test task description')).toBeInTheDocument()
      
      const updatedTask = { ...mockTask, description: 'Updated description' }
      rerender(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <KanbanCard task={updatedTask} />
          </SortableContext>
        </DndContext>
      )
      
      expect(screen.getByText('Updated description')).toBeInTheDocument()
      expect(screen.queryByText('This is a test task description')).not.toBeInTheDocument()
    })

    it('should update priority badge when task prop changes', () => {
      const { rerender } = renderWithDnd(<KanbanCard task={mockTask} />)
      
      expect(screen.getByText('Medium')).toBeInTheDocument()
      
      const updatedTask = { ...mockTask, priority: 'high' as const }
      rerender(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <KanbanCard task={updatedTask} />
          </SortableContext>
        </DndContext>
      )
      
      expect(screen.getByText('High')).toBeInTheDocument()
      expect(screen.queryByText('Medium')).not.toBeInTheDocument()
    })
  })
})
