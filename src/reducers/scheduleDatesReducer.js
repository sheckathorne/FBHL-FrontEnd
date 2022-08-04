import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

const initialState = []

const scheduleDatesSlice = createSlice({
  name: 'scheduleDates',
  initialState,
  reducers: {
    setSchedule(_state, action) {
      return action.payload
    },
  },
})

export const { setSchedule } = scheduleDatesSlice.actions

export const initializeScheduleDates = (startDate, endDate, clubId) => {
  return async dispatch => {
    let url = `/schedule/dates/fromRange?startDate=${startDate}&endDate=${endDate}`
    if ( clubId ) {
      url += `$clubId=${clubId}`
    }
    const dates = await chelService.getData(url)
    dispatch(setSchedule(dates))
  }
}


export default scheduleDatesSlice.reducer