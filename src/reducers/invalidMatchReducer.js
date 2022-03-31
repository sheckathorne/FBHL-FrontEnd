import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'
import { setNotification, clearNotification } from './notificationReducer'
import { setUser } from './userReducer'

const initialState = []

const invalidMatchesSlice = createSlice({
  name: 'invalidMatches',
  initialState,
  reducers: {
    setInvalidMatches(_state, action) {
      return action.payload
    },
    invalidateOneMatch(state, action) {
      return state.concat(action.payload)
    },
    reinstateOneMatch(state, action) {
      const matchId = action.payload
      return state.filter(invalidMatch => invalidMatch !== matchId)
    },
  },
})

export const { setInvalidMatches, invalidateOneMatch, reinstateOneMatch } = invalidMatchesSlice.actions

export const initializeInvalidMatches = () => {
  return async dispatch => {
    const invalidMatches = await chelService.getData('/invalidMatches')
    const invalidMatchIds = invalidMatches.map(match => match.matchId)
    dispatch(setInvalidMatches(invalidMatchIds))
  }
}

export const invalidateMatch = (matchId) => {
  return async dispatch => {
    const response = await chelService.invalidateMatch(matchId)

    if ( response === 401 ) {
      dispatch(setNotification({ type: 'danger', text: 'Failed to invalidate the game, please log in again', scope: 'MatchCardDashboard' }))
      window.localStorage.removeItem('loggedFBHLuser')
      dispatch(setUser(null))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } else if ( response === 200 ) {
      dispatch(invalidateOneMatch(matchId))
      dispatch(setNotification({ type: 'success', text: 'Game was successfully invalidatd', scope: 'MatchCardDashboard' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }

    return response.status
  }
}

export const reinstateMatch = (matchId) => {
  return async dispatch => {
    const response = await chelService.reinstateMatch(matchId)

    if ( response === 401 ) {
      dispatch(setNotification({ type: 'danger', text: 'Failed to reinstate the game, please log in again', scope: 'MatchCardDashboard' }))
      window.localStorage.removeItem('loggedFBHLuser')
      dispatch(setUser(null))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } else if ( response === 204 ) {
      dispatch(reinstateOneMatch(matchId))
      dispatch(setNotification({ type: 'success', text: 'Game was successfully reinstated', scope: 'MatchCardDashboard' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }

    return response.status
  }
}

export default invalidMatchesSlice.reducer