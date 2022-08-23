import { createSlice } from '@reduxjs/toolkit'
import { setNotification, clearNotification } from './notificationReducer'
import { setUser } from './userReducer'
import { addValidDate, removeValidDate } from './validCalendarDateReducer'
import chelService from '../services/api'
import dayjs from 'dayjs'

const initialState = []

const dayMatchesSlice = createSlice({
  name: 'dayMatches',
  initialState,
  reducers: {
    setDayMatches(_state, action) {
      return action.payload
    },
    deleteScheduledMatch(state, action) {
      const id = action.payload
      //const matchDate = state.find(schedule => schedule._id === id).matchDate
      //dispatch(removeValidDate(matchDate))
      return state.filter(schedule => schedule._id !== id)
    },
    changeDateOfMatch(state, action) {
      const id = action.payload.id
      const newMatch = action.payload.newMatch
      //const newMatchDate = newMatch.matchDate
      //const oldMatchDate = state.find(match => match._id === id).matchDate
      //dispatch(addValidDate(newMatchDate))
      //dispatch(removeValidDate(oldMatchDate))
      return state.filter(match => match._id !== id).concat(newMatch)
    },
    createScheduledMatch(state, action) {
      const newScheduledMatch = action.payload
      //const matchDate = newScheduledMatch.matchDate
      //dispatch(addValidDate(matchDate))
      state.push(newScheduledMatch)
    },
  },
})

export const { setDayMatches, deleteScheduledMatch, changeDateOfMatch, createScheduledMatch } = dayMatchesSlice.actions

export const initializeDayMatches = (startDate, endDate, matchTypeFilter, user, clubId) => {
  return async dispatch => {
    let url = `/calendar?startDate=${startDate}&endDate=${endDate}&matchFilter=${matchTypeFilter}`
    if ( clubId ) {
      url += `&clubId=${clubId}`
    }
    if ( user ) {
      url += `&userRole=${user.role}`
    }

    const matches = await chelService.getData(url)
    dispatch(setDayMatches(matches))
  }
}

export const deleteSchedule = (id) => {
  return async dispatch => {
    const res = await chelService.deleteScheduledMatch(id)
    const matchDate = res.data.matchDate
    dispatch(removeValidDate(matchDate))

    if ( res.status === 401 ) {
      dispatch(setNotification({ type: 'danger', text: 'Failed to delete game, please log in again', scope: 'MatchCardDashboard' }))
      window.localStorage.removeItem('loggedFBHLuser')
      dispatch(setUser(null))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } else if ( res.status === 200 ) {
      dispatch(deleteScheduledMatch(id))
      dispatch(setNotification({ type: 'success', text: 'Game was successfully deleted', scope: 'MatchCardDashboard' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }

    return res.status
  }
}

export const modifySchedule = (id, newMatch, oldMatchDate) => {
  return async dispatch => {
    const res = await chelService.updateScheduledMatch(id, newMatch)
    if ( res.status === 401 ) {
      dispatch(setNotification({ type: 'danger', text: 'Schedule change failed, please log in again', scope: 'MatchCardDashboard' }))
      window.localStorage.removeItem('loggedFBHLuser')
      dispatch(setUser(null))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } else if ( res.status === 200) {
      const newMatchDate = newMatch.matchDate
      dispatch(setNotification({ type: 'success', text: `Game was moved to ${dayjs(newMatch.matchDate).format('MMM D, YYYY')}`, scope: 'MatchCardDashboard' }))
      dispatch(removeValidDate(oldMatchDate))
      dispatch(addValidDate(newMatchDate))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)

      dispatch(changeDateOfMatch({ id, newMatch }))
    }
  }
}

export const createSchedule = (match) => {
  return async dispatch => {
    const matchDate = match.matchDate
    const newScheduledMatch = await chelService.createSchedueldMatch(match)
    dispatch(createScheduledMatch(newScheduledMatch))
    dispatch(addValidDate(matchDate))
  }
}

export default dayMatchesSlice.reducer