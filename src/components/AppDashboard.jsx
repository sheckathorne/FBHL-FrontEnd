import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LeagueDashboard from './LeagueDashboard'
import CalendarLayout from './CalendarLayout'
import CalendarDisplay from './CalendarDisplay'
import CalendarDisplayTeam from './CalendarDisplayTeam'
import TeamsLayout from './TeamsLayout'
import TeamDisplay from './TeamDisplay'
import TeamsDisplay from './TeamsDisplay'
import PlayersLayout from './PlayersLayout'
import PlayersDisplay from './PlayersDisplay'
import PlayersDisplayTeam from './PlayersDisplayTeam'

const AppDashboard = ({
  width
}) => {
  return (
    <Routes>
      <Route path='/' element={<>
        <LeagueDashboard
          width={width}
        /></>} />
      <Route path='calendar' element={
        <CalendarLayout />}>
        <Route index element={<><CalendarDisplay /></>} />
        <Route path=':teamId' element={<><CalendarDisplayTeam /></>} />
      </Route>
      <Route path='players' element={
        <PlayersLayout />}>
        <Route index element={<PlayersDisplay />} />
        <Route path=':teamId' element={<PlayersDisplayTeam />} />
      </Route>
      <Route path='teams' element={<>
        <TeamsLayout />
      </>}>
        <Route index element={<TeamsDisplay />}></Route>
        <Route path=':teamId' element={<TeamDisplay />}></Route>
      </Route>
    </Routes>
  )
}

export default AppDashboard