import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  matchActivePage: 1,
  playersActivePage: 1,
  teamsActivePage: 1,
  leagueStandingsPage: {
    west: 1,
    east: 1
  },
  playerStandingsPage: 1
}

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setMatchActivePage(state, action) {
      return { ...state, matchActivePage: action.payload }
    },
    setPlayersActivePage(state, action) {
      return { ...state, playersActivePage: action.payload }
    },
    setTeamsActivePage(state, action) {
      return { ...state, teamsActivePage: action.payload }
    },
    setLeagueStandingsPage(state, action) {
      const division = action.payload.division

      if ( division === 'West' )
        return { ...state, leagueStandingsPage: {...state.leagueStandingsPage, west: action.payload.page } }
      else if ( division === 'East' ) {
        return { ...state, leagueStandingsPage: {...state.leagueStandingsPage, east: action.payload.page } }
      } else {
        return state
      }
    },
    setPlayerStandingsPage(state, action) {
      return { ...state, playerStandingsPage: action.payload }
    },
    resetPagination(_state, _action) {
      return initialState
    }
  },
})

export const { setMatchActivePage, setPlayerStandingsPage, setPlayersActivePage, setLeagueStandingsPage, setTeamsActivePage, resetPagination } = paginationSlice.actions

export default paginationSlice.reducer