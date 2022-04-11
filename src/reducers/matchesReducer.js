/*
import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'
import dayjs from 'dayjs'

const initialState = []

const newInvalidMatchDetailsSlice = createSlice({
  name: 'newInvalidMatchDetails',
  initialState,
  reducers: {
    addInvalidMatchDetail(state, action) {
      state.push(action.payload)
    },
    removeInvalidMatchDetail(state, action) {
      return state.filter(match => match.matchId !== action.payload)
    }
  },
})

export const { addInvalidMatchDetail, toggleMatchValidation } = newInvalidMatchDetailsSlice.actions

export const initializeMatches = () => {
  return async dispatch => {
    const matches = await chelService.getData('/matchHistory')
    const invalidMatches = await chelService.getData('/invalidMatches')
    dispatch(setMatches(matches.map(match => ({ matchDate: dayjs.unix(match.timestamp).format('M/D/YYYY'), invalid: invalidMatches.map(invalidMatch => invalidMatch.matchId).includes(match.matchId), ...match }))))
  }
}

export default newInvalidMatchDetailsSlice.reducer
*/