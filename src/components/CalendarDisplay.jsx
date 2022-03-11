import React from 'react'
import { useOutletContext } from 'react-router-dom'
import CalendarContentLayout from './CalendarContentLayout'
import dayjs from 'dayjs'
import 'react-calendar/dist/Calendar.css'
import { useSelector } from 'react-redux'


const CalendarDashboard = () => {
  const contextObj = useOutletContext()

  const schedule = contextObj.schedule.map(match => ({ timestamp: dayjs(match.matchDate).unix() + contextObj.TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES, ...match }))
  const matchWithDate = useSelector(state => state.matches)

  const scheduleWithoutPlayedMatches = schedule.filter(match => {
    const scheduledMatchWasPlayed = matchWithDate.find(m => Object.keys(m.clubs).includes(match.teams[0]) && Object.keys(m.clubs).includes(match.teams[1]) && m.matchDate === match.matchDate )
    if ( scheduledMatchWasPlayed ) {
      return false
    } else {
      return true
    }
  })

  const filteredMatchCards = contextObj.matchTypeFilter === 'all' ? matchWithDate.map(match => ({ matchWasPlayed: true, ...match })).concat(scheduleWithoutPlayedMatches.map(match => ({ matchWasPlayed: false, ...match }))) : contextObj.matchTypeFilter === 'played' ? matchWithDate.map(match => ({ matchWasPlayed: true, ...match })) : scheduleWithoutPlayedMatches.map(match => ({ matchWasPlayed: false, ...match }))

  const tileDisabled = ({ date, view }) => (view === 'month' && !filteredMatchCards.map(match => match.matchDate).find(dDate => dDate === dayjs(date).format('M/D/YYYY')) )

  return (
    <>
      <CalendarContentLayout
        onChange={contextObj.onChange}
        selectedDate={contextObj.selectedDate}
        tileDisabled={tileDisabled}
        filteredMatchCards={filteredMatchCards}
        rangedFilteredMatchCards={filteredMatchCards.filter(match => match.timestamp > contextObj.timestampRangeOfSelectedDay.begin && match.timestamp < contextObj.timestampRangeOfSelectedDay.end )}
        timestampRangeOfSelectedDay={contextObj.timestampRangeOfSelectedDay}
        matchActivePage={contextObj.matchActivePage}
        handlePaginationClick={contextObj.handlePaginationClick}
        resetAllPagination={contextObj.resetAllPagination}
        players={contextObj.players}
        deleteScheduledMatch={contextObj.deleteScheduledMatch}
        updateScheduledMatch={contextObj.updateScheduledMatch}
        matchTypeFilter={contextObj.matchTypeFilter}
        handleMatchTypeChange={contextObj.handleMatchTypeChange}
        user={contextObj.user}
      />
    </>
  )
}

export default CalendarDashboard