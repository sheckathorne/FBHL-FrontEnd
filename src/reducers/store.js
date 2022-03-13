import { configureStore } from '@reduxjs/toolkit'
import matchesReducer from './matchesReducer'
import paginationReducer from './paginationReducer'
import viewToggleReducer from './viewToggleReducer'
import teamRankingsReducer from './teamRankingsReducer'
import calendarReducer from './calendarReducer'
import calenderRangeReducer from './calenderRangeReducer'

const store = configureStore({
  reducer: {
    matches: matchesReducer,
    pagination: paginationReducer,
    viewToggle: viewToggleReducer,
    teamRankings: teamRankingsReducer,
    calendarSelectedDate: calendarReducer,
    timestampRangeOfSelectedDay: calenderRangeReducer,
  }
})

export default store