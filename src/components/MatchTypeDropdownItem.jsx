import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

const MatchTypeDropdownItem = ({ matchType, active, handleMatchTypeChange }) => (
  <Dropdown.Item
    active={active}
    onClick={handleMatchTypeChange(matchType.type)}
  >
    {matchType.display}
  </Dropdown.Item>
)

export default MatchTypeDropdownItem