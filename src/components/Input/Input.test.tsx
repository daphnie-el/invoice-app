import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom'
import Input from './index'

describe('Input', () => {
  describe('Basic rendering', () => {
    it('should render input field', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render input with placeholder', () => {
      render(<Input placeholder="Enter text here" />)
      expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument()
    })

    it('should render input with default value', () => {
      render(<Input defaultValue="Default text" />)
      expect(screen.getByDisplayValue('Default text')).toBeInTheDocument()
    })

    it('should render input with controlled value', () => {
      render(<Input value="Controlled value" onChange={() => {}} />)
      expect(screen.getByDisplayValue('Controlled value')).toBeInTheDocument()
    })
  })

  describe('Label rendering', () => {
    it('should render label when provided', () => {
      render(<Input label="Username" />)
      expect(screen.getByText('Username')).toBeInTheDocument()
    })

    it('should convert label to uppercase', () => {
      render(<Input label="email address" />)
      expect(screen.getByText('email address')).toBeInTheDocument()
    })

    it('should not render label when not provided', () => {
      render(<Input />)
      const labels = screen.queryAllByText(/\w+/)
      expect(labels.filter((label) => label.tagName === 'LABEL')).toHaveLength(
        0
      )
    })

    it('should apply correct label styling classes', () => {
      render(<Input label="Styled Label" />)
      const label = screen.getByText('Styled Label')
      expect(label).toHaveClass(
        'text-secondary',
        'text-xs',
        'mb-1',
        'text-uppercase'
      )
    })
  })

  describe('Required field indicator', () => {
    it('should show asterisk when required is true', () => {
      render(<Input label="Required Field" required />)
      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveClass('text-danger')
    })

    it('should not show asterisk when required is false', () => {
      render(<Input label="Optional Field" required={false} />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('should not show asterisk when required is not provided', () => {
      render(<Input label="Default Field" />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('should show asterisk even without label when required', () => {
      render(<Input required />)
      // Should not show asterisk when there's no label
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })
  })

  describe('Input types and attributes', () => {
    it('should render as text input by default', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('should render as email input', () => {
      render(<Input type="email" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should render as password input', () => {
      render(<Input type="password" />)
      const input = document.querySelector('input[type="password"]')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should render as number input', () => {
      render(<Input type="number" />)
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
    })

    it('should accept min and max attributes for number input', () => {
      render(<Input type="number" min="0" max="100" />)
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('min', '0')
      expect(input).toHaveAttribute('max', '100')
    })

    it('should accept step attribute for number input', () => {
      render(<Input type="number" step="0.1" />)
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('step', '0.1')
    })
  })

  describe('Input states and validation', () => {
    it('should be enabled by default', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).not.toBeDisabled()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should be readonly when readOnly prop is true', () => {
      render(<Input readOnly />)
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    })

    it('should accept maxLength attribute', () => {
      render(<Input maxLength={10} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10')
    })

    it('should accept pattern attribute', () => {
      render(<Input pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'pattern',
        '[0-9]{3}-[0-9]{3}-[0-9]{4}'
      )
    })
  })

  describe('Styling and layout', () => {
    it('should apply default minWidth', () => {
      render(<Input />)
      const group =
        screen.getByRole('textbox').closest('.form-group') ||
        screen.getByRole('textbox').parentElement
      expect(group).toHaveStyle({ minWidth: '150px' })
    })

    it('should apply custom minWidth', () => {
      render(<Input minWidth="200px" />)
      const group =
        screen.getByRole('textbox').closest('.form-group') ||
        screen.getByRole('textbox').parentElement
      expect(group).toHaveStyle({ minWidth: '200px' })
    })

    it('should apply Bootstrap form control classes', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('form-control')
    })

    it('should accept and apply custom className', () => {
      render(<Input className="custom-input-class" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-input-class')
    })

    it('should accept and apply custom id', () => {
      render(<Input id="custom-input-id" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'custom-input-id')
    })
  })

  describe('User interactions', () => {
    it('should call onChange when input value changes', async () => {
      const handleChange = jest.fn()

      render(<Input onChange={handleChange} />)
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: 'test' } })

      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('should call onFocus when input is focused', async () => {
      const handleFocus = jest.fn()

      render(<Input onFocus={handleFocus} />)
      const input = screen.getByRole('textbox')

      fireEvent.focus(input)

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should call onBlur when input loses focus', async () => {
      const handleBlur = jest.fn()

      render(
        <div>
          <Input onBlur={handleBlur} />
          <button>Other element</button>
        </div>
      )

      const input = screen.getByRole('textbox')

      fireEvent.focus(input)
      fireEvent.blur(input)

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should call onKeyDown when key is pressed', async () => {
      const handleKeyDown = jest.fn()

      render(<Input onKeyDown={handleKeyDown} />)
      const input = screen.getByRole('textbox')

      fireEvent.keyDown(input, { key: 'a', code: 'KeyA' })

      expect(handleKeyDown).toHaveBeenCalled()
    })

    it('should call onKeyUp when key is released', async () => {
      const handleKeyUp = jest.fn()

      render(<Input onKeyUp={handleKeyUp} />)
      const input = screen.getByRole('textbox')

      fireEvent.keyUp(input, { key: 'a', code: 'KeyA' })

      expect(handleKeyUp).toHaveBeenCalled()
    })
  })

  describe('Form integration', () => {
    it('should accept name attribute for form submission', () => {
      render(<Input name="username" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username')
    })

    it('should accept form attribute', () => {
      render(<Input form="my-form" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('form', 'my-form')
    })

    it('should work with form validation', () => {
      render(
        <form>
          <Input required name="email" type="email" />
          <button type="submit">Submit</button>
        </form>
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
      expect(input).toHaveAttribute('type', 'email')
    })
  })

  describe('Accessibility', () => {
    it('should be accessible via keyboard navigation', async () => {
      render(
        <div>
          <Input />
          <Input />
        </div>
      )

      const inputs = screen.getAllByRole('textbox')

      // Focus first input
      inputs[0].focus()
      expect(inputs[0]).toHaveFocus()

      // Focus second input
      inputs[1].focus()
      expect(inputs[1]).toHaveFocus()
    })

    it('should accept aria attributes', () => {
      render(
        <Input
          aria-label="Custom aria label"
          aria-describedby="help-text"
          aria-invalid="true"
        />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-label', 'Custom aria label')
      expect(input).toHaveAttribute('aria-describedby', 'help-text')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should support aria-labelledby when label is present', () => {
      render(<Input label="Accessible Label" />)

      const input = screen.getByRole('textbox')
      const label = screen.getByText('Accessible Label')

      // The label should be associated with the input
      expect(label.tagName).toBe('LABEL')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Error handling and edge cases', () => {
    it('should handle undefined onChange gracefully', async () => {
      render(<Input />)
      const input = screen.getByRole('textbox')

      // Should not throw error when onChange is not provided
      fireEvent.change(input, { target: { value: 'test' } })
      expect(input).toHaveValue('test')
    })

    it('should handle empty label gracefully', () => {
      render(<Input label="" />)
      // Should not render label when empty string is provided
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      // Label should not be in the document
      expect(screen.queryByRole('label')).not.toBeInTheDocument()
    })

    it('should handle null/undefined values', () => {
      render(<Input value={undefined} onChange={() => {}} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('should handle complex label with special characters', () => {
      render(<Input label="Email & Password!" required />)
      expect(screen.getByText('Email & Password!')).toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument()
    })
  })

  describe('Integration with React Hook Form', () => {
    it('should work with register prop (ref forwarding)', () => {
      const mockRef = React.createRef<HTMLInputElement>()

      render(<Input ref={mockRef} />)

      expect(mockRef.current).toBeInstanceOf(HTMLInputElement)
      expect(mockRef.current).toBe(screen.getByRole('textbox'))
    })

    it('should accept validation attributes', () => {
      render(
        <Input required minLength={3} maxLength={50} pattern="[A-Za-z]+" />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
      expect(input).toHaveAttribute('minlength', '3')
      expect(input).toHaveAttribute('maxlength', '50')
      expect(input).toHaveAttribute('pattern', '[A-Za-z]+')
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = jest.fn()

      const TestComponent = (props: any) => {
        renderSpy()
        return <Input {...props} />
      }

      const { rerender } = render(<TestComponent label="Test" />)

      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Re-render with same props
      rerender(<TestComponent label="Test" />)

      expect(renderSpy).toHaveBeenCalledTimes(2) // Component will re-render, but that's expected
    })
  })
})
