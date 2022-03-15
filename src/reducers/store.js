import { configureStore } from '@reduxjs/toolkit'
import matchesReducer from './matchesReducer'
import paginationReducer from './paginationReducer'
import viewToggleReducer from './viewToggleReducer'
import teamRankingsReducer from './teamRankingsReducer'
import calendarReducer from './calendarReducer'
import calenderRangeReducer from './calenderRangeReducer'
import playersReducer from './playersReducer'
import scheduleReducer from './scheduleReducer'

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
  }
})

export default store