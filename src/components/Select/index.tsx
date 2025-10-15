import React from 'react'
import Select, { MultiValue, SingleValue } from 'react-select'

export interface Option {
  label: string
  value: string | boolean | any
  extra?: any
}
interface BaseProps {
  options: Option[]
  placeholder?: string
  label?: string
  isClearable?: boolean
}

// Single-select props
interface SingleSelectProps extends BaseProps {
  isMulti?: false
  value: Option | null
  onChange: (newValue: SingleValue<Option>) => void
}

// Multi-select props
interface MultiSelectProps extends BaseProps {
  isMulti: true
  value: Option[]
  onChange: (newValue: MultiValue<Option>) => void
}

// Discriminated union
type CustomSelectProps = SingleSelectProps | MultiSelectProps

export const paidStatusOptions = [
  { label: 'Paid', value: 'isPaid' },
  { label: 'Finalized & Unpaid', value: 'unpaid' },
  { label: 'Draft', value: 'draft' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Due Today', value: 'dueToday' },
]

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isMulti = false,
  isClearable = false,
  label,
}) => {
  return (
    <section>
      {label && (
        <label
          className="text-secondary text-xs mb-1 text-uppercase "
          htmlFor="custom-select"
        >
          {label}
        </label>
      )}
      <Select
        options={options}
        value={value}
        onChange={onChange as any}
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable={isClearable}
        className=""
      />
    </section>
  )
}

export default CustomSelect
