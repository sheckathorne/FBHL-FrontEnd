import { createSlice } from '@reduxjs/toolkit'

const nonZeroPage = (page) => Math.max(page,1)

const initialState = {
  matchActivePage: 1,
  playersActivePage: 1,
  teamsActivePage: 1,
  conferencePage: 1,
  divisionPage: 1,
  playerType: 1,
  statId: 1
}

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setMatchActivePage(state, action) {
      return { ...state, matchActivePage: nonZeroPage(action.payload) }
    },
    setPlayersActivePage(state, action) {
      return { ...state, playersActivePage: nonZeroPage(action.payload) }
    },
    setTeamsActivePage(state, action) {
      return { ...state, teamsActivePage: nonZeroPage(action.payload) }
    },
    setPlayerStandingsPage(state, action) {
      return { ...state, playerStandingsPage: nonZeroPage(action.payload) }
    },
    setConferencePage(state, action) {
      return { ...state, conferencePage: nonZeroPage(action.payload) }
    },
    setDivisionPage(state, action) {
      return { ...state, divisionPage: nonZeroPage(action.payload) }
    },
    setPlayerType(state, action) {
      return { ...state, playerType: nonZeroPage(action.payload) }
    },
    setStatId(state, action) {
      return { ...state, statId: nonZeroPage(action.payload) }
    },
    resetPagination(_state, _action) {
      return initialState
    }
  },
})

export const { 
  setMatchActivePage,
  setPlayerStandingsPage,
  setPlayersActivePage,
  setTeamsActivePage,
  resetPagination,
  setConferencePage,
  setDivisionPage,
  setPlayerType,
  setStatId
} = paginationSlice.actions

export default paginationSlice.reducer