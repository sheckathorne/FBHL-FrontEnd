import React from 'react'
import AppNavItem from './AppNavItem'
import LoggedInNavItem from './LoggedInNavItem'
import Nav from 'react-bootstrap/Nav'
import data from '../helpers/data.js'
import Switch from '@mui/material/Switch'
import { useDispatch, useSelector } from 'react-redux'
import { setLoginIsOpen } from '../reducers/viewToggleReducer'


const AppNavGroup = ({ handleSwitch, theme }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)

  const loginForm = user === null ?
    <Nav.Item><Nav.Link onClick={() => dispatch(setLoginIsOpen(true))}>Login</Nav.Link></Nav.Item> :
    <LoggedInNavItem 
      username={user.username}                
    />

  return (
    <>
      {data.dashboardButtons.map(dashboardListItem =>
        <AppNavItem
          key={dashboardListItem.id}
          eventKey={dashboardListItem.id}
          itemValue={dashboardListItem.value}
          itemTitle={dashboardListItem.name}
          route={dashboardListItem.route}
        />
      )}
      {loginForm}
      <Nav.Item>
        <Switch
          defaultChecked
          onChange={() => handleSwitch(theme.value)}
        />
      </Nav.Item>
    </>
  )
}

export default AppNavGroup