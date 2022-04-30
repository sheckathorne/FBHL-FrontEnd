import React, { useContext, useState } from 'react'
import { Row, Col, Container, Tabs, Tab } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import ConferenceStandings from './ConferenceStandings'
import PlayerStandings from './PlayerStandings'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import RecentResultsCarousel from './RecentResultsCarousel'
import LeagueContext from './LeagueContext'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSkaterOrGoalie } from '../reducers/skaterOrGoalieReducer'
import { setSortField } from '../reducers/playerSortReducer'
import data from '../helpers/data'
import MobileContext from './MobileContext'

const LeagueDashboard = ({ width }) => {
  const [ tabPage, setTabPaqe ] = useState('standings')

  const navigate = useNavigate('')
  const dispatch = useDispatch()

  const lightTheme = useContext(ThemeContext).value === 'light'
  const numOfMatchDaysToDisplayOnHeader = 2
  const matches = useSelector(state => state.matchSkeletons)
  const recentMatchDates = matches.map(match => ({ timestamp: match.timestamp, matchDate: match.matchDate })).sort((a,b) => b.timestamp - a.timestamp).map(match => match.matchDate).filter((v, i, a) => a.indexOf(v) === i).slice(0,numOfMatchDaysToDisplayOnHeader)
  const leagueName = useContext(LeagueContext)
  const isMobile = useContext(MobileContext)
  const themeClass = lightTheme ? '' : 'dark-theme-text'

  const handleTopPlayerClick = (sortField, url, playerType) => () => {
    const newSortField = playerType === 'skaters' ? 
      data.sortButtons.find(button => button.field === sortField.field ) :
      data.goaltenderSortButtons.find(button => button.field === sortField.field )

    dispatch(setSortField({ field: newSortField.field, descending: true, alpha: newSortField.alpha, secondaryField: newSortField.secondaryField, secondaryReversed: newSortField.secondaryReversed }))
    dispatch(setSkaterOrGoalie({ field: playerType }))
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
            <Row className='table-title d-flex align-items-center expand-paranthetical'>
              <Col className='mt-1'>
                <h5 className={themeClass + ' tiny-caps section-title'}>League</h5>
              </Col>
            </Row>
            <Tabs
              id="controlled-tab-example"
              activeKey={tabPage}
              onSelect={(k) => setTabPaqe(k)}
              className="mb-3"
            >
              <Tab eventKey="standings" title="Standings" tabClassName={themeClass}>
                <ConferenceStandings
                  handleTableClick={handleTableClick}
                  lightTheme={lightTheme}
                  isMobile={isMobile}
                />
              </Tab>
              <Tab eventKey="playoffs" title="Playoff Race" tabClassName={themeClass}>
                <></>
              </Tab>
            </Tabs>
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