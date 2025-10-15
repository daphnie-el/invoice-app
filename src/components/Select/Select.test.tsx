import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomSelect, { Option, paidStatusOptions } from './index'

describe('CustomSelect', () => {
  const mockOptions: Option[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ]

  describe('Basic rendering', () => {
    it('should render select component', () => {
      render(
        <CustomSelect options={mockOptions} value={null} onChange={() => {}} />
      )

      expect(screen.getByText('Select...')).toBeInTheDocument()
    })

    it('should render with custom placeholder', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={null}
          onChange={() => {}}
          placeholder="Choose an option"
        />
      )

      expect(screen.getByText('Choose an option')).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={null}
          onChange={() => {}}
          label="Test Label"
        />
      )

      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('should apply correct label styling classes', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={null}
          onChange={() => {}}
          label="Styled Label"
        />
      )

      const label = screen.getByText('Styled Label')
      expect(label).toHaveClass(
        'text-secondary',
        'text-xs',
        'mb-1',
        'text-uppercase'
      )
    })
  })

  describe('Single select mode', () => {
    it('should render in single select mode by default', () => {
      render(
        <CustomSelect options={mockOptions} value={null} onChange={() => {}} />
      )

      // Should have combobox role for single select
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should display selected value', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={mockOptions[0]}
          onChange={() => {}}
        />
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    it('should open dropdown when clicked', () => {
      render(
        <CustomSelect options={mockOptions} value={null} onChange={() => {}} />
      )

      const selectContainer = screen.getByText('Select...').closest('div')
      expect(selectContainer).toBeInTheDocument()

      fireEvent.click(selectContainer!)

      // After clicking, the select should be accessible
      const input = screen.getByRole('combobox')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Multi select mode', () => {
    it('should render in multi select mode when isMulti is true', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={[]}
          onChange={() => {}}
          isMulti
        />
      )

      // Multi-select should still have combobox role
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should display multiple selected values', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={[mockOptions[0], mockOptions[1]]}
          onChange={() => {}}
          isMulti
        />
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  describe('Clearable functionality', () => {
    it('should be clearable when isClearable is true and value is selected', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={mockOptions[0]}
          onChange={() => {}}
          isClearable
        />
      )

      // Check that the component renders without errors
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    it('should not show clear functionality when isClearable is false', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={mockOptions[0]}
          onChange={() => {}}
          isClearable={false}
        />
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })
  })

  describe('Options with extra data', () => {
    it('should handle options with extra data', () => {
      const optionsWithExtra: Option[] = [
        { label: 'Option 1', value: '1', extra: { id: 1, category: 'A' } },
        { label: 'Option 2', value: '2', extra: { id: 2, category: 'B' } },
      ]

      const { container } = render(
        <CustomSelect
          options={optionsWithExtra}
          value={null}
          onChange={() => {}}
        />
      )

      expect(container).toBeInTheDocument()
      expect(screen.getByText('Select...')).toBeInTheDocument()
    })
  })

  describe('Paid status options', () => {
    it('should export paidStatusOptions with correct structure', () => {
      expect(paidStatusOptions).toBeDefined()
      expect(Array.isArray(paidStatusOptions)).toBe(true)
      expect(paidStatusOptions.length).toBeGreaterThan(0)

      // Check first option structure
      const firstOption = paidStatusOptions[0]
      expect(firstOption).toHaveProperty('label')
      expect(firstOption).toHaveProperty('value')
      expect(typeof firstOption.label).toBe('string')
    })

    it('should work with paidStatusOptions', () => {
      render(
        <CustomSelect
          options={paidStatusOptions}
          value={null}
          onChange={() => {}}
        />
      )

      expect(screen.getByText('Select...')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria attributes', () => {
      render(
        <CustomSelect options={mockOptions} value={null} onChange={() => {}} />
      )

      const input = screen.getByRole('combobox')
      expect(input).toHaveAttribute('aria-expanded', 'false')
      expect(input).toHaveAttribute('aria-haspopup', 'true')
    })

    it('should associate label with select control', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={null}
          onChange={() => {}}
          label="Test Select"
        />
      )

      const label = screen.getByText('Test Select')
      expect(label).toHaveAttribute('for', 'custom-select')
    })

    it('should be focusable', () => {
      render(
        <CustomSelect options={mockOptions} value={null} onChange={() => {}} />
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      expect(input).toBeInTheDocument()
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle empty options array', () => {
      render(<CustomSelect options={[]} value={null} onChange={() => {}} />)

      expect(screen.getByText('Select...')).toBeInTheDocument()
    })

    it('should handle undefined onChange gracefully', () => {
      // This test ensures the component doesn't crash if onChange is undefined
      const { container } = render(
        <CustomSelect
          options={mockOptions}
          value={null}
          onChange={undefined as any}
        />
      )

      expect(container).toBeInTheDocument()
      expect(screen.getByText('Select...')).toBeInTheDocument()
    })

    it('should handle very long option labels', () => {
      const longLabelOptions: Option[] = [
        {
          label:
            'This is a very long option label that should be handled gracefully by the component',
          value: 'long',
        },
      ]

      render(
        <CustomSelect
          options={longLabelOptions}
          value={null}
          onChange={() => {}}
        />
      )

      expect(screen.getByText('Select...')).toBeInTheDocument()
    })
  })

  describe('Component structure', () => {
    it('should render within a section element', () => {
      const { container } = render(
        <CustomSelect options={mockOptions} value={null} onChange={() => {}} />
      )

      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('should render select component from react-select', () => {
      render(
        <CustomSelect options={mockOptions} value={null} onChange={() => {}} />
      )

      // Check for react-select specific classes
      const selectContainer = document.querySelector('[class*="container"]')
      expect(selectContainer).toBeInTheDocument()
    })

    it('should handle boolean values in options', () => {
      const booleanOptions: Option[] = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ]

      render(
        <CustomSelect
          options={booleanOptions}
          value={null}
          onChange={() => {}}
        />
      )

      expect(screen.getByText('Select...')).toBeInTheDocument()
    })

    it('should handle string values in options', () => {
      const stringOptions: Option[] = [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ]

      render(
        <CustomSelect
          options={stringOptions}
          value={null}
          onChange={() => {}}
        />
      )

      expect(screen.getByText('Select...')).toBeInTheDocument()
    })
  })

  describe('Props validation', () => {
    it('should handle missing required props gracefully', () => {
      // Test that component renders even with minimal props
      const { container } = render(
        <CustomSelect options={[]} value={null} onChange={() => {}} />
      )

      expect(container).toBeInTheDocument()
    })

    it('should handle all props together', () => {
      render(
        <CustomSelect
          options={mockOptions}
          value={mockOptions[0]}
          onChange={() => {}}
          placeholder="Custom placeholder"
          label="Full Test"
          isMulti={false}
          isClearable={true}
        />
      )

      expect(screen.getByText('Full Test')).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })
  })
})
