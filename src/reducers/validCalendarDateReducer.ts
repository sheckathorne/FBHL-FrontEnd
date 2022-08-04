import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

interface User {
  token: string,
  username: string,
  name: string,
  role: string
}

const initialState: string[] = []

const validCalendarDateSlice = createSlice({
  name: 'validCalendarDates',
  initialState,
  reducers: {
    setValidDates(_state, action) {
      return action.payload
    },
  },
})

export const { setValidDates } = validCalendarDateSlice.actions

export const initializeScheduleDates = (startDate: number, endDate: number, matchTypeFilter: string, user: User | null, clubId: string | null) => {
  return async dispatch => { 
    let url: string = `/calendar/displayDates?startDate=${startDate}&endDate=${endDate}&matchFilter=${matchTypeFilter}`
    if ( clubId ) {
      url += `&clubId=${clubId}`
    }
    if ( user ) {
      url += `&userRole=${user.role}`
    }
    const dates: string[] = await chelService.getData(url)
    dispatch(setValidDates(dates))
  }
}

export default validCalendarDateSlice.reducer