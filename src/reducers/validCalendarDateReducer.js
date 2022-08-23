import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

const initialState = []

const validCalendarDateSlice = createSlice({
  name: 'validCalendarDates',
  initialState,
  reducers: {
    setValidDates(_state, action) {
      return action.payload
    },
    addValidDate(state, action) {
      const matchDate = action.payload
      state[matchDate] = ( state[matchDate] || 0 ) + 1
    },
    removeValidDate(state, action) {
      const matchDate = action.payload
      state[matchDate] = ( state[matchDate] || 1 ) - 1
    },
  },
})

export const { setValidDates, addValidDate, removeValidDate } = validCalendarDateSlice.actions

export const initializeValidDates = (startDate, endDate, matchTypeFilter, user, clubId) => {
  return async dispatch => { 
    let url = `/calendar/displayDates?startDate=${startDate}&endDate=${endDate}&matchFilter=${matchTypeFilter}`
    if ( clubId ) {
      url += `&clubId=${clubId}`
    }
    if ( user ) {
      url += `&userRole=${user.role}`
    }
    
    const dates = await chelService.getData(url)
    dispatch(setValidDates(dates))    
  }
}

export default validCalendarDateSlice.reducer