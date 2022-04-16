import React, { useContext } from 'react'
import SortDropdownItem from './SortDropdownItem'
import { DropdownButton } from 'react-bootstrap'
import data from '../helpers/data'
import ThemeContext from './ThemeContext'
import { setSortField } from '../reducers/playerSortReducer'
import { setSortField as setGkSortField } from '../reducers/goaltenderSortReducer'
import { useDispatch, useSelector } from 'react-redux'

const SortButtonGroup = ({ showingSkaters }) => {
  const dispatch = useDispatch()
  const skatersSort = useSelector(state => state.sortField)
  const goaltendersSort = useSelector(state => state.gkSortField)  
  const sortField = showingSkaters ? skatersSort : goaltendersSort

  const activeItem = {
    field: sortField.field,
    descending: sortField.descending,
    active: true,
    reversed: sortField.reversed,
  }

  const handleSortClick = (e) => {
    if ( showingSkaters ) {
      dispatch(setSortField({ field: e.currentTarget.getAttribute('item-value'), descending: !(e.currentTarget.getAttribute('descending') === 'true'), alpha: (e.currentTarget.getAttribute('alpha') === 'true'), reversed: (e.currentTarget.getAttribute('reversed-stat') === 'true') }))
    } else {
      dispatch(setGkSortField({ field: e.currentTarget.getAttribute('item-value'), descending: !(e.currentTarget.getAttribute('descending') === 'true'), alpha: (e.currentTarget.getAttribute('alpha') === 'true'), reversed: (e.currentTarget.getAttribute('reversed-stat') === 'true') }))
    }
  }

  const sortButtons = showingSkaters ? data.sortButtons : data.goaltenderSortButtons
  const buttonsList = sortButtons.map(button => button.field !== activeItem.field ? button : { ...button, active: true, descending: activeItem.descending, reversed: activeItem.reversed } )
  const buttonTitle = ( typeof(activeItem.field) === 'undefined' ) ? 'Sort Players' : buttonsList.find(button => button.field === activeItem.field).fieldName
  const themeVariant = useContext(ThemeContext).value === 'light' ? 'outline-dark' : 'dark'

  return (
    <>
      <DropdownButton className='d-grid gap-2' variant={themeVariant} id="dropdown-basic-button" title={buttonTitle}>
        {buttonsList.map(button => {
          return (
          <SortDropdownItem
            key={button.id}
            field={button.field}
            fieldName={button.fieldName}
            descending={button.descending}
            active={button.active}
            alpha={button.alpha}
            reversed={button.reversed}
            handleSortClick={handleSortClick}
          />)
        })}
      </DropdownButton>
    </>
  )
}

export default SortButtonGroup