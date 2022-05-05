import React, { useState, useContext, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import dayjs from 'dayjs'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import LeagueContext from './LeagueContext'
import { useDispatch } from 'react-redux'
import { setMatchActivePage } from '../reducers/paginationReducer'
import { setSelectedDate } from '../reducers/calendarReducer'
import { setTimestampRange } from '../reducers/calenderRangeReducer'

const CalendarLayout = () => {
  const [ matchTypeFilter, setMatchTypeFilter ] = useState('all')
  
  const dispatch = useDispatch()
  const leagueName = useContext(LeagueContext)
  const TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES = 86340

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
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
          queriedMatchId
        }}/>
      </Container>
    </HelmetProvider>
  )
}

export default CalendarLayout