import { configureStore } from '@reduxjs/toolkit'
import matchesReducer from './matchesReducer'
import paginationReducer from './paginationReducer'
import viewToggleReducer from './viewToggleReducer'
import teamRankingsReducer from './teamRankingsReducer'
import calendarReducer from './calendarReducer'
import calenderRangeReducer from './calenderRangeReducer'
import playersReducer from './playersReducer'
import scheduleReducer from './scheduleReducer'
import playerSortReducer from './playerSortReducer'
import notificationReducer from './notificationReducer'
import userReducer from './userReducer'
import skaterOrGoalieReducer from './skaterOrGoalieReducer'
import invalidMatchesReducer from './invalidMatchReducer'
import matchSkeletonsReducer from './matchSkeletonsReducer'
import forfeitReducer from './forfeitReducer'
import teamRankingsAndForfeitsReducer from './teamRankingsAndForfeitsReducer'

const store = configureStore({
  reducer: {
    matches: matchesReducer,
    pagination: paginationReducer,
    viewToggle: viewToggleReducer,
    teamRankings: teamRankingsReducer,
    calendarSelectedDate: calendarReducer,
    timestampRangeOfSelectedDay: calenderRangeReducer,
    players: playersReducer,
    schedule: scheduleReducer,
    sortField: playerSortReducer,
    notification: notificationReducer,
    user: userReducer,
    skaterOrGoalie: skaterOrGoalieReducer,
    invalidMatches: invalidMatchesReducer,
    matchSkeletons: matchSkeletonsReducer,
    forfeits: forfeitReducer,
    teamRankingsAndForfeits: teamRankingsAndForfeitsReducer,
  }
})

export default store