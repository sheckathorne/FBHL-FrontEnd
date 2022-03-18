import React, { useContext } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import dataHelper from '../helpers/data'
import ThemeContext from './ThemeContext'
import { useSelector, useDispatch } from 'react-redux'
import { setSkaterOrGoalie } from '../reducers/skaterOrGoalieReducer'
import { setPlayersActivePage } from '../reducers/paginationReducer'

const SkaterGoalieToggleDropdown = () => {
  const skaterOrGoalie = useSelector(state => state.skaterOrGoalie)
  const dispatch = useDispatch()

  const handleSkaterOrGoalieClick = (e) => {
    dispatch(setSkaterOrGoalie({ field: e.currentTarget.getAttribute('item-value') }))
    dispatch(setPlayersActivePage(1))
  }
  
  const activeItem = {
    field: skaterOrGoalie.field,
    active: true
  }

  const themeVariant = useContext(ThemeContext).value === 'light' ? 'outline-dark' : 'dark'
  const buttonsList = dataHelper.skaterGoalieToggleButtons.map(button => button.field !== activeItem.field ? button : { ...button, active: true } )
  const buttonTitle = buttonsList.find(button => button.field === activeItem.field).fieldName

  return (
    <DropdownButton className='d-grid gap-2' variant={themeVariant} id="dropdown-basic-button" title={buttonTitle}>
      {buttonsList.map(button =>
        <Dropdown.Item
          key={button.id}
          active={button.active}
          onClick={handleSkaterOrGoalieClick}
          item-value={button.field}
        >
          {button.fieldName}
        </Dropdown.Item>
      )}
    </DropdownButton>
  )
}

export default SkaterGoalieToggleDropdown