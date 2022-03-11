import React from 'react'
import { Dropdown, Image } from 'react-bootstrap'

const MatchCreateTeamDropdownItem = ({ team, selectedTeam, addDefaultSrc, setTeamId, type }) => {
  const itemIsSelected = selectedTeam.clubId === team.clubId

  return (
    <Dropdown.Item
      active={itemIsSelected}
      onClick={setTeamId(type,team.clubId)}
    >
      <Image className='team-dropdown-card-logo crisp-edges' alt={team.teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${team.abbreviation}.png`)} />{'  ' + team.name}
    </Dropdown.Item>
  )
}

export default MatchCreateTeamDropdownItem