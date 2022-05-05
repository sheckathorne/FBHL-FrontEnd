import React, { useContext, useState, useMemo } from 'react'
import MatchCardTeamRow from './MatchCardTeamRow'
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import ThemeContext from './ThemeContext'
import data from '../helpers/data.js'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { invalidateMatch, reinstateMatch } from '../reducers/invalidMatchReducer'
import { deleteForfeit, createForfeit } from '../reducers/forfeitReducer'
import MatchCardUnplayedForfeitCollapse from './MatchCardUnplayedForfeitCollapse'
import { FaExchangeAlt } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'

const MatchCardPlayed = ({ match, addDefaultSrc, matchCardWidth }) => {
  const [ forfeitIsOpen, setForfeitIsOpen ] = useState(false)
  const [ finishedCollapsing, setFinishedCollapsing ] = useState(true)
  const [ winningTeam, setWinningTeam ] = useState('')
  const [ overtimeLoss, setOvertimeLoss ] = useState(false)
  const [ ineligiblePlayer, setIneligiblePlayer ] = useState(false)
  
  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  const navigate = useNavigate('')
  const dispatch = useDispatch()

  const handleDeleteClick = (matchId) => () => {
    dispatch(deleteForfeit(matchId))
  }

  const handleForfeitOpenClick = () => {
    setForfeitIsOpen(true)
    setFinishedCollapsing(false)
  }

  const handleForfeitSubmit = (winnerId) => () => {
    const newForfeit = {
      matchId: match.matchId,
      timestamp: match.timestamp,
      matchDate: match.matchDate,
      winningClub: winnerId,
      losingClub: teamsArr.find(team => team.id !== winnerId).id,
      overtimeLoss,
      ineligiblePlayer
    }

    dispatch(createForfeit(newForfeit))
    handleCancelForfeit()

    dispatch(invalidateMatch(match.matchId))
  }

  const handleCancelForfeit = () => {
    setForfeitIsOpen(false)
    setWinningTeam('')
    setOvertimeLoss(false)
  }
    
  const query = useQuery()
  const user = useSelector(state => state.user.user)

  const lightTheme = useContext(ThemeContext).value === 'light'
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const darkCardClass = lightTheme ? '' : ' dark'
  const buttonSelected = ( query.get('matchId') === match.matchId.toString() )
  const url = buttonSelected  ? '' : `?matchId=${match.matchId}`
  const buttonSelectedClass = buttonSelected ? ' card-selected' : ''
  const matchIsInvalid = match.invalid

  const teamsArr = [{
    id: match.clubs[0].clubId,
    name: data.teams.find(team => team.clubId.toString() === match.clubs[0].clubId.toString()).name,
    score: match.clubs[0].data.goals,
    winner: parseInt(match.clubs[0].data.goals) > parseInt(match.clubs[1].data.goals),
    abbreviation: data.teams.find(team => team.clubId.toString() === match.clubs[0].clubId).abbreviation,
  },{
    id: match.clubs[1].clubId,
    name: data.teams.find(team => team.clubId.toString() === match.clubs[1].clubId.toString()).name,
    score: match.clubs[1].data.goals,
    winner: parseInt(match.clubs[1].data.goals) > parseInt(match.clubs[0].data.goals),
    abbreviation: data.teams.find(team => team.clubId.toString() === match.clubs[1].clubId).abbreviation,
  }]

  const invalidClass = user !== null && user.role === 'admin' ? matchIsInvalid ? ' invalid-match-card' : '' : ' mb-2'
  const invalidText = user !== null && user.role === 'admin' && !match.forfeit && !forfeitIsOpen && finishedCollapsing ? matchIsInvalid ?
  <>
    <Row className='mb-2'>
      <Col className='d-grid fluid'>
        <Button variant='success' onClick={() => dispatch(reinstateMatch(match.matchId))}>Re-enable this game</Button>
      </Col>
    </Row>
  </> :
  <>
    <Row className='mb-2'>
      <Col xs={12} className='d-grid fluid'>
        <DropdownButton className='d-grid gap-2 fluid align-items-center' variant='primary' menuVariant='dark' title='Options'>
          <Dropdown.Item onClick={() => dispatch(invalidateMatch(match.matchId))}><Row className='d-flex justify-content-center'><Col xs={1}><RiDeleteBin5Line color='FireBrick'/></Col><Col>Invalidate Match</Col></Row></Dropdown.Item>
          <Dropdown.Item onClick={() => handleForfeitOpenClick()}><Row className='d-flex justify-content-center'><Col xs={1}><FaExchangeAlt color='DodgerBlue'/></Col><Col>Convert to Forfeit</Col></Row></Dropdown.Item>
        </DropdownButton>
      </Col>
    </Row>
  </> : null

  const forfeitedMatch = match.forfeit ?
    <Row className={themeClass}>
      <Col className='my-auto text-center'>
        <h6 className='fw-bold'>* Game is the result of a forfeit - full game stats are unavailable</h6>
      </Col>
    </Row> : null

  const undoButton = user !== null && user.role === 'admin' && invalidText === null && !forfeitIsOpen && finishedCollapsing ?
    <>
      <Row className='mb-2'>
        <Col className='d-grid fluid'>
          <Button variant='warning' onClick={handleDeleteClick(match.matchId)}>Undo this forfeit</Button>
        </Col>
      </Row>
    </> : null

  const handleMatchClick = () => {
    if ( !match.forfeit && !forfeitIsOpen ) {
      navigate(url)
    } 
  }

  return (
    <Col lg={matchCardWidth}>
      <div className={`small-match-result-card pointer-cursor${darkCardClass}${buttonSelectedClass}${invalidClass}`} onClick={handleMatchClick} value={match.matchId}>
        <Container>
          <Row className='mt-2'>
            <Container>
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
            </Container>
            <Row>
              <Col className='my-auto text-center'>
                <h6 className={themeClass}><small>{dayjs.unix(match.timestamp).format('MMM D, YYYY - h:mm a')}</small></h6>
              </Col>
            </Row>
            {forfeitedMatch}
          </Row>
        </Container>
        <MatchCardUnplayedForfeitCollapse
          overtimeLoss={overtimeLoss}
          setOvertimeLoss={setOvertimeLoss}
          ineligiblePlayer={ineligiblePlayer}
          setIneligiblePlayer={setIneligiblePlayer}
          forfeitIsOpen={forfeitIsOpen}
          setFinishedCollapsing={setFinishedCollapsing}
          teamsArr={teamsArr}
          themeClass={themeClass}
          addDefaultSrc={addDefaultSrc}
          winningTeam={winningTeam}
          setWinningTeam={setWinningTeam}
          handleCancelForfeit={handleCancelForfeit}
          handleForfeitSubmit={handleForfeitSubmit}
        />  
      </div>
      {invalidText}
      {undoButton}  
    </Col>
  )
}

export default MatchCardPlayed