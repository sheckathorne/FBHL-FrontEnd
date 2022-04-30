import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  resultsOpen: true,
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
    setCreateMatchIsOpen(state, action) {
      return { ...state, createMatchIsOpen: action.payload }
    },
    setLoginIsOpen(state, action) {
      return { ...state, loginIsOpen: action.payload }
    },               
  },
})

export const { setResultsOpen, setCreateMatchIsOpen, setLoginIsOpen } = viewToggleSlice.actions

export default viewToggleSlice.reducer