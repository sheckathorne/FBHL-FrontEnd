import React, { useContext } from 'react'
import StatRow from './StatRow'
import { Row, Col, Button, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import data from '../helpers/data.js'
import HorizontalDivider from './HorizontalDivider'
import ThemeContext from './ThemeContext'
import { useDispatch } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'

const TeamCard = ({ team, addDefaultSrc }) => {
  const dispatch = useDispatch()

  const stats = {
    gamesPlayed: team.gamesPlayed,
    wins: team.wins,
    losses: team.losses,
    overtimeLosses: team.overtimeLosses,
    goalsScored: team.goalsScored,
    goalsAllowed: team.goalsAllowed,
  }

  const ordinal_suffix_of = (i) => {
    let j = i % 10,
      k = i % 100
    if (j === 1 && k !== 11) {
      return i + 'st'
    }
    if (j === 2 && k !== 12) {
      return i + 'nd'
    }
    if (j === 3 && k !== 13) {
      return i + 'rd'
    }
    return i + 'th'
  }

  const streakClass = team.currentStreak ? team.currentStreak.includes('W') ? 'winner-streak' : 'loser-streak' : 'no-streak'

  const seasonPoints = ( parseInt(team.gamesPlayed) > 0 ) ? (<>
    <HorizontalDivider width='11' classname='justify-content-md-center'/>
    <Row>
      <Col className='my-auto' xs={6}>
        <h6 className='fw-bold'>Current Place:</h6>
      </Col>
      <Col className='my-auto'>
        <h6 className='fw-bold'>{ordinal_suffix_of(team.rank)}</h6>
      </Col>
    </Row>
    <Row>
      <Col className='my-auto' xs={6}>
        <h6 className='fw-light'>Season Points:</h6>
      </Col>
      <Col className='my-auto'>
        <h6 className='fw-light'>{((parseInt(stats.wins) * 2) + parseInt(stats.overtimeLosses)).toString()}</h6>
      </Col>
    </Row></>) : null

  const streak = team.currentStreak ? (<>
    <Row>
      <Col className='my-auto' xs={6}>
        <h6 className='fw-light'>Current Streak:</h6>
      </Col>
      <Col className='my-auto'>
        <h6 className='fw-light'><span className={streakClass}>{team.currentStreak}</span></h6>
      </Col>
    </Row></>) : null

  const themeVariant = useContext(ThemeContext).value === 'light' ? 'outline-dark' : 'dark'

  return (
    <div className='mb-2 d-grid gap-2'>
      <Button as={Link} to={`/players/${team.teamId}`} variant={themeVariant} value={team.teamId} onClick={() => dispatch(setPlayersActivePage(1))}>
        <Row>
          <Col xs={12} className='pl-4 pr-4'>
            <Row className='mt-2'>
              <Col className='my-auto team-card-logo-col' xs={2}>
                <Image className='team-card-logo' alt={team.teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${team.abbreviation}.png`)} />
              </Col>
              <Col className='my-auto mt-2'>
                <h5>{team.teamName}</h5>
              </Col>
            </Row>
            <HorizontalDivider width='11' classname='justify-content-md-center'/>
            <Row>
              <StatRow stats={stats} statColumns={data.teamStatCols} type={'total'} />
            </Row>
          </Col>
        </Row>
        {seasonPoints}
        {streak}
      </Button>
    </div>
  )
}

export default TeamCard