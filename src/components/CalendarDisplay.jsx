import { useState, useEffect, useMemo, useContext } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import 'react-calendar/dist/Calendar.css'
import data from '../helpers/data.js'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useSelector, useDispatch } from 'react-redux'
import { setMatchActivePage } from '../reducers/paginationReducer'
import { setTimestampRange } from '../reducers/calenderRangeReducer'
import { initializeValidDates } from '../reducers/validCalendarDateReducer'
import { initializeDayMatches } from '../reducers/dayMatchesReducer'
import LeagueContext from './LeagueContext'
import Calendar from 'react-calendar'
import { useLocation } from 'react-router-dom'
import { setSelectedDate } from '../reducers/calendarReducer'
import { Container, Row, Col } from 'react-bootstrap'
import TeamDropdown from './TeamDropdown'
import MatchDetailDashboard from './MatchDetailDashboard'
import MatchCardDashboard from './MatchCardDashboard'
import MatchTypeDropdown from './MatchTypeDropdown'
import ThemeContext from './ThemeContext'
import MobileContext from './MobileContext'
import MobileTitle from './MobileTitle'
import CircularProgress from '@mui/material/CircularProgress'

const CalendarDashboard = () => {
  const [ calendarTimestamps, setCalendarTimestamps ] = useState({ startDate: 0, endDate: 0 })
  const [ matchTypeFilter, setMatchTypeFilter ] = useState('all')
  const [ calendarLoading, setCalendarLoading ] = useState(true)

  const dispatch = useDispatch()
  const selectedTimestamp = useSelector(state => state.calendarSelectedDate)
  const user = useSelector(state => state.user.user)
  const selectedDate = dayjs.unix(selectedTimestamp)
  const validCalendarDatesObj = useSelector(state => state.validCalendarDates)
  const matchesWithForfeits = useSelector(state => state.dayMatches)
  const timestampRangeOfSelectedDay = useSelector(state => state.timestampRangeOfSelectedDay)
  const teamIdParam = useParams().teamId
  const leagueName = useContext(LeagueContext)
  const teamId = teamIdParam ? teamIdParam.toString() : teamIdParam

  function useQuery() {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  const query = useQuery()
  const queriedTimestamp = query.get('timestamp')
  const queriedMatchId = query.get('matchId')

  function setDateState(dateVal) {
    const startTimeStamp = dayjs(dateVal).unix()
    const endTimestamp = dayjs(dateVal).add(1,'d').subtract(1,'s').unix()
    dispatch(setTimestampRange({ begin: startTimeStamp, end: endTimestamp }))
    dispatch(setSelectedDate(dayjs(dateVal).startOf('day').unix()))
    dispatch(setMatchActivePage(1))
  }

  function onChange(newSelectedDate) {
    setDateState(newSelectedDate)
  }

  function onActiveStartDateChange({ activeStartDate }) {
    setDateState(activeStartDate)
  }

  function handleMatchTypeChange(type) {
    return () => setMatchTypeFilter(type)
  }

  if ( queriedTimestamp ) {
    dispatch(setSelectedDate(dayjs(dayjs.unix(queriedTimestamp).startOf('day')).unix()))
  }

  const validCalendarDates = useMemo(() => {
    return Object.entries(validCalendarDatesObj).filter(date => date[1] > 0).map(date => date[0])
  },[validCalendarDatesObj])
  
  const monthAndYear = useMemo(() => {
    return dayjs(selectedDate).month().toString() + '-' + dayjs(selectedDate).year().toString()
  },[selectedDate])

  useEffect(() => {
    setCalendarTimestamps({ 
      startDate: dayjs(dayjs(selectedDate).startOf('month')).unix(),
      endDate: dayjs(dayjs(selectedDate).endOf('month')).unix() })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[monthAndYear])

  useEffect(() => {
    setCalendarLoading(true)
    const { startDate, endDate } = calendarTimestamps
    dispatch(initializeValidDates(startDate, endDate, matchTypeFilter, user, teamId))
    setCalendarLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, calendarTimestamps, matchTypeFilter, user, teamId])

  useEffect(() => {
    const { begin, end } = timestampRangeOfSelectedDay
    dispatch(initializeDayMatches(begin, end, matchTypeFilter, user, teamId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, timestampRangeOfSelectedDay, matchTypeFilter, user, teamId])

  useEffect(() => {
    dispatch(setMatchActivePage(1))
  },[dispatch])

  const lastMatchTimestampForTeams = 

  // sets calendar to last date a given team (or all teams if none selected) played a game
  useEffect(() => {
    if ( matchTypeFilter === 'all' || matchTypeFilter === 'played' ) {
      dispatch(setSelectedDate(lastMatchTimestampForTeams))
    } else {
      const scheduleFromTodayOnward = schedule.filter(match => dayjs.unix(dayjs(match.matchDate).unix()).startOf('day').toDate() >= dayjs().startOf('day').toDate())
      const minScheduledTimeStamp = scheduleFromTodayOnward.length === 0 ?
        dayjs().startOf('day').unix() :
        Math.min(...schedule.filter(match => dayjs.unix(dayjs(match.matchDate).unix()).startOf('day').toDate() >= dayjs().startOf('day').toDate()).map(match => ({ ...match, timestamp: dayjs(match.matchDate).unix() })).map(o => o.timestamp))
      dispatch(setSelectedDate(dayjs(dayjs.unix(minScheduledTimeStamp).startOf('day')).unix()))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[matchTypeFilter, dispatch])


  useEffect(() => {
    dispatch(setTimestampRange({ 
      begin: selectedTimestamp, 
      end: dayjs.unix(selectedTimestamp).add(1,'d').subtract(1,'s').unix() }))
  },[dispatch, selectedTimestamp])

  const tileDisabled = ({ date, view }) => (view === 'month' &&  !validCalendarDates.includes(dayjs(date).format('M/D/YYYY')))
  const title = teamId ? `Calendar - ${data.teams.find(team => team.clubId.toString() === teamId).name}` : `Calendar - ${leagueName}`


  const lightTheme = useContext(ThemeContext).value === 'light'
  const isMobile = useContext(MobileContext)
  const queriedMatch = matchesWithForfeits.filter(match => match.matchId).find(match => match.matchId.toString() === queriedMatchId)
  const cardDashboardColSize = queriedMatch ? 4 : 8
  const mobileTitle = isMobile ? <MobileTitle title='Season Calendar' lightTheme={lightTheme} /> : null
  const calendarDate = selectedTimestamp === 'Invalid Date' ? dayjs().startOf('day').toDate() : dayjs.unix(selectedTimestamp).toDate()

  const matchDetails = queriedMatchId ? (
    <Col lg={8} className='mt-2'>
      <MatchDetailDashboard
        queriedMatchId={queriedMatchId}
      />
    </Col> ) : null

  const matchCardDashboard = (timestampRangeOfSelectedDay.begin > 0 && timestampRangeOfSelectedDay.end > 0) ? (
    <Col lg={cardDashboardColSize} className='mt-2'>
      <MatchCardDashboard
        filteredMatchCards={matchesWithForfeits}
        queriedMatch={queriedMatch}
        teamId={teamId}
        matchTypeFilter={matchTypeFilter}
      />
    </Col>) : null
    
  const calendar = queriedMatchId ? null : (
    <Col lg={4} className='mt-2 '>
      {mobileTitle}
      <Row><Col><TeamDropdown source='calendar' /></Col></Row>
      <Row className='mt-2'><Col><MatchTypeDropdown selectedType={matchTypeFilter} handleMatchTypeChange={handleMatchTypeChange} /></Col></Row>
      <Row>
        <Col className='d-flex justify-content-center mt-2'>
          <Calendar
            onChange={onChange}
            onActiveStartDateChange={onActiveStartDateChange}
            value={calendarDate}
            tileDisabled={tileDisabled}
            defaultActiveStartDate={new Date()}
            className={lightTheme ? 'flex-fill calendar-light' : 'flex-fill calendar-dark'}
          />
        </Col>
      </Row>
    </Col>
  )

  const calendarCanvas = calendarLoading ?
    <Col lg={4} className='mt-2 '>
      {mobileTitle}
      <Row><Col><TeamDropdown source='calendar' /></Col></Row>
      <Row className='mt-2'><Col><MatchTypeDropdown selectedType={matchTypeFilter} handleMatchTypeChange={handleMatchTypeChange} /></Col></Row>
      <Row>
        <Col className='d-flex justify-content-center mt-4'>
          <CircularProgress />
        </Col>
      </Row>
    </Col> : calendar

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Container>
        <Row>
          {calendarCanvas}
          {matchCardDashboard}
          {matchDetails}
        </Row>
      </Container>
    </HelmetProvider>
  )
}

export default CalendarDashboard