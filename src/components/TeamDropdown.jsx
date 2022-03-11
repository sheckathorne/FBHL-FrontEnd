import React, { useContext } from 'react'
import { Image, DropdownButton } from 'react-bootstrap'
import data from '../helpers/data.js'
import { useLocation } from 'react-router-dom'
import TeamDropdownItem from './TeamDropdownItem'
import ThemeContext from './ThemeContext'

const TeamDropdown = ({ source, resetAllPagination }) => {
  const addDefaultSrc = (e) => e.target.src = data.defaultCrest
  const lightTheme = useContext(ThemeContext).value === 'light'
  const themeVariant = lightTheme ? 'outline-dark' : 'dark'
  const activeId = useLocation().pathname.replace('/calendar','').replace('/players','').replace('/teams','').replace('/','')
  const team = data.teams.filter(team => team.active).find(team => team.clubId.toString() === activeId)

  const title =
    <>
      <Image
        className='team-dropdown-card-logo crisp-edges'
        alt={team.name}
        onError={addDefaultSrc}
        src={require(`../resources/team-logos/${team.abbreviation}.png`)} />
      {`  ${team.name}`}
    </>

  return (
    <>
      <DropdownButton className='d-grid gap-2 fluid modified-bootstrap-button' variant={themeVariant} title={title}>
        {data.teams.filter(team => team.active).map(team =>
          <TeamDropdownItem
            key={team.clubId}
            team={team}
            source={source}
            addDefaultSrc={addDefaultSrc}
            resetAllPagination={resetAllPagination}
          />
        )}
      </DropdownButton>
    </>
  )
}

export default TeamDropdown