import React, { useContext } from 'react'
import MatchCardTeamRow from './MatchCardTeamRow'
import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import ThemeContext from './ThemeContext'
import data from '../helpers/data.js'
import dayjs from 'dayjs'

const MatchCardPlayed = ({ match, addDefaultSrc }) => {
  const useQuery = () => {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
  }

  let navigate = useNavigate('')
  const query = useQuery()

  const lightTheme = useContext(ThemeContext).value === 'light'
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const darkCardClass = lightTheme ? '' : ' dark'
  const buttonSelected = ( query.get('matchId') === match.matchId.toString() )
  const url = buttonSelected  ? '' : `?matchId=${match.matchId}`
  const buttonSelectedClass = buttonSelected ? ' card-selected' : ''
  const teamsArr = [{
    id: Object.keys(match.clubs)[0],
    name: data.teams.find(team => team.clubId.toString() === Object.keys(match.clubs)[0].toString()).name,
    score: match.clubs[`${Object.keys(match.clubs)[0]}`].goals,
    winner: parseInt(match.clubs[`${Object.keys(match.clubs)[0]}`].goals) > parseInt(match.clubs[`${Object.keys(match.clubs)[1]}`].goals)
  },{
    id: Object.keys(match.clubs)[1],
    name: data.teams.find(team => team.clubId.toString() === Object.keys(match.clubs)[1].toString()).name,
    score: match.clubs[`${Object.keys(match.clubs)[1]}`].goals,
    winner: parseInt(match.clubs[`${Object.keys(match.clubs)[1]}`].goals) > parseInt(match.clubs[`${Object.keys(match.clubs)[0]}`].goals)
  }]

  return (
    <div className='mb-2 d-grid gap-2'>
      <div className={`small-match-result-card pointer-cursor${darkCardClass}${buttonSelectedClass}`} onClick={() => navigate(url)} value={match.matchId}>
        <Container>
          <Row className='mt-2'>
            {teamsArr.map((team,i) =>
              <MatchCardTeamRow
                key={i}
                addDefaultSrc={addDefaultSrc}
                abbreviation={data.teams.find(t => t.clubId.toString() === team.id).abbreviation}
                teamName={team.name}
                teamScore={team.score}
                textClass={team.winner ? 'fw-bolder' : 'fw-light'}
                rowClass={i===0 ? 'mt-2' : 'mb-2'}
                themeClass={themeClass}
                matchWasPlayed={match.matchWasPlayed}
              />
            )}
            <Row>
              <Col className='my-auto text-center'>
                <h6 className={themeClass}><small>{dayjs.unix(match.timestamp).format('MMM D, YYYY - h:mm a')}</small></h6>
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default MatchCardPlayed