import React from 'react'
import data from '../helpers/data'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Image from 'react-bootstrap/Image'
import MatchCreateTeamDropdownItem from './MatchCreateTeamDropdownItem'

const MatchCreateTeamDropdown = ({ type, selectedTeamId, removeSelectedTeamId, setTeamId }) => {
  const teams = data.teams.filter(team => team.clubId !== '' && team.clubId !== removeSelectedTeamId && team.clubId > 0)
  const addDefaultSrc = (e) => e.target.src = data.defaultCrest
  const selectedTeam = data.teams.find(team => team.clubId === selectedTeamId)

  const title = selectedTeamId === '' ? 'Select a team' :
  <>
    <Image
      className='team-dropdown-card-logo crisp-edges'
      alt={selectedTeam.name}
      onError={addDefaultSrc}
      src={require(`../resources/team-logos/${selectedTeam.abbreviation}.png`)} />
    {`  ${selectedTeam.name}`}
  </>

  return (
    <DropdownButton className='d-grid gap-2 fluid modified-bootstrap-button' variant='outline-dark' title={title}>
    {teams.map(team =>
      <MatchCreateTeamDropdownItem
        key={team.clubId}
        team={team}
        selectedTeam={selectedTeam}
        addDefaultSrc={addDefaultSrc}
        setTeamId={setTeamId}
        type={type}
      />
    )}
  </DropdownButton>
  )
}

export default MatchCreateTeamDropdown