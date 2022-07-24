import { ScreenSearchDesktopSharp } from '@mui/icons-material'
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

export const initializePlayers = (num, playerCount, sortField, sortDir, skater, teamId, searchTerm) => {
  let url = `/playerData/pagination?pageNum=${num}`
  url += `&playerCount=${playerCount}`
  url += `&statName=${sortField}`
  url += `&sort=${sortDir}`
  url += `&skater=${skater}`
  
  if ( teamId.length > 0 ) {
    url += `&clubId=${teamId}`
  }

  if ( searchTerm && searchTerm.length > 0 ) {
    url += `&name=${searchTerm}`
  }
  
  return async dispatch => {
    const players = await chelService.getData(url)
    dispatch(setPlayers(players))
  }
}

export default paginatedPlayersSlice.reducer