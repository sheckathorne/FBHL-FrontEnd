import { configureStore } from '@reduxjs/toolkit'
import matchesReducer from './matchesReducer'

const store = configureStore({
  reducer: {
    matches: matchesReducer,
  }
})

export default store