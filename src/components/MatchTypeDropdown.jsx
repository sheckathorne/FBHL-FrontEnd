import React, { useContext } from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import data from '../helpers/data.js'
import MatchTypeDropdownItem from './MatchTypeDropdownItem'
import ThemeContext from './ThemeContext'

const MatchTypeDropdown = ({ selectedType, handleMatchTypeChange }) => {
  const activeType = data.matchTypeButtonGroup.find(match => match.type === selectedType)
  const lightTheme = useContext(ThemeContext).value === 'light'
  const themeVariant = lightTheme ? 'outline-dark' : 'dark'

  return (
    <DropdownButton className='d-grid gap-2 fluid modified-bootstrap-button' variant={themeVariant} title={activeType.display}>
      {data.matchTypeButtonGroup.map(matchType =>
        <MatchTypeDropdownItem key={matchType.id} matchType={matchType} active={matchType.display === activeType.display} handleMatchTypeChange={handleMatchTypeChange} />
      )}
    </DropdownButton>
  )
}

export default MatchTypeDropdown