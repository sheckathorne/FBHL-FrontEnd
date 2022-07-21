import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'

const initialState = []

const playerSort = (players, sortField) => {
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

const topPlayersSlice = createSlice({
  name: 'topPlayers',
  initialState,
  reducers: {
    setPlayers(state, action) {
      return state = action.payload
    },
    sortPlayers(state, action) {
      const sortField = action.payload
      const players = state
      state = playerSort(players, sortField)
    },
  },
})

export const { setPlayers, sortPlayers } = topPlayersSlice.actions

export const intializePlayers = (num, sortField, sortDir) => {
  return async dispatch => {
    const players = await chelService.getData(`/playerData/top?num=${num}&statName=${sortField}&sort=${sortDir}`)
    dispatch(setPlayers(players))
  }
}

export default topPlayersSlice.reducer