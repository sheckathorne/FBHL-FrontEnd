import { createSlice } from '@reduxjs/toolkit'

const initialState = { field: 'gksvpct', descending: true, alpha: false, reversed: false }

const goaltenderSortSlice = createSlice({
  name: 'gkSortField',
  initialState,
  reducers: {
    setSortField(_state, action) {
      return action.payload
    },
  },
})

export const { setSortField } = goaltenderSortSlice.actions

export default goaltenderSortSlice.reducer