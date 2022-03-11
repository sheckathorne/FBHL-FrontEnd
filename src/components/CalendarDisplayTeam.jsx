import React from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import CalendarContentLayout from './CalendarContentLayout'
import dayjs from 'dayjs'
import 'react-calendar/dist/Calendar.css'
import data from '../helpers/data.js'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useSelector } from 'react-redux'

const CalendarDashboard = () => {
  const contextObj = useOutletContext()
  const teamId = useParams().teamId.toString()
  const matches = useSelector(state => state.matches)

  const filteredSchedule = contextObj.schedule.filter(match => match.teams.includes(teamId)).map(match => ({ timestamp: dayjs(match.matchDate).unix() + contextObj.TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES, ...match }))
  const filteredMatchesWithDate = matches.filter(match => Object.keys(match.clubs).includes(teamId))

  const scheduleWithoutPlayedMatches = filteredSchedule.filter(match => {
    const scheduledMatchWasPlayed = filteredMatchesWithDate.find(m => Object.keys(m.clubs).includes(match.teams[0]) && Object.keys(m.clubs).includes(match.teams[1]) && m.matchDate === match.matchDate )
    if ( scheduledMatchWasPlayed ) {
      return false
    } else {
      return true
    }
  })

  const filteredMatchCards = contextObj.matchTypeFilter === 'all' ? filteredMatchesWithDate.map(match => ({ matchWasPlayed: true, ...match })).concat(scheduleWithoutPlayedMatches.map(match => ({ matchWasPlayed: false, ...match }))) : contextObj.matchTypeFilter === 'played' ? filteredMatchesWithDate.map(match => ({ matchWasPlayed: true, ...match })) : scheduleWithoutPlayedMatches.map(match => ({ matchWasPlayed: false, ...match }))

  const tileDisabled = ({ date, view }) => (view === 'month' && !filteredMatchCards.map(match => match.matchDate).find(dDate => dDate === dayjs(date).format('M/D/YYYY')))
  const teamName = data.teams.find(team => team.clubId.toString() === teamId).name

  return (
    <HelmetProvider>
      <Helmet>
        <title>Calendar - {teamName}</title>
      </Helmet>
      <CalendarContentLayout
        onChange={contextObj.onChange}
        selectedDate={contextObj.selectedDate}
        tileDisabled={tileDisabled}
        filteredMatchCards={filteredMatchCards}
        rangedFilteredMatchCards={filteredMatchCards.filter(match => match.timestamp > contextObj.timestampRangeOfSelectedDay.begin && match.timestamp < contextObj.timestampRangeOfSelectedDay.end )}
        timestampRangeOfSelectedDay={contextObj.timestampRangeOfSelectedDay}
        teamId={teamId}
        players={contextObj.players}
        deleteScheduledMatch={contextObj.deleteScheduledMatch}
        updateScheduledMatch={contextObj.updateScheduledMatch}
        matchTypeFilter={contextObj.matchTypeFilter}
        handleMatchTypeChange={contextObj.handleMatchTypeChange}
        user={contextObj.user}
      />
    </HelmetProvider>
  )
}

export default CalendarDashboard