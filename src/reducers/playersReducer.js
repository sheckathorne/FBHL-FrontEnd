import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

const initialState = { skaters: [], goaltenders: [] }

const sortPlayers = (players, sortField) => {
  players.sort((a,b) => {
    let n = 0
    if ( sortField.reversed ) {
      if ( sortField.descending ) {
        n = a[`${sortField.field}`] - b[`${sortField.field}`]
      } else {
        n = b[`${sortField.field}`] - a[`${sortField.field}`]
      }
    } else {
      if ( sortField.descending ) {
        n = b[`${sortField.field}`] - a[`${sortField.field}`]
      } else {
        n = a[`${sortField.field}`] - b[`${sortField.field}`]
      }
    }

    
    if ( n !== 0) {
      return n
    } else {
      if ( sortField.secondaryReversed ) {
        return b[`${sortField.secondaryField}`] - a[`${sortField.secondaryField}`]
      } else {
        return a[`${sortField.secondaryField}`] - b[`${sortField.secondaryField}`]
      }
    }
  })

  return players
}

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setSkaters(state, action) {
      return state = { ...state, skaters: action.payload }
    },
    setGoaltenders(state, action) {
      const goaltenders = action.payload
      return state = { ...state, goaltenders: goaltenders.map(goaltender => ({ ...goaltender, gkwinpct: parseFloat(goaltender.gkwins/goaltender.gkGamesPlayed).toFixed(3).toString() })) }
    },
    sortSkaters(state, action) {
      const sortField = action.payload
      const players = state.skaters
      state = { skaters: sortPlayers(players, sortField), goaltenders: state.goaltenders }
    },
    sortGoaltenders(state, action) {
      const sortField = action.payload
      const players = state.goaltenders
      state = { skaters: state.skaters, goaltenders: sortPlayers(players, sortField) }
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