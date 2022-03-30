import React, { useContext } from 'react'
import MatchCardTeamRow from './MatchCardTeamRow'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import ThemeContext from './ThemeContext'
import data from '../helpers/data.js'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { toggleMatchValidation } from '../reducers/matchesReducer'
import { invalidateMatch, reinstateMatch } from '../reducers/invalidMatchReducer'

const MatchCardPlayed = ({ match, addDefaultSrc }) => {
  const useQuery = () => {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
  }

  const navigate = useNavigate('')
  const dispatch = useDispatch()
    
  const query = useQuery()
  const user = useSelector(state => state.user.user)

  const lightTheme = useContext(ThemeContext).value === 'light'
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const darkCardClass = lightTheme ? '' : ' dark'
  const buttonSelected = ( query.get('matchId') === match.matchId.toString() )
  const url = buttonSelected  ? '' : `?matchId=${match.matchId}`
  const buttonSelectedClass = buttonSelected ? ' card-selected' : ''
  const matchIsInvalid = match.invalid

  const handleInvalidateClick = (matchId) => () => {
    dispatch(invalidateMatch(matchId))
    dispatch(toggleMatchValidation(matchId))
  }

  const handleReinstateClick = (matchId) => () => {
    dispatch(reinstateMatch(matchId))
    dispatch(toggleMatchValidation(matchId))
  }

  const teamsArr = [{
    id: match.clubs[0].clubId,
    name: data.teams.find(team => team.clubId.toString() === match.clubs[0].clubId.toString()).name,
    score: match.clubs[0].data.goals,
    winner: parseInt(match.clubs[0].data.goals) > parseInt(match.clubs[1].data.goals)
  },{
    id: match.clubs[1].clubId,
    name: data.teams.find(team => team.clubId.toString() === match.clubs[1].clubId.toString()).name,
    score: match.clubs[1].data.goals,
    winner: parseInt(match.clubs[1].data.goals) > parseInt(match.clubs[0].data.goals)
  }]

  const invalidClass = user !== null && user.role === 'admin' ? matchIsInvalid ? ' invalid-match-card' : '' : ' mb-2'
  const invalidText = user !== null && user.role === 'admin' ? matchIsInvalid  ?
  <>
    <Row className='mb-2'>
      <Col className='d-grid fluid'>
        <Button variant='success' onClick={handleReinstateClick(match.matchId)} >Re-enable this game</Button>
      </Col>
    </Row>
  </> : 
    <>
    <Row className='mb-2'>
      <Col className='d-grid fluid'>
        <Button variant='danger' onClick={handleInvalidateClick(match.matchId)}>Invalidate this game</Button>
      </Col>
    </Row>
  </> : null

  return (
    <div className='d-grid'>
      <div className={`small-match-result-card pointer-cursor${darkCardClass}${buttonSelectedClass}${invalidClass}`} onClick={() => navigate(url)} value={match.matchId}>
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
      {invalidText}
    </div>
  )
}

export default MatchCardPlayed