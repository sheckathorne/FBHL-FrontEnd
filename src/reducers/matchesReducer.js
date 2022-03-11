import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'
import dayjs from 'dayjs'

const initialState = []

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches(state, action) {
      return action.payload
    },
  },
})

export const { setMatches } = matchesSlice.actions

export const initializeMatches = () => {
  return async dispatch => {
    const matches = await chelService.getData('/matchHistory')
    dispatch(setMatches(matches.map(match => ({ matchDate: dayjs.unix(match.timestamp).format('M/D/YYYY'), ...match }))))
  }
}

export default matchesSlice.reducer