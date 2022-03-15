import React from 'react'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { setCreateMatchIsOpen } from '../reducers/viewToggleReducer'
import { useDispatch } from 'react-redux'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'

const LoggedInNavItem = ({ username }) => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(setNotification({ type: 'success', text: 'You have successfully logged out', scope: 'app' }))
    window.localStorage.removeItem('loggedFHBLuser')
    setTimeout(() => {
      dispatch(clearNotification())
    }, 3000)
    dispatch(setUser(null))
  }
  return (
    <NavDropdown title={username}>
      <NavDropdown.Item onClick={() => dispatch(setCreateMatchIsOpen(true))}>Create Future Match</NavDropdown.Item>
      <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
    </NavDropdown>
  )
}

export default LoggedInNavItem