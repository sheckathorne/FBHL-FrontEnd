import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

const initialState = []

const teamRankingsSlice = createSlice({
  name: 'teamRankings',
  initialState,
  reducers: {
    setTeamRankings(_state, action) {
      return action.payload
    },
  },
})

export const { setTeamRankings } = teamRankingsSlice.actions

export const initializeTeamRankings = () => {
  return async dispatch => {
    const teamRankings = await chelService.getData('/teamRankings')
    dispatch(setTeamRankings(teamRankings.sort((a,b) => a.rank - b.rank)))
  }
}

export default teamRankingsSlice.reducer