import React from 'react'
import { Dropdown, Image } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

const TeamDropdownItem = ({ team, source, addDefaultSrc, resetAllPagination }) => {
  const clubRoute = team.clubId.toString().length > 0 ? `/${team.clubId}` : team.clubId
  const itemIsSelected = useLocation().pathname === `/${source}${clubRoute}`

  return (
    <Dropdown.Item
      as={Link}
      to={`/${source}${clubRoute}`}
      active={itemIsSelected}
      onClick={resetAllPagination}
    >
      <Image className='team-dropdown-card-logo crisp-edges' alt={team.teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${team.abbreviation}.png`)} />{'  ' + team.name}
    </Dropdown.Item>
  )
}

export default TeamDropdownItem