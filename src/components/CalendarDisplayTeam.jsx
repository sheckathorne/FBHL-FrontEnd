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
  const timestampRangeOfSelectedDay = useSelector(state => state.timestampRangeOfSelectedDay)
  const teamId = useParams().teamId.toString()
  const matcheSkeletons = useSelector(state => state.matchSkeletons)
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

  const matchesWithForfeits = matcheSkeletons.concat(forfeitedMatches)

  const filteredSchedule = useSelector(state => state.schedule).filter(match => match.teams.includes(teamId)).map(match => ({ timestamp: dayjs(match.matchDate).unix() + contextObj.TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES, ...match }))
  const filteredMatchesWithDate = matchesWithForfeits.filter(match => match.clubs.map(club => club.clubId).includes(teamId))

  const scheduleWithoutPlayedMatches = filteredSchedule.filter(match => {
    const scheduledMatchWasPlayed = filteredMatchesWithDate.find(m => m.clubs.map(club => club.clubId).includes(match.teams[0]) && m.clubs.map(club => club.clubId).includes(match.teams[1]) && m.matchDate === match.matchDate )
    return !scheduledMatchWasPlayed
  })

  const filteredMatchCards =
    contextObj.matchTypeFilter === 'all' ?
      filteredMatchesWithDate.map(match => ({ matchWasPlayed: true, ...match })).concat(scheduleWithoutPlayedMatches.map(match => ({ matchDateString: match.matchDate, matchWasPlayed: false, ...match }))) :
    contextObj.matchTypeFilter === 'played' ?
      filteredMatchesWithDate.map(match => ({ matchWasPlayed: true, ...match })) :
      scheduleWithoutPlayedMatches.map(match => ({ matchDateString: match.matchDate, matchWasPlayed: false, ...match }))

  const tileDisabled = ({ date, view }) => (view === 'month' && !filteredMatchCards.map(match => match.matchDate).find(dDate => dDate === dayjs(date).format('M/D/YYYY')))
  const teamName = data.teams.find(team => team.clubId.toString() === teamId).name

  return (
    <HelmetProvider>
      <Helmet>
        <title>Calendar - {teamName}</title>
      </Helmet>
      <CalendarContentLayout
        onChange={contextObj.onChange}
        tileDisabled={tileDisabled}
        filteredMatchCards={filteredMatchCards}
        rangedFilteredMatchCards={filteredMatchCards.filter(match => match.timestamp > timestampRangeOfSelectedDay.begin && match.timestamp < timestampRangeOfSelectedDay.end )}
        teamId={teamId}
        matchTypeFilter={contextObj.matchTypeFilter}
        handleMatchTypeChange={contextObj.handleMatchTypeChange}
        selectedDate={contextObj.selectedDate}
        queriedMatchId={contextObj.queriedMatchId}
      />
    </HelmetProvider>
  )
}

export default CalendarDashboard