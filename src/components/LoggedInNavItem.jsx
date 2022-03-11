import React from 'react'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { setCreateMatchIsOpen } from '../reducers/viewToggleReducer'
import { useDispatch } from 'react-redux'

const LoggedInNavItem = ({ username, handleLogout }) => {
  const dispatch = useDispatch()
  return (
    <NavDropdown title={username}>
      <NavDropdown.Item onClick={() => dispatch(setCreateMatchIsOpen(true))}>Create Future Match</NavDropdown.Item>
      <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
    </NavDropdown>
  )
}

export default LoggedInNavItem