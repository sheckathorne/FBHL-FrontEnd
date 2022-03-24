import React from 'react'
import { Form, Offcanvas, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setUsername, setPassword, loginUser } from '../reducers/userReducer'
import { setLoginIsOpen } from '../reducers/viewToggleReducer'
import { clearNotification, setNotification } from '../reducers/notificationReducer'


const LoginSidebar = () => {
  const loginIsOpen = useSelector(state => state.viewToggle.loginIsOpen)
  const username = useSelector(state => state.user.username)
  const password = useSelector(state => state.user.password)
  const dispatch = useDispatch()

  const handleLogin = (e, username, password) => {
    e.preventDefault()
    
    try {
      dispatch(loginUser(username, password)).unwrap()
      setTimeout(() => {
        dispatch(clearNotification())
      }, 3000)
    } catch (exception) {
      dispatch(setLoginIsOpen(false))
      dispatch(setNotification({ type: 'danger', text: 'Login failed - Bad credentials', scope: 'app' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 3000)
    }
  }
  
  return (
    <Offcanvas show={loginIsOpen} onHide={() => dispatch(setLoginIsOpen(false))}>
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
              onChange={({ target }) => dispatch(setUsername(target.value))}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              onChange={({ target }) => dispatch(setPassword(target.value))}
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