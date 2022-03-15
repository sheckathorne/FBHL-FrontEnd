import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

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
    dispatch(deleteScheduledMatch(id))
    return response.status
  }
}

export const modifySchedule = (id, newMatch) => {
  return async dispatch => {
    const response = await chelService.updateScheduledMatch(id, newMatch)
    dispatch(changeDateOfMatch({ id, newMatch }))
    return response.status
  }
}

export const createSchedule = (match) => {
  return async dispatch => {
    const newScheduledMatch = await chelService.createSchedueldMatch(match)
    dispatch(createScheduledMatch(newScheduledMatch))
  }
}

export default scheduleSlice.reducer