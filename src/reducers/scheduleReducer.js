import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'
import { setNotification, clearNotification } from './notificationReducer'
import dayjs from 'dayjs'

const initialState = []

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule(state, action) {
      return action.payload
    },
    deleteScheduledMatch(state, action) {
      const id = action.payload
      return state.filter(schedule => schedule._id !== id)
    },
    changeDateOfMatch(state, action) {
      const id = action.payload.id
      const newMatch = action.payload.newMatch
      return state.filter(match => match._id !== id).concat(newMatch)
    },
    createScheduledMatch(state, action) {
      const newScheduledMatch = action.payload
      state.push(newScheduledMatch)
    },
  },
})

export const { setSchedule, deleteScheduledMatch, createScheduledMatch, changeDateOfMatch } = scheduleSlice.actions

export const initializeSchedule = () => {
  return async dispatch => {
    const schedule = await chelService.getData('/schedule')
    dispatch(setSchedule(schedule))
  }
}

export const deleteSchedule = (id) => {
  return async dispatch => {
    const response = await chelService.deleteScheduledMatch(id)
    console.log(response)
    if ( response === 401 ) {
      dispatch(setNotification({ type: 'danger', text: 'Failed to delete game, please log in again', scope: 'MatchCardDashboard' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } else if ( response === 204 ) {
      dispatch(deleteScheduledMatch(id))
      dispatch(setNotification({ type: 'success', text: 'Game was successfully deleted', scope: 'MatchCardDashboard' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }

    return response.status
  }
}

export const modifySchedule = (id, newMatch) => {
  return async dispatch => {
    const response = await chelService.updateScheduledMatch(id, newMatch)
    if ( response.status === 401 ) {
      dispatch(setNotification({ type: 'danger', text: 'Schedule change failed, please log in again', scope: 'MatchCardDashboard' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } else if ( response.status === 200) {
      dispatch(setNotification({ type: 'success', text: `Game was moved to ${dayjs(newMatch.matchDate).format('MMM D, YYYY')}`, scope: 'MatchCardDashboard' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)

      dispatch(changeDateOfMatch({ id, newMatch }))
    }
  }
}

export const createSchedule = (match) => {
  return async dispatch => {
    const newScheduledMatch = await chelService.createSchedueldMatch(match)
    dispatch(createScheduledMatch(newScheduledMatch))
  }
}

export default scheduleSlice.reducer