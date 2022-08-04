import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

const initialState: string[] = []

const dayScheduleSlice = createSlice({
  name: 'daySchedule',
  initialState,
  reducers: {
    setDaySchedule(_state, action) {
      return action.payload
    },
  },
})

export const { setDaySchedule } = dayScheduleSlice.actions

export const initializeDaySchedule = (startDate: number, endDate: number, clubId: string | null) => {
  return async dispatch => { 
    let url: string = `/calendar/daySchedule?startDate=${startDate}&endDate=${endDate}`
    if ( clubId ) {
      url += `&clubId=${clubId}`
    }

    const dates: string[] = await chelService.getData(url)
    dispatch(setDaySchedule(dates))
  }
}

export default dayScheduleSlice.reducer