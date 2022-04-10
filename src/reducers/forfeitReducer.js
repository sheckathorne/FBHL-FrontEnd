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
    removeForfeit(state, action) {
      return state.filter(match => match.matchId !== action.payload)
    },
  },
})

export const { setForfeits, setNewForfeit, removeForfeit } = forfeitSlice.actions

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

export const deleteForfeit = (matchId) => {
  return async dispatch => {
    const response = await chelService.deleteForfeitedMatch(matchId)
    if ( response.status === 401 ) {
      dispatch(setNotification({ type: 'danger', text: 'Failed to undo forfeit, please log in again.', scope: 'MatchCardDashboard' }))
      window.localStorage.removeItem('loggedFBHLuser')
      dispatch(setUser(null))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } else if ( response.status === 204) {
      dispatch(removeForfeit(matchId))
      dispatch(setNotification({ type: 'success', text: 'Forfeit was successfully undone.', scope: 'MatchCardDashboard' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }
}

export default forfeitSlice.reducer