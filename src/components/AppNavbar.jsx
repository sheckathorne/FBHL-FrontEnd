import React from 'react'
import { Navbar, Container, Nav, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AppNavGroup from './AppNavGroup'

const AppNavbar = ({ handleSwitch, theme }) => {
  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          <Image className='d-inline-block align-top navbar-logo' alt='logo' src={require('../resources/logo192.png')} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='justify-content-start flex-grow-1 pe-3'>
            <AppNavGroup
              handleSwitch={handleSwitch}
              theme={theme}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar