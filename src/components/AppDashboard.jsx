import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LeagueDashboard from './LeagueDashboard'
import CalendarDisplay from './CalendarDisplay'
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
        <CalendarDisplay />}>
        <Route path=':teamId' element={<><CalendarDisplay /></>} />
      </Route>
      <Route path='players' element={
        <PlayersLayout />}>
        <Route index element={<PlayersDisplay />} />
        <Route path=':teamId' element={<PlayersDisplayTeam />} />
      </Route>
    </Routes>
  )
}

export default AppDashboard