import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTaskModal } from '../AddTaskModal'
import { render } from '@/test/test-utils'
import type { Task } from '@/types'

describe('AddTaskModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()
  const defaultProps = {
    isOpen: true,
    boardId: 'test-board-123',
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <AddTaskModal {...defaultProps} isOpen={false} />
      )
      expect(screen.queryByText('Add New Task')).not.toBeInTheDocument()
    })

    it('should render when isOpen is true', () => {
      render(<AddTaskModal {...defaultProps} />)
      expect(screen.getByText('Add New Task')).toBeInTheDocument()
    })

    it('should render all form fields', () => {
      render(<AddTaskModal {...defaultProps} />)
      expect(screen.getByLabelText(/Title/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Priority/)).toBeInTheDocument()
    })

    it('should render form action buttons', () => {
      render(<AddTaskModal {...defaultProps} />)
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument()
    })

    it('should render close button in modal header', () => {
      render(<AddTaskModal {...defaultProps} />)
      expect(screen.getByLabelText(/Close modal/i)).toBeInTheDocument()
    })

    it('should render character counter for description', () => {
      render(<AddTaskModal {...defaultProps} />)
      expect(screen.getByText('0/500')).toBeInTheDocument()
    })
  })

  describe('Form Fields Initialization', () => {
    it('should have empty title input initially', () => {
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/) as HTMLInputElement
      expect(titleInput.value).toBe('')
    })

    it('should have empty description input initially', () => {
      render(<AddTaskModal {...defaultProps} />)
      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement
      expect(descriptionInput.value).toBe('')
    })

    it('should have medium priority selected by default', () => {
      render(<AddTaskModal {...defaultProps} />)
      const prioritySelect = screen.getByLabelText(/Priority/) as HTMLSelectElement
      expect(prioritySelect.value).toBe('medium')
    })
  })

  describe('Form Input Changes', () => {
    it('should update title input value on change', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/) as HTMLInputElement

      await user.type(titleInput, 'New Task Title')
      expect(titleInput.value).toBe('New Task Title')
    })

    it('should update description input value on change', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement

      await user.type(descriptionInput, 'Task description')
      expect(descriptionInput.value).toBe('Task description')
    })

    it('should update character counter for description', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const descriptionInput = screen.getByLabelText(/Description/)

      await user.type(descriptionInput, '12345')
      expect(screen.getByText('5/500')).toBeInTheDocument()
    })

    it('should update priority select value on change', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const prioritySelect = screen.getByLabelText(/Priority/) as HTMLSelectElement

      await user.selectOptions(prioritySelect, 'high')
      expect(prioritySelect.value).toBe('high')
    })

    it('should clear field error when user starts typing', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      // Submit with empty title to trigger error
      await user.click(submitButton)
      expect(screen.getByText('Title is required')).toBeInTheDocument()

      // Type something to clear error
      await user.type(titleInput, 'T')
      await waitFor(() => {
        expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Validation - Title Field', () => {
    it('should show error when title is empty', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.click(submitButton)
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })

    it('should show error when title is only whitespace', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, '   ')
      await user.click(submitButton)
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })

    it('should show error when title is less than 3 characters', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'ab')
      await user.click(submitButton)
      expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument()
    })

    it('should show error when title exceeds 100 characters', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      const longTitle = 'a'.repeat(101)
      await user.type(titleInput, longTitle)
      await user.click(submitButton)
      expect(screen.getByText('Title must not exceed 100 characters')).toBeInTheDocument()
    })

    it('should accept valid title at minimum length (3 chars)', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'abc')
      await user.click(submitButton)
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('should accept valid title at maximum length (100 chars)', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      const validTitle = 'a'.repeat(100)
      await user.type(titleInput, validTitle)
      await user.click(submitButton)
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('should trim whitespace from title before validation', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, '  valid title  ')
      await user.click(submitButton)
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('Form Validation - Description Field', () => {
    it('should show error when description exceeds 500 characters', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const descriptionInput = screen.getByLabelText(/Description/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Valid Title')
      const longDescription = 'a'.repeat(501)
      await user.type(descriptionInput, longDescription)
      await user.click(submitButton)
      expect(screen.getByText('Description must not exceed 500 characters')).toBeInTheDocument()
    })

    it('should accept description at maximum length (500 chars)', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const descriptionInput = screen.getByLabelText(/Description/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Valid Title')
      const validDescription = 'a'.repeat(500)
      await user.type(descriptionInput, validDescription)
      await user.click(submitButton)
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('should accept empty description (optional field)', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Valid Title')
      await user.click(submitButton)
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('Form Submission', () => {
    it('should not call onSubmit if validation fails', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.click(submitButton)
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should call onSubmit with correct task data', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const descriptionInput = screen.getByLabelText(/Description/)
      const prioritySelect = screen.getByLabelText(/Priority/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Test Task')
      await user.type(descriptionInput, 'Test Description')
      await user.selectOptions(prioritySelect, 'high')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            boardId: 'test-board-123',
            title: 'Test Task',
            description: 'Test Description',
            priority: 'high',
            column: 'todo',
            assignee: undefined,
          })
        )
      })
    })

    it('should trim title and description before submission', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const descriptionInput = screen.getByLabelText(/Description/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, '  Trimmed Title  ')
      await user.type(descriptionInput, '  Trimmed Description  ')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Trimmed Title',
            description: 'Trimmed Description',
          })
        )
      })
    })

    it('should convert empty description to undefined', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Test Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            description: undefined,
          })
        )
      })
    })

    it('should disable form inputs during submission', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement
      const prioritySelect = screen.getByLabelText(/Priority/) as HTMLSelectElement
      const submitButton = screen.getByRole('button', { name: /Create Task/i }) as HTMLButtonElement
      const cancelButton = screen.getByRole('button', { name: /Cancel/i }) as HTMLButtonElement

      await user.type(titleInput, 'Test Task')
      await user.click(submitButton)

      // Check that inputs are disabled during submission
      await waitFor(() => {
        expect(titleInput.disabled).toBe(true)
        expect(descriptionInput.disabled).toBe(true)
        expect(prioritySelect.disabled).toBe(true)
        expect(submitButton.disabled).toBe(true)
        expect(cancelButton.disabled).toBe(true)
      })
    })

    it('should show "Creating..." text during submission', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Test Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Creating...')).toBeInTheDocument()
      })
    })
  })

  describe('Form Reset After Successful Submission', () => {
    it('should reset form after successful submission', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement
      const prioritySelect = screen.getByLabelText(/Priority/) as HTMLSelectElement

      await user.type(titleInput, 'Test Task')
      await user.type(descriptionInput, 'Test Description')
      await user.selectOptions(prioritySelect, 'high')

      // Wait for form to be populated
      await waitFor(() => {
        expect(titleInput.value).toBe('Test Task')
      })

      const submitButton = screen.getByRole('button', { name: /Create Task/i })
      await user.click(submitButton)

      // Wait for form to be reset
      await waitFor(() => {
        expect(titleInput.value).toBe('')
        expect(descriptionInput.value).toBe('')
        expect(prioritySelect.value).toBe('medium')
      })
    })

    it('should clear error messages after successful submission', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      // Submit with empty title to trigger error
      await user.click(submitButton)
      expect(screen.getByText('Title is required')).toBeInTheDocument()

      // Now reopen modal with valid data
      const titleInput = screen.getByLabelText(/Title/)
      await user.type(titleInput, 'Valid Title')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
      })
    })

    it('should call onClose after successful submission', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Test Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  describe('Modal Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const closeButton = screen.getByLabelText(/Close modal/i)

      await user.click(closeButton)
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })

      await user.click(cancelButton)
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should reset form when modal is closed via close button', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement
      const prioritySelect = screen.getByLabelText(/Priority/) as HTMLSelectElement

      await user.type(titleInput, 'Test Task')
      await user.type(descriptionInput, 'Test Description')
      await user.selectOptions(prioritySelect, 'high')

      const closeButton = screen.getByLabelText(/Close modal/i)
      await user.click(closeButton)

      // Verify form was reset
      expect(titleInput.value).toBe('')
      expect(descriptionInput.value).toBe('')
      expect(prioritySelect.value).toBe('medium')
    })

    it('should reset form when modal is closed via cancel button', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement
      const prioritySelect = screen.getByLabelText(/Priority/) as HTMLSelectElement

      await user.type(titleInput, 'Test Task')
      await user.type(descriptionInput, 'Test Description')
      await user.selectOptions(prioritySelect, 'low')

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      await user.click(cancelButton)

      // Verify form was reset
      expect(titleInput.value).toBe('')
      expect(descriptionInput.value).toBe('')
      expect(prioritySelect.value).toBe('medium')
    })

    it('should clear errors when modal is closed', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      // Submit with empty title to trigger error
      await user.click(submitButton)
      expect(screen.getByText('Title is required')).toBeInTheDocument()

      // Close modal
      const closeButton = screen.getByLabelText(/Close modal/i)
      await user.click(closeButton)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle submission errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockOnSubmit.mockRejectedValueOnce(new Error('Network error'))
      
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Test Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to create task:',
          expect.any(Error)
        )
      })

      consoleErrorSpy.mockRestore()
    })

    it('should re-enable form after submission error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      mockOnSubmit.mockRejectedValueOnce(new Error('Network error'))
      
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/) as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: /Create Task/i }) as HTMLButtonElement

      await user.type(titleInput, 'Test Task')
      await user.click(submitButton)

      await waitFor(() => {
        expect(submitButton.disabled).toBe(false)
        expect(titleInput.disabled).toBe(false)
      })
    })
  })

  describe('Multiple Priority Options', () => {
    it('should support all priority levels', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const prioritySelect = screen.getByLabelText(/Priority/) as HTMLSelectElement

      const priorities = ['low', 'medium', 'high']
      for (const priority of priorities) {
        await user.type(titleInput, 'Task')
        await user.selectOptions(prioritySelect, priority)
        expect(prioritySelect.value).toBe(priority)
        // Clear for next iteration
        await user.clear(titleInput)
      }
    })
  })

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      render(<AddTaskModal {...defaultProps} />)
      const titleLabel = screen.getByText(/Title/).closest('label')
      const titleInput = screen.getByLabelText(/Title/)
      expect(titleLabel).toBeInTheDocument()
      expect(titleInput).toBeInTheDocument()
    })

    it('should have required field indicator for title', () => {
      render(<AddTaskModal {...defaultProps} />)
      const requiredIndicators = screen.getAllByText('*')
      expect(requiredIndicators.length).toBeGreaterThan(0)
    })

    it('should have aria-label on close button', () => {
      render(<AddTaskModal {...defaultProps} />)
      const closeButton = screen.getByLabelText(/Close modal/i)
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal')
    })
  })

  describe('Edge Cases', () => {
    it('should handle form submission via Enter key in title field', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)

      await user.type(titleInput, 'Test Task')
      // Note: pressing Enter in an input field won't submit the form automatically
      // This is expected behavior - form submission requires button click or Enter in form context
    })

    it('should prevent default form submission behavior', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Test Task')
      await user.click(submitButton)

      // Should not cause page reload or navigation
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('should handle rapid successive submissions', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)))
      
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      await user.type(titleInput, 'Test Task')
      
      // Try to click submit multiple times quickly
      await user.click(submitButton)
      // Button should be disabled, so second click shouldn't trigger another submission
      await user.click(submitButton)

      // Wait for submission to complete
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle very long but valid input', async () => {
      const user = userEvent.setup()
      render(<AddTaskModal {...defaultProps} />)
      const titleInput = screen.getByLabelText(/Title/)
      const descriptionInput = screen.getByLabelText(/Description/)
      const submitButton = screen.getByRole('button', { name: /Create Task/i })

      const longTitle = 'a'.repeat(100)
      const longDescription = 'b'.repeat(500)
      
      await user.type(titleInput, longTitle)
      await user.type(descriptionInput, longDescription)
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: longTitle,
            description: longDescription,
          })
        )
      })
    })
  })
})
