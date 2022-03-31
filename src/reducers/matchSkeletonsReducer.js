import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'
import dayjs from 'dayjs'

const initialState = []

const matchesSkeletonSlice = createSlice({
  name: 'matchSkeletons',
  initialState,
  reducers: {
    setMatches(_state, action) {
      return action.payload
    },
  },
})

export const { setMatches, toggleMatchValidation } = matchesSkeletonSlice.actions

export const initializeMatchSkeletons = () => {
  return async dispatch => {
    const matches = await chelService.getData('/matchSkeletons')
    dispatch(setMatches(matches.map(match => ({ matchDate: dayjs.unix(match.timestamp).format('M/D/YYYY'), ...match }))))
  }
}

export default matchesSkeletonSlice.reducer