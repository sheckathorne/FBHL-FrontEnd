import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  resultsOpen: true,
  leagueOpen: true,
  playerOpen: true,
  createMatchIsOpen: false,
  loginIsOpen: false,
}

const viewToggleSlice = createSlice({
  name: 'viewToggle',
  initialState,
  reducers: {
    setResultsOpen(state, action) {
      return { ...state, resultsOpen: action.payload }
    },
    setLeagueOpen(state, action) {    
      return { ...state, leagueOpen: action.payload }
    },
    setPlayerOpen(state, action) {
      return { ...state, playerOpen: action.payload }
    },
    setCreateMatchIsOpen(state, action) {
      return { ...state, createMatchIsOpen: action.payload }
    },
    setLoginIsOpen(state, action) {
      return { ...state, loginIsOpen: action.payload }
    },               
  },
})

export const { setResultsOpen, setLeagueOpen, setPlayerOpen, setCreateMatchIsOpen, setLoginIsOpen } = viewToggleSlice.actions

export default viewToggleSlice.reducer