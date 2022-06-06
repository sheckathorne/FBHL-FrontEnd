import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const initialState: number = dayjs().startOf('day').unix()

const calendarSlice = createSlice({
  name: 'calendarSelectedDate',
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      return action.payload
    },
  },
})

export const { setSelectedDate } = calendarSlice.actions

export default calendarSlice.reducer