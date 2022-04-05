import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'
import { setNotification, clearNotification } from './notificationReducer'
import { setUser } from './userReducer'

const initialState = []

const forfeitSlice = createSlice({
  name: 'forfeitMatches',
  initialState,
  reducers: {
    setForfeits(_state, action) {
      return action.payload
    },
    setNewForfeit(state, action) {
      const newScheduledMatch = action.payload
      state.push(newScheduledMatch)
    },
  },
})

export const { setForfeits, setNewForfeit } = forfeitSlice.actions

export const initializeForfeits = () => {
  return async dispatch => {
    const forfeits = await chelService.getData('/forfeits')
    dispatch(setForfeits(forfeits))
  }
}

export const createForfeit = (match) => {
  return async dispatch => {
    const newForfeitedMatch = await chelService.createForfeitedMatch(match)
    if ( !newForfeitedMatch ) {
      dispatch(setNotification({ type: 'danger', text: 'Failed to forfeit the game, please try again', scope: 'MatchCardDashboard' }))
      window.localStorage.removeItem('loggedFBHLuser')
      dispatch(setUser(null))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } else if ( newForfeitedMatch) {
      dispatch(setNotification({ type: 'success', text: `This game was successfully forfeited`, scope: 'MatchCardDashboard' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)

      dispatch(setNewForfeit(newForfeitedMatch))
    }
  }
}

export default forfeitSlice.reducer