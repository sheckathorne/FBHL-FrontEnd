import React, { useContext } from 'react'
import SortDropdownItem from './SortDropdownItem'
import { DropdownButton } from 'react-bootstrap'
import dataHelper from '../helpers/data'
import ThemeContext from './ThemeContext'

const SortButtonGroup = ({ sortField, handleSortClick }) => {
  const activeItem = {
    field: sortField.field,
    descending: sortField.descending,
    active: true
  }

  const buttonsList = dataHelper.sortButtons.map(button => button.field !== activeItem.field ? button : { ...button, active: true, descending: activeItem.descending } )
  const buttonTitle = ( typeof(activeItem.field) === 'undefined' ) ? 'Sort Players' : buttonsList.find(button => button.field === activeItem.field).fieldName
  const themeVariant = useContext(ThemeContext).value === 'light' ? 'outline-dark' : 'dark'

  return (
    <>
      <DropdownButton className='d-grid gap-2' variant={themeVariant} id="dropdown-basic-button" title={buttonTitle}>
        {buttonsList.map(button =>
          <SortDropdownItem
            key={button.id}
            field={button.field}
            fieldName={button.fieldName}
            descending={button.descending}
            active={button.active}
            alpha={button.alpha}
            handleSortClick={handleSortClick}
          />
        )}
      </DropdownButton>
    </>
  )
}

export default SortButtonGroup