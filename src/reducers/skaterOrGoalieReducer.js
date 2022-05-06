import { createSlice } from '@reduxjs/toolkit'

const initialState = { field: 'skaters' }

const skaterOrGoalieSlice = createSlice({
  name: 'skaterOrGoalie',
  initialState,
  reducers: {
    setSkaterOrGoalie(_state, action) {
      return action.payload
    },
  },
})

export const { setSkaterOrGoalie } = skaterOrGoalieSlice.actions

export default skaterOrGoalieSlice.reducer