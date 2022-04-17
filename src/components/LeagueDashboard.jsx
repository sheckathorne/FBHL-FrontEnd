import React, { useContext } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import LeagueStandings from './LeagueStandings'
import PlayerStandings from './PlayerStandings'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import RecentResultsCarousel from './RecentResultsCarousel'
import LeagueContext from './LeagueContext'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSkaterOrGoalie } from '../reducers/skaterOrGoalieReducer'
import { setSortField } from '../reducers/playerSortReducer'
import data from '../helpers/data'

const LeagueDashboard = ({ width }) => {
  const navigate = useNavigate('')
  const dispatch = useDispatch()

  const lightTheme = useContext(ThemeContext).value === 'light'
  const numOfMatchDaysToDisplayOnHeader = 2
  const matches = useSelector(state => state.matchSkeletons)
  const recentMatchDates = matches.map(match => ({ timestamp: match.timestamp, matchDate: match.matchDate })).sort((a,b) => b.timestamp - a.timestamp).map(match => match.matchDate).filter((v, i, a) => a.indexOf(v) === i).slice(0,numOfMatchDaysToDisplayOnHeader)
  const leagueName = useContext(LeagueContext)

  const handleTopPlayerClick = (sortField, url) => () => {
    const newSortField = data.sortButtons.find(button => button.field === sortField.field )
    dispatch(setSortField({ field: newSortField.field, descending: newSortField.descending, alpha: newSortField.alpha, secondaryField: newSortField.secondaryField, secondaryReversed: newSortField.secondaryReversed }))
    dispatch(setSkaterOrGoalie({ field: 'skaters' }))
    navigate(url)
  }

  const handleLeagueRowClick = (url) => () => {
    navigate(url)
  }

  const handleTableClick = {
    players: handleTopPlayerClick,
    league: handleLeagueRowClick
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{leagueName} - League Overview</title>
      </Helmet>
      <Container>
        <Row className='mt-2 mb-2'>
          <Col>
            <RecentResultsCarousel
              matches={matches.filter(match => recentMatchDates.includes(match.matchDate)).sort((a,b) => b.timestamp - a.timestamp)}
              lightTheme={lightTheme}
              width={width}
            />
          </Col>
        </Row>
        <Row>
          <Col className='mt-2' xs={12} lg={7}>
            <LeagueStandings
              lightTheme={lightTheme}
              handleTableClick={handleTableClick}
            />
          </Col>
          <Col className='mt-2' xs={12} lg={5}>
            <PlayerStandings
              lightTheme={lightTheme}
              handleTableClick={handleTableClick}
            />
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  )
}

export default LeagueDashboard