import { configureStore } from '@reduxjs/toolkit'
import paginationReducer from './paginationReducer'
import viewToggleReducer from './viewToggleReducer'
import teamRankingsReducer from './teamRankingsReducer'
import calendarReducer from './calendarReducer'
import calenderRangeReducer from './calenderRangeReducer'
import scheduleReducer from './scheduleReducer'
import playerSortReducer from './playerSortReducer'
import notificationReducer from './notificationReducer'
import userReducer from './userReducer'
import skaterOrGoalieReducer from './skaterOrGoalieReducer'
import invalidMatchesReducer from './invalidMatchReducer'
import matchSkeletonsReducer from './matchSkeletonsReducer'
import forfeitReducer from './forfeitReducer'
import teamRankingsAndForfeitsReducer from './teamRankingsAndForfeitsReducer'
import goaltenderSortReducer from './goaltenderSortReducer'
import playoffRaceReducer from './playoffRaceReducer'
import topPlayersReducer from './topPlayersReducer'
import paginatedPlayersReducer from './paginatedPlayersReducer'

const store = configureStore({
  reducer: {
    pagination: paginationReducer,
    viewToggle: viewToggleReducer,
    teamRankings: teamRankingsReducer,
    calendarSelectedDate: calendarReducer,
    timestampRangeOfSelectedDay: calenderRangeReducer,
    schedule: scheduleReducer,
    sortField: playerSortReducer,
    notification: notificationReducer,
    user: userReducer,
    skaterOrGoalie: skaterOrGoalieReducer,
    invalidMatches: invalidMatchesReducer,
    matchSkeletons: matchSkeletonsReducer,
    forfeits: forfeitReducer,
    teamRankingsAndForfeits: teamRankingsAndForfeitsReducer,
    gkSortField: goaltenderSortReducer,
    playoffRace: playoffRaceReducer,
    topPlayers: topPlayersReducer,
    paginatedPlayers: paginatedPlayersReducer,
  }
})

export default store