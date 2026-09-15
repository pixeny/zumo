import { useEffect, useRef, useState } from 'react'
import { IconChevronDown, IconCheck } from '../icons/Icon'
import './select.css'

// A restyled dropdown that matches the glass design system — native <select>
// popups can't be styled consistently across browsers, so this renders its
// own listbox instead.
export default function Select({ value, onChange, options, placeholder = 'Select…', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const active = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`ui-select ${className}`} ref={ref}>
      <button
        type="button"
        className={`ui-select__trigger ${open ? 'ui-select__trigger--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={active ? '' : 'ui-select__placeholder'}>
          {active ? active.label : placeholder}
        </span>
        <IconChevronDown size={14} className="ui-select__chevron" />
      </button>

      {open && (
        <div className="ui-select__menu glass-border">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`ui-select__option ${o.value === value ? 'ui-select__option--active' : ''}`}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              {o.label}
              {o.value === value && <IconCheck size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
