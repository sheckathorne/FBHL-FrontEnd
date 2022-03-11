import { configureStore } from '@reduxjs/toolkit'
import matchesReducer from './matchesReducer'
import paginationReducer from './paginationReducer'
import viewToggleReducer from './viewToggleReducer'

const store = configureStore({
  reducer: {
    matches: matchesReducer,
    pagination: paginationReducer,
    viewToggle: viewToggleReducer,
  }
})

export default store