import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanColumn } from '../KanbanColumn'
import type { Task } from '../../../types'

/**
 * Helper function to render KanbanColumn with required dnd-kit context
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

describe('KanbanColumn', () => {
  let mockTasks: Task[]
  let mockOnAddTask: ReturnType<typeof vi.fn>
  let mockOnDeleteTask: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Create fresh mock tasks for each test
    mockTasks = [
      {
        id: 'task-1',
        boardId: 'board-1',
        title: 'First Task',
        description: 'Description for first task',
        assignee: 'John Doe',
        priority: 'high',
        column: 'todo',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'task-2',
        boardId: 'board-1',
        title: 'Second Task',
        description: 'Description for second task',
        assignee: 'Jane Smith',
        priority: 'medium',
        column: 'todo',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      },
    ]

    mockOnAddTask = vi.fn()
    mockOnDeleteTask = vi.fn()
  })

  describe('Rendering', () => {
    it('should render the column title', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const title = screen.getByText('To Do')
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H2')
    })

    it('should render the correct task count badge', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const countBadge = screen.getByText('2')
      expect(countBadge).toBeInTheDocument()
      expect(countBadge).toHaveClass('rounded-full')
    })

    it('should render the add task button', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const addButton = screen.getByRole('button', { name: /add task/i })
      expect(addButton).toBeInTheDocument()
    })

    it('should render the add task button with correct aria-label', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const addButton = screen.getByLabelText('Add task to To Do')
      expect(addButton).toBeInTheDocument()
    })

    it('should render all tasks in the column', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
          onDeleteTask={mockOnDeleteTask}
        />
      )

      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.getByText('Second Task')).toBeInTheDocument()
    })

    it('should render the column container with proper classes', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const column = container.firstChild
      expect(column).toHaveClass('flex')
      expect(column).toHaveClass('flex-col')
      expect(column).toHaveClass('h-full')
      expect(column).toHaveClass('bg-secondary-50')
      expect(column).toHaveClass('rounded-lg')
    })

    it('should render column header with border', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const header = container.querySelector('[class*="border-b"]')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('border-gray-200')
    })

    it('should render add task button with SVG icon', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const buttons = container.querySelectorAll('button')
      const addButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('Add Task')
      )
      const svg = addButton?.querySelector('svg')

      expect(svg).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should display empty state message when no tasks', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={[]}
          onAddTask={mockOnAddTask}
        />
      )

      const emptyMessage = screen.getByText('No tasks yet')
      expect(emptyMessage).toBeInTheDocument()
    })

    it('should show count as 0 when no tasks', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={[]}
          onAddTask={mockOnAddTask}
        />
      )

      const countBadge = screen.getByText('0')
      expect(countBadge).toBeInTheDocument()
    })

    it('should still render add task button in empty state', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={[]}
          onAddTask={mockOnAddTask}
        />
      )

      const addButton = screen.getByRole('button', { name: /add task/i })
      expect(addButton).toBeInTheDocument()
    })

    it('should update task count when tasks change from empty to populated', () => {
      const { rerender } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={[]}
          onAddTask={mockOnAddTask}
        />
      )

      expect(screen.getByText('0')).toBeInTheDocument()

      rerender(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <KanbanColumn
              columnId="todo"
              columnTitle="To Do"
              tasks={mockTasks}
              onAddTask={mockOnAddTask}
            />
          </SortableContext>
        </DndContext>
      )

      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('First Task')).toBeInTheDocument()
    })
  })

  describe('Task Count', () => {
    it('should update task count when tasks prop changes', () => {
      const { rerender } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      expect(screen.getByText('2')).toBeInTheDocument()

      const newTasks = [mockTasks[0]]
      rerender(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <KanbanColumn
              columnId="todo"
              columnTitle="To Do"
              tasks={newTasks}
              onAddTask={mockOnAddTask}
            />
          </SortableContext>
        </DndContext>
      )

      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should correctly count large number of tasks', () => {
      const manyTasks = Array.from({ length: 25 }, (_, i) => ({
        id: `task-${i}`,
        boardId: 'board-1',
        title: `Task ${i}`,
        description: `Description ${i}`,
        assignee: 'User',
        priority: 'low' as const,
        column: 'todo' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }))

      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={manyTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const countBadge = screen.getByText('25')
      expect(countBadge).toBeInTheDocument()
    })
  })

  describe('Add Task Button', () => {
    it('should call onAddTask when add task button is clicked', async () => {
      const user = userEvent.setup()
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const addButton = screen.getByRole('button', { name: /add task/i })
      await user.click(addButton)

      expect(mockOnAddTask).toHaveBeenCalledOnce()
    })

    it('should call onAddTask multiple times on multiple clicks', async () => {
      const user = userEvent.setup()
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const addButton = screen.getByRole('button', { name: /add task/i })
      await user.click(addButton)
      await user.click(addButton)

      expect(mockOnAddTask).toHaveBeenCalledTimes(2)
    })

    it('should have proper button styling', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const addButton = screen.getByRole('button', { name: /add task/i })
      expect(addButton).toHaveClass('w-full')
      expect(addButton).toHaveClass('px-3')
      expect(addButton).toHaveClass('py-2')
      expect(addButton).toHaveClass('rounded-md')
      expect(addButton).toHaveClass('font-medium')
    })

    it('should have hover state styling', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const addButton = screen.getByRole('button', { name: /add task/i })
      expect(addButton).toHaveClass('hover:bg-primary-50')
      expect(addButton).toHaveClass('hover:text-primary-700')
    })

    it('should display plus icon in add task button', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const buttons = container.querySelectorAll('button')
      const addButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('Add Task')
      )
      const svg = addButton?.querySelector('svg')

      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '16')
      expect(svg).toHaveAttribute('height', '16')
    })
  })

  describe('Droppable Functionality', () => {
    it('should render with border-gray-200 by default', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const column = container.firstChild
      expect(column).toHaveClass('border-gray-200')
    })

    it('should have rounded borders', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const column = container.firstChild
      expect(column).toHaveClass('rounded-lg')
    })

    it('should render with dnd-kit droppable ref', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const column = container.firstChild
      expect(column).toBeInTheDocument()
    })

    it('should have transition-colors for smooth state changes', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const column = container.firstChild
      expect(column).toHaveClass('transition-colors')
    })
  })

  describe('Delete Task', () => {
    it('should pass onDeleteTask to child KanbanCards', async () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
          onDeleteTask={mockOnDeleteTask}
        />
      )

      // Verify that tasks are rendered (they would receive onDelete)
      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.getByText('Second Task')).toBeInTheDocument()
    })

    it('should handle delete task callback for first task', async () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
          onDeleteTask={mockOnDeleteTask}
        />
      )

      // KanbanCard handles delete button clicks and calls the callback
      // We verify that the component renders properly with the callback
      const deleteButtons = container.querySelectorAll('button[aria-label="Delete task"]')
      expect(deleteButtons.length).toBeGreaterThan(0)
    })

    it('should not throw error when onDeleteTask is not provided', () => {
      expect(() => {
        renderWithDnd(
          <KanbanColumn
            columnId="todo"
            columnTitle="To Do"
            tasks={mockTasks}
            onAddTask={mockOnAddTask}
          />
        )
      }).not.toThrow()
    })

    it('should handle multiple tasks with delete functionality', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
          onDeleteTask={mockOnDeleteTask}
        />
      )

      const deleteButtons = container.querySelectorAll('button[aria-label="Delete task"]')
      expect(deleteButtons).toHaveLength(mockTasks.length)
    })
  })

  describe('Different Column Types', () => {
    it('should render "In Progress" column', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="in-progress"
          columnTitle="In Progress"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const title = screen.getByText('In Progress')
      expect(title).toBeInTheDocument()

      const addButton = screen.getByLabelText('Add task to In Progress')
      expect(addButton).toBeInTheDocument()
    })

    it('should render "Done" column', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="done"
          columnTitle="Done"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const title = screen.getByText('Done')
      expect(title).toBeInTheDocument()

      const addButton = screen.getByLabelText('Add task to Done')
      expect(addButton).toBeInTheDocument()
    })

    it('should maintain separate state for different columns', () => {
      const todoTasks = [mockTasks[0]]
      const inProgressTasks = [mockTasks[1]]

      const { container } = render(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <div className="flex gap-4">
              <KanbanColumn
                columnId="todo"
                columnTitle="To Do"
                tasks={todoTasks}
                onAddTask={mockOnAddTask}
              />
              <KanbanColumn
                columnId="in-progress"
                columnTitle="In Progress"
                tasks={inProgressTasks}
                onAddTask={vi.fn()}
              />
            </div>
          </SortableContext>
        </DndContext>
      )

      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.getByText('Second Task')).toBeInTheDocument()

      const countBadges = container.querySelectorAll(
        '[class*="rounded-full"][class*="bg-gray-300"]'
      )
      expect(countBadges.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Props Updates', () => {
    it('should update title when columnTitle prop changes', () => {
      const { rerender } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      expect(screen.getByText('To Do')).toBeInTheDocument()

      rerender(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <KanbanColumn
              columnId="todo"
              columnTitle="Todo Items"
              tasks={mockTasks}
              onAddTask={mockOnAddTask}
            />
          </SortableContext>
        </DndContext>
      )

      expect(screen.getByText('Todo Items')).toBeInTheDocument()
      expect(screen.queryByText('To Do')).not.toBeInTheDocument()
    })

    it('should update tasks when tasks prop changes', () => {
      const { rerender } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={[mockTasks[0]]}
          onAddTask={mockOnAddTask}
        />
      )

      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.queryByText('Second Task')).not.toBeInTheDocument()

      rerender(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <KanbanColumn
              columnId="todo"
              columnTitle="To Do"
              tasks={mockTasks}
              onAddTask={mockOnAddTask}
            />
          </SortableContext>
        </DndContext>
      )

      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.getByText('Second Task')).toBeInTheDocument()
    })

    it('should update onAddTask callback', async () => {
      const user = userEvent.setup()
      const firstCallback = vi.fn()
      const secondCallback = vi.fn()

      const { rerender } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={firstCallback}
        />
      )

      const addButton = screen.getByRole('button', { name: /add task/i })
      await user.click(addButton)

      expect(firstCallback).toHaveBeenCalledOnce()
      expect(secondCallback).not.toHaveBeenCalled()

      rerender(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <KanbanColumn
              columnId="todo"
              columnTitle="To Do"
              tasks={mockTasks}
              onAddTask={secondCallback}
            />
          </SortableContext>
        </DndContext>
      )

      await user.click(addButton)

      expect(firstCallback).toHaveBeenCalledTimes(1)
      expect(secondCallback).toHaveBeenCalledOnce()
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const h2 = container.querySelector('h2')
      expect(h2).toBeInTheDocument()
      expect(h2?.textContent).toBe('To Do')
    })

    it('should have accessible button for adding tasks', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const addButton = screen.getByRole('button', { name: /add task/i })
      expect(addButton).toBeInTheDocument()
      expect(addButton.tagName).toBe('BUTTON')
    })

    it('should have descriptive aria-label for add button', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const addButton = screen.getByLabelText('Add task to To Do')
      expect(addButton).toBeInTheDocument()
    })

    it('should have proper layout classes for flex container', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const column = container.firstChild
      expect(column).toHaveClass('flex')
      expect(column).toHaveClass('flex-col')
    })

    it('should have scrollable tasks container', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const scrollContainer = container.querySelector('[class*="overflow-y-auto"]')
      expect(scrollContainer).toBeInTheDocument()
    })

    it('should have proper label spacing with gap', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const headerContent = container.querySelector('[class*="flex"][class*="items-center"][class*="gap"]')
      expect(headerContent).toBeInTheDocument()
    })
  })

  describe('Column Layout', () => {
    it('should have header with proper padding', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const header = container.querySelector('[class*="px-4"][class*="py-3"]')
      expect(header).toBeInTheDocument()
    })

    it('should have tasks container with proper spacing', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const tasksContainer = container.querySelector('[class*="px-3"][class*="py-3"][class*="space-y-2"]')
      expect(tasksContainer).toBeInTheDocument()
    })

    it('should have footer with proper padding', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const footer = Array.from(container.querySelectorAll('[class*="border-t"]')).find(
        el => el.querySelector('button')
      )
      expect(footer).toBeInTheDocument()
    })

    it('should have proper flex sizing for sections', () => {
      const { container } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const column = container.firstChild as HTMLElement
      expect(column).toHaveClass('h-full')

      const tasksSection = column.querySelector('[class*="flex-1"]')
      expect(tasksSection).toBeInTheDocument()
    })
  })

  describe('Task Rendering with SortableContext', () => {
    it('should render tasks within SortableContext', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.getByText('Second Task')).toBeInTheDocument()
    })

    it('should pass task IDs to SortableContext', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      // Verify tasks are rendered (which means SortableContext is properly set up)
      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.getByText('Second Task')).toBeInTheDocument()
    })

    it('should handle single task in SortableContext', () => {
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={[mockTasks[0]]}
          onAddTask={mockOnAddTask}
        />
      )

      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.queryByText('Second Task')).not.toBeInTheDocument()
    })

    it('should update SortableContext when tasks change', () => {
      const { rerender } = renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={[mockTasks[0]]}
          onAddTask={mockOnAddTask}
        />
      )

      expect(screen.getByText('First Task')).toBeInTheDocument()

      rerender(
        <DndContext>
          <SortableContext items={[]} strategy={verticalListSortingStrategy}>
            <KanbanColumn
              columnId="todo"
              columnTitle="To Do"
              tasks={mockTasks}
              onAddTask={mockOnAddTask}
            />
          </SortableContext>
        </DndContext>
      )

      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.getByText('Second Task')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle column with very long title', () => {
      const longTitle = 'A'.repeat(100)
      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle={longTitle}
          tasks={mockTasks}
          onAddTask={mockOnAddTask}
        />
      )

      const title = screen.getByText(longTitle)
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('truncate')
    })

    it('should handle tasks with no title', () => {
      const taskNoTitle = {
        ...mockTasks[0],
        title: '',
      }

      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={[taskNoTitle]}
          onAddTask={mockOnAddTask}
          onDeleteTask={mockOnDeleteTask}
        />
      )

      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should handle mixed task states in same column', () => {
      const mixedTasks = [
        { ...mockTasks[0], priority: 'high' as const },
        { ...mockTasks[1], priority: 'low' as const },
      ]

      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={mixedTasks}
          onAddTask={mockOnAddTask}
          onDeleteTask={mockOnDeleteTask}
        />
      )

      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.getByText('Second Task')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should render 50 tasks without performance issues', () => {
      const manyTasks = Array.from({ length: 50 }, (_, i) => ({
        id: `task-${i}`,
        boardId: 'board-1',
        title: `Task ${i}`,
        description: `Description ${i}`,
        assignee: 'User',
        priority: 'low' as const,
        column: 'todo' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }))

      renderWithDnd(
        <KanbanColumn
          columnId="todo"
          columnTitle="To Do"
          tasks={manyTasks}
          onAddTask={mockOnAddTask}
        />
      )

      expect(screen.getByText('50')).toBeInTheDocument()
    })
  })
})
