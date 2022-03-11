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
  teamData,
  handleSkaterOrGoalieClick,
  handleSortClick,
  sortField,
  players,
  skaterOrGoalie,
  handleTableClick,
  handleCollapseClick,
  leagueOpen,
  playerOpen,
  resultsOpen,
  width,
  user,
  schedule,
  setSchedule
}) => {
  return (
    <Routes>
      <Route path='/' element={<>
        <LeagueDashboard
          teamData={teamData}
          players={players}
          handleTableClick={handleTableClick}
          sortField={sortField}
          leagueOpen={leagueOpen}
          playerOpen={playerOpen}
          resultsOpen={resultsOpen}
          handleCollapseClick={handleCollapseClick}
          width={width}
        /></>} />
      <Route path='calendar' element={
        <CalendarLayout
          players={players}
          user={user}
          schedule={schedule}
          setSchedule={setSchedule}
        />}>
        <Route index element={<><CalendarDisplay /></>} />
        <Route path=':teamId' element={<><CalendarDisplayTeam /></>} />
      </Route>
      <Route path='players' element={
        <PlayersLayout
          handleSortClick={handleSortClick}
          handleSkaterOrGoalieClick={handleSkaterOrGoalieClick}
          sortField={sortField}
          players={players}
          skaterOrGoalie={skaterOrGoalie}
        />}>
        <Route index element={<PlayersDisplay />} />
        <Route path=':teamId' element={<PlayersDisplayTeam />} />
      </Route>
      <Route path='teams' element={<>
        <TeamsLayout
          teamData={teamData}
        /></>}>
        <Route index element={<TeamsDisplay />}></Route>
        <Route path=':teamId' element={<TeamDisplay />}></Route>
      </Route>
    </Routes>
  )
}

export default AppDashboard