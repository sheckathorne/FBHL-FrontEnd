import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useParams, useLocation } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import dayjs from 'dayjs'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import LeagueContext from './LeagueContext'
import { useSelector, useDispatch } from 'react-redux'
import { setMatchActivePage } from '../reducers/paginationReducer'
import { setSelectedDate } from '../reducers/calendarReducer'
import { setTimestampRange } from '../reducers/calenderRangeReducer'

const CalendarLayout = () => {
  const [ matchTypeFilter, setMatchTypeFilter ] = useState('all')
  
  const dispatch = useDispatch()
  const selectedDate = useSelector(state => state.calendarSelectedDate)
  const schedule = useSelector(state => state.schedule)

  const leagueName = useContext(LeagueContext)
  const teamId = useParams().teamId
  const matches = useSelector(state => state.matches)
  const filteredMatches = teamId ? matches.filter(match => match.clubs.map(club => club.clubId).includes(teamId)) : [...matches]
  const lastMatchTimestampForTeams = dayjs(dayjs.unix(Math.max(...filteredMatches.map(o => o.timestamp), 0)).startOf('day')).unix()
  const TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES = 86340
  const filteredSchedule = teamId ? schedule.filter(match => match.teams.includes(teamId)) : schedule

  useEffect(() => {
    dispatch(setMatchActivePage(1))
  },[dispatch])

  useEffect(() => {
    dispatch(setSelectedDate(lastMatchTimestampForTeams))
  },[dispatch, lastMatchTimestampForTeams])

  // sets calendar to last date a given team (or all teams if none selected) played a game
  useEffect(() => {
    if ( matchTypeFilter === 'all' || matchTypeFilter === 'played' ) {
      dispatch(setSelectedDate(dayjs(dayjs.unix(Math.max(...filteredMatches.map(o => o.timestamp), 0)).startOf('day')).unix()))
    } else {
      const scheduleFromTodayOnward = filteredSchedule.filter(match => dayjs.unix(dayjs(match.matchDate).unix()).startOf('day').toDate() >= dayjs().startOf('day').toDate())
      const minScheduledTimeStamp = scheduleFromTodayOnward.length === 0 ?
        dayjs().startOf('day').unix() :
        Math.min(...filteredSchedule.filter(match => dayjs.unix(dayjs(match.matchDate).unix()).startOf('day').toDate() >= dayjs().startOf('day').toDate()).map(match => ({ timestamp: dayjs(match.matchDate).unix(), ...match })).map(o => o.timestamp))
      dispatch(setSelectedDate(dayjs(dayjs.unix(minScheduledTimeStamp).startOf('day')).unix()))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[teamId, matchTypeFilter, dispatch])

  // sets a range of unix timestamps from 12:00:00AM - 11:59:59PM for the selected date
  useEffect(() => {
    dispatch(setTimestampRange({ begin: selectedDate, end: dayjs.unix(selectedDate).add(1,'d').subtract(1,'s').unix() }))
  },[dispatch, selectedDate])

  const useQuery = () => {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
  }

  const query = useQuery()
  const queriedTimestamp = query.get('timestamp')
  const queriedMatchId = query.get('matchId')

  // handles selection of new calendar date
  const onChange = (newSelectedDate) => {
    dispatch(setTimestampRange({ begin: dayjs(newSelectedDate).unix(), end: dayjs(newSelectedDate).add(1,'d').subtract(1,'s').unix() }))
    dispatch(setSelectedDate(dayjs(newSelectedDate).startOf('day').unix()))
    dispatch(setMatchActivePage(1))
  }

  const handleMatchTypeChange = (type) => () => {
    setMatchTypeFilter(type)
  }

  if ( queriedTimestamp ) {
    dispatch(setSelectedDate(dayjs(dayjs.unix(queriedTimestamp).startOf('day')).unix()))
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Calendar - {leagueName}</title>
      </Helmet>
      <Container>
        <Outlet context={{
          onChange,
          matchTypeFilter,
          handleMatchTypeChange,
          TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES,
          selectedDate,
          queriedMatchId
        }}/>
      </Container>
    </HelmetProvider>
  )
}

export default CalendarLayout