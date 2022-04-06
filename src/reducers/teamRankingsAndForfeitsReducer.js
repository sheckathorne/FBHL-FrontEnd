import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const teamDataAndForfeitsSlice = createSlice({
  name: 'teamRankingsWithForfeits',
  initialState,
  reducers: {
    setTeamRankingsAndForfeits(_state, action) {
      return action.payload
    },
  },
})

export const { setTeamRankingsAndForfeits } = teamDataAndForfeitsSlice.actions

export default teamDataAndForfeitsSlice.reducer