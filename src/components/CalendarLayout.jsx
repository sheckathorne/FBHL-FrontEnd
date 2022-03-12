import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import dayjs from 'dayjs'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import LeagueContext from './LeagueContext'
import chelService from '../services/api'
import { useSelector, useDispatch } from 'react-redux'
import { setMatchActivePage } from '../reducers/paginationReducer'

const CalendarLayout = ({ players, user, schedule, setSchedule }) => {
  const dispatch = useDispatch()
  const leagueName = useContext(LeagueContext)
  const teamId = useParams().teamId
  const matches = useSelector(state => state.matches)
  const filteredMatches = teamId ? matches.filter(match => match.clubs.map(club => club.clubId).includes(teamId)) : [...matches]
  const TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES = 86340

  const [ matchTypeFilter, setMatchTypeFilter ] = useState('all')
  const [ selectedDate, setSelectedDate ] = useState(dayjs.unix(Math.max(...filteredMatches.map(o => o.timestamp), 0)).startOf('day').toDate())
  const [ timestampRangeOfSelectedDay, setTimestampRangeOfSelectedDay ] = useState({})

  const filteredSchedule = teamId ? schedule.filter(match => match.teams.includes(teamId)) : schedule

  useEffect(() => {
    dispatch(setMatchActivePage(1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch])

  // sets calendar to last date a given team (or all teams if none selected) played a game
  useEffect(() => {
    if ( matchTypeFilter === 'all' || matchTypeFilter === 'played' ) {
      setSelectedDate(dayjs.unix(Math.max(...filteredMatches.map(o => o.timestamp), 0)).startOf('day').toDate())
    } else {
      const scheduleFromTodayOnward = filteredSchedule.filter(match => dayjs.unix(dayjs(match.matchDate).unix()).startOf('day').toDate() >= dayjs().startOf('day').toDate())
      const minScheduledTimeStamp = scheduleFromTodayOnward.length === 0 ?
        dayjs().startOf('day').unix() :
        Math.min(...filteredSchedule.filter(match => dayjs.unix(dayjs(match.matchDate).unix()).startOf('day').toDate() >= dayjs().startOf('day').toDate()).map(match => ({ timestamp: dayjs(match.matchDate).unix(), ...match })).map(o => o.timestamp))

      setSelectedDate(dayjs.unix(minScheduledTimeStamp).toDate())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[teamId, matchTypeFilter])

  // sets a range of unix timestamps from 12:00:00AM - 11:59:59PM for the selected date
  useEffect(() => {
    setTimestampRangeOfSelectedDay({ begin: dayjs(selectedDate).unix(), end: dayjs(selectedDate).add(1,'d').subtract(1,'s').unix() })
  },[selectedDate])

  // handles selection of new calendar date
  const onChange = (newSelectedDate) => {
    setTimestampRangeOfSelectedDay({ begin: dayjs(newSelectedDate).unix(), end: dayjs(newSelectedDate).add(1,'d').subtract(1,'s').unix() })
    setSelectedDate(newSelectedDate)
    dispatch(setMatchActivePage(1))
  }

  const deleteScheduledMatch = (id) => {
    const newSchedule = schedule.filter(match => match._id !== id)
    setSchedule(newSchedule)

    chelService
      .deleteScheduledMatch(id)
      //.then(response => console.log(response))
  }

  const updateScheduledMatch = (id, newMatchDate) => {
    const match = schedule.find(s => s._id === id)
    const changedMatch = { ...match, matchDate: newMatchDate }

    chelService
      .updateScheduledMatch(id, changedMatch).then(() => {
        setSchedule(schedule.map(item => item._id !== id ? item : changedMatch))
      })
  }

  const handleMatchTypeChange = (type) => () => {
    setMatchTypeFilter(type)
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Calendar - {leagueName}</title>
      </Helmet>
      <Container>
        <Outlet context={{
          selectedDate,
          timestampRangeOfSelectedDay,
          onChange,
          matches,
          schedule,
          players,
          deleteScheduledMatch,
          updateScheduledMatch,
          matchTypeFilter,
          handleMatchTypeChange,
          TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES,
          user
        }}/>
      </Container>
    </HelmetProvider>
  )
}

export default CalendarLayout