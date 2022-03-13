import { configureStore } from '@reduxjs/toolkit'
import matchesReducer from './matchesReducer'
import paginationReducer from './paginationReducer'
import viewToggleReducer from './viewToggleReducer'
import teamRankingsReducer from './teamRankingsReducer'

const store = configureStore({
  reducer: {
    matches: matchesReducer,
    pagination: paginationReducer,
    viewToggle: viewToggleReducer,
    teamRankings: teamRankingsReducer,
  }
})

export default store