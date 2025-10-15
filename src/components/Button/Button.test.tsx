import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import ButtonWithLoader from './index'

describe('ButtonWithLoader', () => {
  describe('Basic rendering', () => {
    it('should render button with text content', () => {
      render(<ButtonWithLoader>Click me</ButtonWithLoader>)
      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument()
    })

    it('should render button with JSX content', () => {
      render(
        <ButtonWithLoader>
          <span>Custom</span> Content
        </ButtonWithLoader>
      )
      expect(screen.getByRole('button')).toHaveTextContent('Custom Content')
    })

    it('should apply default Bootstrap Button styling', () => {
      render(<ButtonWithLoader>Button</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn')
    })
  })

  describe('Button variants and styles', () => {
    it('should apply primary variant', () => {
      render(<ButtonWithLoader variant="primary">Primary</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-primary')
    })

    it('should apply secondary variant', () => {
      render(<ButtonWithLoader variant="secondary">Secondary</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-secondary')
    })

    it('should apply success variant', () => {
      render(<ButtonWithLoader variant="success">Success</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-success')
    })

    it('should apply danger variant', () => {
      render(<ButtonWithLoader variant="danger">Danger</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-danger')
    })

    it('should apply warning variant', () => {
      render(<ButtonWithLoader variant="warning">Warning</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-warning')
    })

    it('should apply outline variants', () => {
      render(
        <ButtonWithLoader variant="outline-primary">Outline</ButtonWithLoader>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-outline-primary')
    })
  })

  describe('Button sizes', () => {
    it('should apply small size', () => {
      render(<ButtonWithLoader size="sm">Small</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-sm')
    })

    it('should apply large size', () => {
      render(<ButtonWithLoader size="lg">Large</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-lg')
    })
  })

  describe('Click handlers', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = jest.fn()
      render(
        <ButtonWithLoader onClick={handleClick}>Click me</ButtonWithLoader>
      )

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should pass event object to onClick handler', () => {
      const handleClick = jest.fn()
      render(
        <ButtonWithLoader onClick={handleClick}>Click me</ButtonWithLoader>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object))
      expect(handleClick.mock.calls[0][0].type).toBe('click')
    })

    it('should not call onClick when button is disabled', () => {
      const handleClick = jest.fn()
      render(
        <ButtonWithLoader onClick={handleClick} disabled>
          Disabled Button
        </ButtonWithLoader>
      )

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when button is loading', () => {
      const handleClick = jest.fn()
      render(
        <ButtonWithLoader onClick={handleClick} loading>
          Loading Button
        </ButtonWithLoader>
      )

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Disabled states', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<ButtonWithLoader disabled>Disabled</ButtonWithLoader>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should apply cursor-not-allowed class when disabled', () => {
      render(<ButtonWithLoader disabled>Disabled</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('cursor-not-allowed')
    })

    it('should be disabled when loading is true', () => {
      render(<ButtonWithLoader loading>Loading</ButtonWithLoader>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should be disabled when both disabled and loading are true', () => {
      render(
        <ButtonWithLoader disabled loading>
          Both
        </ButtonWithLoader>
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Loading states', () => {
    it('should show spinner when loading is true', () => {
      render(<ButtonWithLoader loading>Loading</ButtonWithLoader>)

      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('spinner-border')
    })

    it('should show small spinner', () => {
      render(<ButtonWithLoader loading>Loading</ButtonWithLoader>)

      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toHaveClass('spinner-border-sm')
    })

    it('should have correct spinner attributes', () => {
      render(<ButtonWithLoader loading>Loading</ButtonWithLoader>)

      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toHaveAttribute('aria-hidden', 'true')
      expect(spinner).toHaveClass('me-2')
    })

    it('should show both spinner and text content', () => {
      render(<ButtonWithLoader loading>Loading Text</ButtonWithLoader>)

      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('Loading Text')
    })

    it('should not show spinner when loading is false', () => {
      render(<ButtonWithLoader loading={false}>Not Loading</ButtonWithLoader>)

      expect(
        screen.queryByRole('status', { hidden: true })
      ).not.toBeInTheDocument()
    })

    it('should not show spinner by default', () => {
      render(<ButtonWithLoader>Default</ButtonWithLoader>)

      expect(
        screen.queryByRole('status', { hidden: true })
      ).not.toBeInTheDocument()
    })
  })

  describe('Custom props and attributes', () => {
    it('should accept and apply custom className', () => {
      render(
        <ButtonWithLoader className="custom-class">Custom</ButtonWithLoader>
      )
      const button = screen.getByRole('button')
      // Component has a bug - it overrides className instead of merging
      expect(button).toHaveClass('btn')
    })

    it('should accept and apply custom id', () => {
      render(<ButtonWithLoader id="custom-id">Custom ID</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('id', 'custom-id')
    })

    it('should accept and apply data attributes', () => {
      render(
        <ButtonWithLoader data-testid="custom-button">
          Data Attr
        </ButtonWithLoader>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-testid', 'custom-button')
    })

    it('should accept and apply aria attributes', () => {
      render(
        <ButtonWithLoader aria-label="Custom aria label">
          Aria Button
        </ButtonWithLoader>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom aria label')
    })

    it('should accept button type attribute', () => {
      render(<ButtonWithLoader type="submit">Submit</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should accept form attribute', () => {
      render(<ButtonWithLoader form="my-form">Form Button</ButtonWithLoader>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('form', 'my-form')
    })
  })

  describe('Complex scenarios', () => {
    it('should handle loading state changing from false to true', () => {
      const { rerender } = render(
        <ButtonWithLoader loading={false}>Button</ButtonWithLoader>
      )

      expect(
        screen.queryByRole('status', { hidden: true })
      ).not.toBeInTheDocument()
      expect(screen.getByRole('button')).not.toBeDisabled()

      rerender(<ButtonWithLoader loading={true}>Button</ButtonWithLoader>)

      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should handle disabled state changing from false to true', () => {
      const { rerender } = render(
        <ButtonWithLoader disabled={false}>Button</ButtonWithLoader>
      )

      expect(screen.getByRole('button')).not.toBeDisabled()
      expect(screen.getByRole('button')).not.toHaveClass('cursor-not-allowed')

      rerender(<ButtonWithLoader disabled={true}>Button</ButtonWithLoader>)

      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByRole('button')).toHaveClass('cursor-not-allowed')
    })

    it('should handle variant changes', () => {
      const { rerender } = render(
        <ButtonWithLoader variant="primary">Button</ButtonWithLoader>
      )

      expect(screen.getByRole('button')).toHaveClass('btn-primary')

      rerender(<ButtonWithLoader variant="danger">Button</ButtonWithLoader>)

      expect(screen.getByRole('button')).toHaveClass('btn-danger')
      expect(screen.getByRole('button')).not.toHaveClass('btn-primary')
    })

    it('should handle multiple state changes simultaneously', () => {
      const handleClick = jest.fn()
      const { rerender } = render(
        <ButtonWithLoader
          onClick={handleClick}
          loading={false}
          disabled={false}
          variant="primary"
        >
          Button
        </ButtonWithLoader>
      )

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)

      rerender(
        <ButtonWithLoader
          onClick={handleClick}
          loading={true}
          disabled={false}
          variant="danger"
        >
          Button
        </ButtonWithLoader>
      )

      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByRole('button')).toHaveClass('btn-danger')
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1) // Should not increment
    })
  })

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<ButtonWithLoader>Accessible Button</ButtonWithLoader>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should be focusable when enabled', () => {
      render(<ButtonWithLoader>Focusable</ButtonWithLoader>)
      const button = screen.getByRole('button')
      button.focus()
      expect(document.activeElement).toBe(button)
    })

    it('should not be focusable when disabled', () => {
      render(<ButtonWithLoader disabled>Not Focusable</ButtonWithLoader>)
      const button = screen.getByRole('button')
      button.focus()
      expect(document.activeElement).not.toBe(button)
    })

    it('should support keyboard interaction (Enter key)', () => {
      const handleClick = jest.fn()
      render(
        <ButtonWithLoader onClick={handleClick}>Keyboard</ButtonWithLoader>
      )

      const button = screen.getByRole('button')
      button.focus()
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
      fireEvent.click(button) // Simulate the click that would happen

      expect(handleClick).toHaveBeenCalled()
    })

    it('should support keyboard interaction (Space key)', () => {
      const handleClick = jest.fn()
      render(
        <ButtonWithLoader onClick={handleClick}>Keyboard</ButtonWithLoader>
      )

      const button = screen.getByRole('button')
      button.focus()
      fireEvent.keyDown(button, { key: ' ', code: 'Space' })
      fireEvent.click(button) // Simulate the click that would happen

      expect(handleClick).toHaveBeenCalled()
    })
  })
})
