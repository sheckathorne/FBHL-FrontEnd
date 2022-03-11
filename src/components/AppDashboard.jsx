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
  matches,
  teamData,
  matchActivePage,
  handlePaginationClick,
  resetAllPagination,
  handleSkaterOrGoalieClick,
  handleSortClick,
  sortField,
  players,
  playersActivePage,
  teamsActivePage,
  skaterOrGoalie,
  handleTableClick,
  leagueStandingsPage,
  playerStandingsPage,
  handleLeaguePaginationChange,
  handlePlayerPaginationChange,
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
          matches={matches}
          teamData={teamData}
          players={players}
          handleTableClick={handleTableClick}
          leagueStandingsPage={leagueStandingsPage}
          leagueOpen={leagueOpen}
          playerStandingsPage={playerStandingsPage}
          playerOpen={playerOpen}
          resultsOpen={resultsOpen}
          handleLeaguePaginationChange={handleLeaguePaginationChange}
          handlePlayerPaginationChange={handlePlayerPaginationChange}
          handleCollapseClick={handleCollapseClick}
          width={width}
        /></>} />
      <Route path='calendar' element={
        <CalendarLayout
          matches={matches}
          players={players}
          matchActivePage={matchActivePage}
          handlePaginationClick={handlePaginationClick}
          resetAllPagination={resetAllPagination}
          user={user}
          schedule={schedule}
          setSchedule={setSchedule}
        />}>
        <Route index element={<><CalendarDisplay /></>} />
        <Route path=':teamId' element={<><CalendarDisplayTeam /></>} />
      </Route>
      <Route path='players' element={
        <PlayersLayout
          playersActivePage={playersActivePage}
          handleSortClick={handleSortClick}
          handleSkaterOrGoalieClick={handleSkaterOrGoalieClick}
          sortField={sortField}
          players={players}
          handlePaginationClick={handlePaginationClick}
          skaterOrGoalie={skaterOrGoalie}
          resetAllPagination={resetAllPagination}
        />}>
        <Route index element={<PlayersDisplay />} />
        <Route path=':teamId' element={<PlayersDisplayTeam />} />
      </Route>
      <Route path='teams' element={<>
        <TeamsLayout
          teamData={teamData}
          teamsActivePage={teamsActivePage}
          handlePaginationClick={handlePaginationClick}
        /></>}>
        <Route index element={<TeamsDisplay />}></Route>
        <Route path=':teamId' element={<TeamDisplay />}></Route>
      </Route>
    </Routes>
  )
}

export default AppDashboard