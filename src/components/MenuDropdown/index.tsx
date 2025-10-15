import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'
import { VariantEnum } from 'types'

interface DropdownOption {
  label: string
  onClick: () => void
  disabled?: boolean
}

interface CustomDropdownProps {
  id: string
  title: string
  menuList: DropdownOption[]
  variant?: VariantEnum
  size?: 'sm' | 'lg'
  openDropdownId: string | null
  setOpenDropdownId: (id: string | null) => void
}

const MenuDropdown: React.FC<CustomDropdownProps> = ({
  id,
  title,
  menuList: options,
  variant = 'secondary',
  size = 'sm',
  openDropdownId,
  setOpenDropdownId,
}) => {
  const isOpen = openDropdownId === id

  const handleToggle = () => {
    setOpenDropdownId(isOpen ? null : id)
  }

  return (
    <DropdownButton
      id={id}
      title={title}
      variant={variant}
      size={size}
      show={isOpen}
      onToggle={handleToggle}
      rootCloseEvent="click"
    >
      {options.map((option, index) => (
        <DropdownItem
          key={index}
          as="button"
          onClick={() => {
            option.onClick()
            setOpenDropdownId(null)
          }}
          disabled={option?.disabled}
          className={`${option?.disabled ? 'cursor-not-allowed' : ''}`}
        >
          {option.label}
        </DropdownItem>
      ))}
    </DropdownButton>
  )
}

export default MenuDropdown
