import React, { useContext } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import LeagueStandings from './LeagueStandings'
import PlayerStandings from './PlayerStandings'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import RecentResultsCarousel from './RecentResultsCarousel'
import LeagueContext from './LeagueContext'
import { useSelector } from 'react-redux'

const LeagueDashboard = ({ handleTableClick, width }) => {
  const lightTheme = useContext(ThemeContext).value === 'light'
  const numOfMatchDaysToDisplayOnHeader = 2
  const matches = useSelector(state => state.matches)
  const recentMatchDates = matches.map(match => ({ timestamp: match.timestamp, matchDate: match.matchDate })).sort((a,b) => b.timestamp - a.timestamp).map(match => match.matchDate).filter((v, i, a) => a.indexOf(v) === i).slice(0,numOfMatchDaysToDisplayOnHeader)
  const leagueName = useContext(LeagueContext)

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