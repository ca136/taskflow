import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from './Counter'

describe('Counter Component', () => {
  beforeEach(() => {
    render(<Counter />)
  })

  it('should render the counter component with initial count of 0', () => {
    const countDisplay = screen.getByText('0')
    expect(countDisplay).toBeInTheDocument()
    expect(countDisplay).toHaveClass('text-6xl')
  })

  it('should display the Counter heading', () => {
    const heading = screen.getByRole('heading', { name: /counter/i })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveClass('text-3xl')
  })

  it('should render increment button with + symbol', () => {
    const incrementButton = screen.getByRole('button', { name: '+' })
    expect(incrementButton).toBeInTheDocument()
    expect(incrementButton).toHaveClass('bg-green-500')
  })

  it('should render decrement button with − symbol', () => {
    const decrementButton = screen.getByRole('button', { name: '−' })
    expect(decrementButton).toBeInTheDocument()
    expect(decrementButton).toHaveClass('bg-red-500')
  })

  it('should render reset button', () => {
    const resetButton = screen.getByRole('button', { name: /reset/i })
    expect(resetButton).toBeInTheDocument()
    expect(resetButton).toHaveClass('bg-gray-400')
  })

  describe('Increment Functionality', () => {
    it('should increment count by 1 when increment button is clicked', async () => {
      const user = userEvent.setup()
      const incrementButton = screen.getByRole('button', { name: '+' })

      await user.click(incrementButton)

      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should handle multiple increments correctly', async () => {
      const user = userEvent.setup()
      const incrementButton = screen.getByRole('button', { name: '+' })

      await user.click(incrementButton)
      expect(screen.getByText('1')).toBeInTheDocument()

      await user.click(incrementButton)
      expect(screen.getByText('2')).toBeInTheDocument()

      await user.click(incrementButton)
      expect(screen.getByText('3')).toBeInTheDocument()

      await user.click(incrementButton)
      expect(screen.getByText('4')).toBeInTheDocument()

      await user.click(incrementButton)
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('Decrement Functionality', () => {
    it('should decrement count by 1 when decrement button is clicked', async () => {
      const user = userEvent.setup()
      const decrementButton = screen.getByRole('button', { name: '−' })

      await user.click(decrementButton)

      expect(screen.getByText('-1')).toBeInTheDocument()
    })

    it('should handle multiple decrements correctly', async () => {
      const user = userEvent.setup()
      const decrementButton = screen.getByRole('button', { name: '−' })

      await user.click(decrementButton)
      expect(screen.getByText('-1')).toBeInTheDocument()

      await user.click(decrementButton)
      expect(screen.getByText('-2')).toBeInTheDocument()

      await user.click(decrementButton)
      expect(screen.getByText('-3')).toBeInTheDocument()

      await user.click(decrementButton)
      expect(screen.getByText('-4')).toBeInTheDocument()

      await user.click(decrementButton)
      expect(screen.getByText('-5')).toBeInTheDocument()
    })
  })

  describe('Mixed Operations', () => {
    it('should correctly handle mixed increment and decrement operations', async () => {
      const user = userEvent.setup()
      const incrementButton = screen.getByRole('button', { name: '+' })
      const decrementButton = screen.getByRole('button', { name: '−' })

      // Start at 0
      expect(screen.getByText('0')).toBeInTheDocument()

      // Increment to 1
      await user.click(incrementButton)
      expect(screen.getByText('1')).toBeInTheDocument()

      // Increment to 2
      await user.click(incrementButton)
      expect(screen.getByText('2')).toBeInTheDocument()

      // Decrement to 1
      await user.click(decrementButton)
      expect(screen.getByText('1')).toBeInTheDocument()

      // Increment to 2
      await user.click(incrementButton)
      expect(screen.getByText('2')).toBeInTheDocument()

      // Decrement to 1
      await user.click(decrementButton)
      expect(screen.getByText('1')).toBeInTheDocument()

      // Decrement to 0
      await user.click(decrementButton)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle rapid alternating clicks', async () => {
      const user = userEvent.setup()
      const incrementButton = screen.getByRole('button', { name: '+' })
      const decrementButton = screen.getByRole('button', { name: '−' })

      // Rapid increments
      await user.click(incrementButton)
      await user.click(incrementButton)
      await user.click(incrementButton)
      expect(screen.getByText('3')).toBeInTheDocument()

      // Rapid decrements
      await user.click(decrementButton)
      await user.click(decrementButton)
      expect(screen.getByText('1')).toBeInTheDocument()

      // Back to 0
      await user.click(decrementButton)
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('Reset Functionality', () => {
    it('should reset count to 0 after increment', async () => {
      const user = userEvent.setup()
      const incrementButton = screen.getByRole('button', { name: '+' })
      const resetButton = screen.getByRole('button', { name: /reset/i })

      await user.click(incrementButton)
      await user.click(incrementButton)
      await user.click(incrementButton)
      expect(screen.getByText('3')).toBeInTheDocument()

      await user.click(resetButton)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should reset count to 0 after decrement', async () => {
      const user = userEvent.setup()
      const decrementButton = screen.getByRole('button', { name: '−' })
      const resetButton = screen.getByRole('button', { name: /reset/i })

      await user.click(decrementButton)
      await user.click(decrementButton)
      await user.click(decrementButton)
      expect(screen.getByText('-3')).toBeInTheDocument()

      await user.click(resetButton)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should reset count to 0 after mixed operations', async () => {
      const user = userEvent.setup()
      const incrementButton = screen.getByRole('button', { name: '+' })
      const decrementButton = screen.getByRole('button', { name: '−' })
      const resetButton = screen.getByRole('button', { name: /reset/i })

      // Mixed operations
      await user.click(incrementButton)
      await user.click(incrementButton)
      await user.click(incrementButton)
      await user.click(decrementButton)
      await user.click(incrementButton)
      expect(screen.getByText('3')).toBeInTheDocument()

      await user.click(resetButton)
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('Button Interactions', () => {
    it('increment button should have correct styling', () => {
      const incrementButton = screen.getByRole('button', { name: '+' })
      expect(incrementButton).toHaveClass('bg-green-500')
      expect(incrementButton).toHaveClass('hover:bg-green-600')
      expect(incrementButton).toHaveClass('text-white')
      expect(incrementButton).toHaveClass('font-bold')
    })

    it('decrement button should have correct styling', () => {
      const decrementButton = screen.getByRole('button', { name: '−' })
      expect(decrementButton).toHaveClass('bg-red-500')
      expect(decrementButton).toHaveClass('hover:bg-red-600')
      expect(decrementButton).toHaveClass('text-white')
      expect(decrementButton).toHaveClass('font-bold')
    })

    it('reset button should have correct styling', () => {
      const resetButton = screen.getByRole('button', { name: /reset/i })
      expect(resetButton).toHaveClass('bg-gray-400')
      expect(resetButton).toHaveClass('hover:bg-gray-500')
      expect(resetButton).toHaveClass('text-white')
    })
  })

  describe('Accessibility', () => {
    it('all buttons should be keyboard accessible', async () => {
      const user = userEvent.setup()
      const incrementButton = screen.getByRole('button', { name: '+' })

      incrementButton.focus()
      expect(incrementButton).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should support tab navigation through buttons', async () => {
      const user = userEvent.setup()
      const decrementButton = screen.getByRole('button', { name: '−' })
      const incrementButton = screen.getByRole('button', { name: '+' })
      const resetButton = screen.getByRole('button', { name: /reset/i })

      // Start with decrement button focused
      decrementButton.focus()
      expect(decrementButton).toHaveFocus()

      // Tab to increment button
      await user.tab()
      expect(incrementButton).toHaveFocus()

      // Tab to reset button
      await user.tab()
      expect(resetButton).toHaveFocus()
    })
  })

  describe('State Management', () => {
    it('state should persist across multiple operations', async () => {
      const user = userEvent.setup()
      const incrementButton = screen.getByRole('button', { name: '+' })
      const decrementButton = screen.getByRole('button', { name: '−' })

      // Build up to 5
      for (let i = 0; i < 5; i++) {
        await user.click(incrementButton)
      }
      expect(screen.getByText('5')).toBeInTheDocument()

      // Go down to 2
      for (let i = 0; i < 3; i++) {
        await user.click(decrementButton)
      }
      expect(screen.getByText('2')).toBeInTheDocument()

      // Back up to 4
      for (let i = 0; i < 2; i++) {
        await user.click(incrementButton)
      }
      expect(screen.getByText('4')).toBeInTheDocument()
    })
  })
})
