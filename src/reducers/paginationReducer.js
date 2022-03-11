import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  matchActivePage: 1,
  playersActivePage: 1,
  teamsActivePage: 1,
  leagueStandingsPage: 1,
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
      return { ...state, leagueStandingsPage: action.payload }
    },
    setPlayerStandingsPage(state, action) {
      return { ...state, playerStandingsPage: action.payload }
    },
    resetPagination(state, action) {
      return {
        matchActivePage: 1,
        playersActivePage: 1,
        teamsActivePage: 1,
        leagueStandingsPage: 1,
        playerStandingsPage: 1
      }
    }
  },
})

export const { setMatchActivePage, setPlayerStandingsPage, setPlayersActivePage, setLeagueStandingsPage, setTeamsActivePage, resetPagination } = paginationSlice.actions

export default paginationSlice.reducer