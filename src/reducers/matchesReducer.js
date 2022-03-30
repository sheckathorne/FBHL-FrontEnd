import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'
import dayjs from 'dayjs'

const initialState = []

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches(_state, action) {
      return action.payload
    },
    toggleMatchValidation(state, action) {
      const matchId = action.payload
      return state.map(match => match.matchId === matchId ? { ...match, invalid: !match.invalid } : match )
    }
  },
})

export const { setMatches, toggleMatchValidation } = matchesSlice.actions

export const initializeMatches = () => {
  return async dispatch => {
    const matches = await chelService.getData('/matchHistory')
    const invalidMatches = await chelService.getData('/invalidMatches')
    dispatch(setMatches(matches.map(match => ({ matchDate: dayjs.unix(match.timestamp).format('M/D/YYYY'), invalid: invalidMatches.map(invalidMatch => invalidMatch.matchId).includes(match.matchId), ...match }))))
  }
}

export default matchesSlice.reducer