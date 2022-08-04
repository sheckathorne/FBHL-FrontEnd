import React, { useState, useContext, useMemo, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import dayjs from 'dayjs'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import LeagueContext from './LeagueContext'
import { useDispatch } from 'react-redux'
import { setMatchActivePage } from '../reducers/paginationReducer'
import { setSelectedDate } from '../reducers/calendarReducer'
import { setTimestampRange } from '../reducers/calenderRangeReducer'
import { initializeSchedule } from '../reducers/scheduleReducer'
import { initializeScheduleDates } from '../reducers/scheduleDatesReducer'

const CalendarLayout = () => {
  const dispatch = useDispatch()
  const [ matchTypeFilter, setMatchTypeFilter ] = useState('all')

  useEffect(() => {
    const today = new Date()
    const startTimestamp = dayjs(today).startOf('month').unix()
    const endTimestamp = dayjs(dayjs(today).endOf('month')).unix()
    dispatch(initializeSchedule(startTimestamp, endTimestamp))
  }, [dispatch])
  
  const leagueName = useContext(LeagueContext)
  const TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES = 86340

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
    const monthStartTimestamp = dayjs(dateVal).startOf('month').unix()
    const monthEndTimestamp = dayjs(dayjs(dateVal).endOf('month')).unix()

    dispatch(setTimestampRange({ begin: startTimeStamp, end: endTimestamp }))
    dispatch(setSelectedDate(dayjs(dateVal).startOf('day').unix()))
    dispatch(initializeSchedule(monthStartTimestamp, monthEndTimestamp))
    dispatch(initializeScheduleDates(monthStartTimestamp, monthEndTimestamp))
    dispatch(setMatchActivePage(1))
  }

  // handles selection of new calendar date
  function onChange(newSelectedDate) {
    setDateState(newSelectedDate)
  }

  function onActiveStartDateChange({ activeStartDate }) {
    setDateState(activeStartDate)
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
          onActiveStartDateChange,
          matchTypeFilter,
          handleMatchTypeChange,
          TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES,
          queriedMatchId
        }}/>
      </Container>
    </HelmetProvider>
  )
}

export default CalendarLayout