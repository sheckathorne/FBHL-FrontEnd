import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

const initialState = { skaters: [], goaltenders: [] }

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setSkaters(state, action) {
      return state = { ...state, skaters: action.payload }
    },
    setGoaltenders(state, action) {
      return state = { ...state, goaltenders: action.payload }
    },
    sortSkaters(state, action) {
      const sortField = action.payload

      if ( sortField.field ) {
        if (sortField.alpha) {
          if ( sortField.descending ) {
            state = { skaters: state.skaters.sort((b, a) => a[`${sortField.field}`].localeCompare(b[`${sortField.field}`])), goaltenders: state.goaltenders }
          } else {
            state = { skaters: state.skaters.sort((a, b) => a[`${sortField.field}`].localeCompare(b[`${sortField.field}`])), goaltenders: state.goaltenders }
          }
        } else {
          if ( sortField.descending ) {
            state = { skaters: state.skaters.sort((b, a) => a[`${sortField.field}`] - b[`${sortField.field}`]), goaltenders: state.goaltenders }
          } else {
            state ={ skaters: state.skaters.sort((a, b) => a[`${sortField.field}`] - b[`${sortField.field}`]), goaltenders: state.goaltenders }
          }
        }
      }
    },
    sortGoaltenders(state, action) {
      return state
    },
  },
})

export const { setSkaters, setGoaltenders, sortSkaters, sortGoaltenders } = playersSlice.actions

export const intializePlayers = () => {
  return async dispatch => {
    const players = await chelService.getData('/playerData')
    dispatch(setSkaters(players.filter(player => player.skater)))
    dispatch(setGoaltenders(players.filter(player => !player.skater)))
  }
}

export default playersSlice.reducer