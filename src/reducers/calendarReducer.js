import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const initialState = dayjs().startOf('day').unix()

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      return action.payload
    },
  },
})

export const { setSelectedDate } = calendarSlice.actions

export default calendarSlice.reducer