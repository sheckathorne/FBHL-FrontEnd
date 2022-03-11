import React from 'react'
import NavDropdown from 'react-bootstrap/NavDropdown'

const LoggedInNavItem = ({ username, handleLogout, setCreateMatchIsOpen }) => {
  return (
    <NavDropdown title={username}>
      <NavDropdown.Item onClick={() => setCreateMatchIsOpen(true)}>Create Future Match</NavDropdown.Item>
      <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
    </NavDropdown>
  )
}

export default LoggedInNavItem