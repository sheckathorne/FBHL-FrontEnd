import { useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import CalendarContentLayout from './CalendarContentLayout'
import dayjs from 'dayjs'
import 'react-calendar/dist/Calendar.css'
import data from '../helpers/data.js'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useSelector, useDispatch } from 'react-redux'
import { setMatchActivePage } from '../reducers/paginationReducer'
import { setSelectedDate } from '../reducers/calendarReducer'
import { setTimestampRange } from '../reducers/calenderRangeReducer'
import { initializeScheduleDates } from '../reducers/validCalendarDateReducer'
import { initializeDaySchedule } from '../reducers/dayScheduleReducer'

const CalendarDashboard = () => {
  const dispatch = useDispatch()
  const contextObj = useOutletContext()
  const teamId = useParams().teamId.toString()
  const matchTypeFilter = contextObj.matchTypeFilter
  const selectedTimestamp = useSelector(state => state.calendarSelectedDate)
  const user = useSelector(state => state.user.user)

  useEffect(() => {
    const selectedDate = dayjs.unix(selectedTimestamp)
    const firstOfMonthDate = dayjs(selectedDate).startOf('month')
    const lastOfMonthDate = dayjs(selectedDate).endOf('month')
    const startDate =  dayjs(firstOfMonthDate).unix()
    const endDate = dayjs(lastOfMonthDate).unix()
    dispatch(initializeScheduleDates(startDate, endDate, matchTypeFilter, user, teamId))
  },[dispatch, selectedTimestamp, matchTypeFilter, user, teamId])

  const validCalendarDates = useSelector(state => state.validCalendarDates)
  const timestampRangeOfSelectedDay = useSelector(state => state.timestampRangeOfSelectedDay)

  useEffect(() => {
    dispatch(initializeDaySchedule(timestampRangeOfSelectedDay.begin, timestampRangeOfSelectedDay.end, teamId))
  },[dispatch, timestampRangeOfSelectedDay, teamId])

  const matcheSkeletons = useSelector(state => state.matchSkeletons)
  const selectedDate = useSelector(state => state.calendarSelectedDate)
  const forfeitedMatches = useSelector(state => state.forfeits).map(match => (
    { 
      matchDate: match.matchDate,
      _id: match._id,
      matchId: match.matchId,
      timestamp: match.timestamp,
      forfeit: true,
      clubs: [{
        clubId: match.winningClub,
        data: { goals: '1'}
      },{
        clubId: match.losingClub,
        data: { goals: '0' }}]
    }
  ))

  const matchesWithForfeits = [...matcheSkeletons, ...forfeitedMatches]
  const lastMatchTimestampForTeams = dayjs(dayjs.unix(Math.max(...matchesWithForfeits.map(o => o.timestamp), 0)).startOf('day')).unix()
  const invalidMatches = useSelector(state => state.invalidMatches).map(invalidMatch => invalidMatch.matchId)
  const filteredSchedule = useSelector(state => state.daySchedule)
  const filteredMatchesWithDate = matchesWithForfeits.filter(match => match.clubs.map(club => club.clubId).includes(teamId))

  useEffect(() => {
    dispatch(setMatchActivePage(1))
  },[dispatch])

  useEffect(() => {
    dispatch(setSelectedDate(lastMatchTimestampForTeams))
  },[dispatch, lastMatchTimestampForTeams])

  // sets calendar to last date a given team (or all teams if none selected) played a game
  useEffect(() => {
    if ( matchTypeFilter === 'all' || matchTypeFilter === 'played' ) {
      dispatch(setSelectedDate(lastMatchTimestampForTeams))
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



  const scheduleWithoutPlayedMatches = filteredSchedule.filter(match => {
    const scheduledMatchWasPlayed = filteredMatchesWithDate.find(m => m.clubs.map(club => club.clubId).includes(match.teams[0]) && m.clubs.map(club => club.clubId).includes(match.teams[1]) && m.matchDate === match.matchDate )
    return !scheduledMatchWasPlayed
  })

  const filteredMatchCards =
    contextObj.matchTypeFilter === 'all' ?
      filteredMatchesWithDate.map(match => ({ ...match, matchWasPlayed: true })).concat(scheduleWithoutPlayedMatches.map(match => ({ ...match, matchDateString: match.matchDate, matchWasPlayed: false }))) :
    contextObj.matchTypeFilter === 'played' ?
      filteredMatchesWithDate.map(match => ({ ...match, matchWasPlayed: true })) :
      scheduleWithoutPlayedMatches.map(match => ({ ...match, matchDateString: match.matchDate, matchWasPlayed: false }))

  const filteredMatchCardsWithoutInvalid = user !== null && user.role === 'admin' ? 
    filteredMatchCards : filteredMatchCards.filter(match => !invalidMatches.includes(match.matchId))

  
  const tileDisabled = ({ date, view }) => (view === 'month' &&  !validCalendarDates.includes(dayjs(date).format('M/D/YYYY')))
  const teamName = data.teams.find(team => team.clubId.toString() === teamId).name

  return (
    <HelmetProvider>
      <Helmet>
        <title>Calendar - {teamName}</title>
      </Helmet>
      <CalendarContentLayout
        onChange={contextObj.onChange}
        onActiveStartDateChange={contextObj.onActiveStartDateChange}
        tileDisabled={tileDisabled}
        filteredMatchCards={filteredMatchCardsWithoutInvalid}
        rangedFilteredMatchCards={filteredMatchCardsWithoutInvalid.filter(match => match.timestamp > timestampRangeOfSelectedDay.begin && match.timestamp < timestampRangeOfSelectedDay.end )}
        teamId={teamId}
        matchTypeFilter={contextObj.matchTypeFilter}
        handleMatchTypeChange={contextObj.handleMatchTypeChange}
        queriedMatchId={contextObj.queriedMatchId}
      />
    </HelmetProvider>
  )
}

export default CalendarDashboard