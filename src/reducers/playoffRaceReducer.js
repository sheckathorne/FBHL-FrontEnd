import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const playoffRaceSlice = createSlice({
  name: 'playoffRace',
  initialState,
  reducers: {
    setPlayoffRace(_state, action) {
      return action.payload
    },
  },
})

export const { setPlayoffRace } = playoffRaceSlice.actions

export default playoffRaceSlice.reducer