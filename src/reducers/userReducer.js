import { createSlice } from '@reduxjs/toolkit'
import chelService from '../services/api'
import loginService from '../services/login'
import { setLoginIsOpen } from './viewToggleReducer'
import { setNotification } from './notificationReducer'

const initialState = { username: '', password: '', user: null }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername(state, action) {
      return { ...state, username: action.payload }
    },
    setPassword(state, action) {
      return { ...state, password: action.payload }
    },
    setUser(state, action) {
      return { ...state, user: action.payload }
    },
  },
})

export const { setUsername, setPassword, setUser } = userSlice.actions

export const loginUser = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({
      username: username.toLowerCase(), password,
    })

    window.localStorage.setItem(
      'loggedFBHLuser', JSON.stringify(user)
    )
    
    chelService.setToken(user.token)

    dispatch(setUser(user))
    dispatch(setLoginIsOpen(false))
    dispatch(setNotification({ type: 'success', text: `Logged in as ${username}`, scope: 'app' }))
    dispatch(setUsername(''))
    dispatch(setPassword(''))
  }
}

export default userSlice.reducer