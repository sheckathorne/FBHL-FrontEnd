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

const paginatedPlayersSlice = createSlice({
  name: 'paginatedPlayers',
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

export const { setPlayers, sortPlayers } = paginatedPlayersSlice.actions

export const initializePlayers = (num, playerCount, sortField, sortDir, skater, teamId) => {
  if ( teamId.length === 0 ) {
    return async dispatch => {
      const players = await chelService.getData(`/playerData/pagination?pageNum=${num}&playerCount=${playerCount}&statName=${sortField}&sort=${sortDir}&skater=${skater}`)
      dispatch(setPlayers(players))
    }
  } else {
    return async dispatch => {
      const players = await chelService.getData(`/playerData/pagination/club?pageNum=${num}&playerCount=${playerCount}&statName=${sortField}&sort=${sortDir}&skater=${skater}&clubId=${teamId}`)
      dispatch(setPlayers(players))
    }
  }
}

export default paginatedPlayersSlice.reducer