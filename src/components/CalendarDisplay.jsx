import React from 'react'
import { useOutletContext } from 'react-router-dom'
import CalendarContentLayout from './CalendarContentLayout'
import dayjs from 'dayjs'
import 'react-calendar/dist/Calendar.css'
import { useSelector } from 'react-redux'

const CalendarDashboard = () => {
  const contextObj = useOutletContext()
  const timestampRangeOfSelectedDay = useSelector(state => state.timestampRangeOfSelectedDay)
  const schedule = useSelector(state => state.schedule).map(match => ({ timestamp: dayjs(match.matchDate).unix() + contextObj.TWENTY_THREE_HOURS_FIFTY_NINE_MINUTES, ...match }))
  const matchSkeletonWithDate = useSelector(state => state.matchSkeletons)
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

  const matchesWithForfeits = matchSkeletonWithDate.concat(forfeitedMatches)
  const invalidMatches = useSelector(state => state.invalidMatches).map(invalidMatch => invalidMatch.matchId)

  const scheduleWithoutPlayedMatches = schedule.filter(match => {
    const scheduledMatchWasPlayed = matchesWithForfeits.find(m => m.clubs.map(club => club.clubId).includes(match.teams[0]) && m.clubs.map(club => club.clubId).includes(match.teams[1]) && m.matchDate === match.matchDate )
    return !scheduledMatchWasPlayed
  })

  const filteredMatchCards =
    contextObj.matchTypeFilter === 'all' ?
    matchesWithForfeits.map(match => ({ matchWasPlayed: true, ...match })).concat(scheduleWithoutPlayedMatches.map(match => ({ matchWasPlayed: false, matchDateString: match.matchDate, ...match }))) :
    contextObj.matchTypeFilter === 'played' ?
    matchesWithForfeits.map(match => ({ matchWasPlayed: true, ...match })) :
      scheduleWithoutPlayedMatches.map(match => ({ matchDateString: match.matchDate, matchWasPlayed: false, ...match }))
  

  const user = useSelector(state => state.user.user)
  const filteredMatchCardsWithoutInvalid = user !== null && user.role === 'admin' ? 
    filteredMatchCards : filteredMatchCards.filter(match => !invalidMatches.includes(match.matchId))

  const tileDisabled = ({ date, view }) => (view === 'month' && !filteredMatchCardsWithoutInvalid.map(match => match.matchDate).find(dDate => dDate === dayjs(date).format('M/D/YYYY')) )

  return (
    <>
      <CalendarContentLayout
        onChange={contextObj.onChange}
        tileDisabled={tileDisabled}
        filteredMatchCards={filteredMatchCardsWithoutInvalid}
        rangedFilteredMatchCards={filteredMatchCardsWithoutInvalid.filter(match => match.timestamp > timestampRangeOfSelectedDay.begin && match.timestamp < timestampRangeOfSelectedDay.end )}
        matchTypeFilter={contextObj.matchTypeFilter}
        handleMatchTypeChange={contextObj.handleMatchTypeChange}
        selectedDate={contextObj.selectedDate}
        queriedMatchId={contextObj.queriedMatchId}
      />
    </>
  )
}

export default CalendarDashboard