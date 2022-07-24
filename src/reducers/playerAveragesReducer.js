import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

const initialState = {}

const playerAveragesSlice = createSlice({
  name: 'playerAverages',
  initialState,
  reducers: {
    setAverages(_state, action) {
      return action.payload
    },
  },
})

export const { setAverages } = playerAveragesSlice.actions

export const initializeAverages = () => {
  return async dispatch => {
    const averages = await chelService.getData('/statAverages')
    dispatch(setAverages(averages))
  }
}

export default playerAveragesSlice.reducer