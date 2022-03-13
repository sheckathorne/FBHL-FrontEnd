import React, { useContext } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import Calendar from 'react-calendar'
import TeamDropdown from './TeamDropdown'
import MatchDetailDashboard from './MatchDetailDashboard'
import MatchCardDashboard from './MatchCardDashboard'
import MatchTypeDropdown from './MatchTypeDropdown'
import ThemeContext from './ThemeContext'
import MobileContext from './MobileContext'
import MobileTitle from './MobileTitle'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'

const CalendarContentLayout = ({ onChange, tileDisabled, filteredMatchCards, rangedFilteredMatchCards, teamId, players, deleteScheduledMatch, updateScheduledMatch, matchTypeFilter, handleMatchTypeChange, user }) => {
  const selectedDate = useSelector(state => state.calendarSelectedDate)
  const timestampRangeOfSelectedDay = useSelector(state => state.timestampRangeOfSelectedDay)

  const useQuery = () => {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
  }

  const lightTheme = useContext(ThemeContext).value === 'light'
  const isMobile = useContext(MobileContext)
  const query = useQuery()
  const queriedMatch = filteredMatchCards.filter(match => match.matchId).find(match => match.matchId.toString() === query.get('matchId'))

  const mobileTitle = isMobile ? <MobileTitle title='Season Calendar' lightTheme={lightTheme} /> : null

  const calendarDate = selectedDate === 'Invalid Date' ? dayjs() : dayjs.unix(selectedDate).toDate()

  const matchDetails = queriedMatch ? (
    <Col lg={8} className='mt-2'>
      <MatchDetailDashboard match={queriedMatch} players={players} />
    </Col> ) : null

  const matchCardDashboard = (timestampRangeOfSelectedDay.begin > 0 && timestampRangeOfSelectedDay.end > 0) ? (
    <Col lg={4} className='mt-2'>
      <MatchCardDashboard
        filteredMatchCards={rangedFilteredMatchCards}
        queriedMatch={queriedMatch}
        teamId={teamId}
        deleteScheduledMatch={deleteScheduledMatch}
        updateScheduledMatch={updateScheduledMatch}
        matchTypeFilter={matchTypeFilter}
        user={user}
      />
    </Col>) : null

  const calendar = queriedMatch ? null : (
    <Col lg={4} className='mt-2 '>
      {mobileTitle}
      <Row><Col><TeamDropdown source='calendar' /></Col></Row>
      <Row className='mt-2'><Col><MatchTypeDropdown selectedType={matchTypeFilter} handleMatchTypeChange={handleMatchTypeChange} /></Col></Row>
      <Row>
        <Col className='d-flex justify-content-center mt-2'>
          <Calendar
            onChange={onChange}
            value={calendarDate}
            tileDisabled={tileDisabled}
            className={lightTheme ? 'flex-fill calendar-light' : 'flex-fill calendar-dark'}
          />
        </Col>
      </Row>
    </Col>
  )

  return (
    <Row>
      {calendar}
      {matchCardDashboard}
      {matchDetails}
    </Row>
  )
}

export default CalendarContentLayout