import { createSlice } from '@reduxjs/toolkit'

const initialState = { begin: 0, end: 0 }

const calendarRangeSlice = createSlice({
  name: 'timestampRangeOfSelectedDay',
  initialState,
  reducers: {
    setTimestampRange(state, action) {
      return action.payload
    },
  },
})

export const { setTimestampRange } = calendarRangeSlice.actions

export default calendarRangeSlice.reducer