import React from 'react'
import { Form, Offcanvas, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const LoginSidebar = ({ username, password, handleSidebarAction, handleUsernameChange, handlePasswordChange, handleLogin }) => {
  const loginIsOpen = useSelector(state => state.viewToggle.loginIsOpen)
  
  return (
    <Offcanvas show={loginIsOpen} onHide={handleSidebarAction('close')}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          User Login
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={(e) => handleLogin(e, username, password)}>
          <Form.Group className='mb-3' controlId='formUserName'>
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter user name'
              onChange={({ target }) => handleUsernameChange(target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              onChange={({ target }) => handlePasswordChange(target.value)}
            />
          </Form.Group>
          <Button type='submit' variant='primary'>
            Submit
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default LoginSidebar