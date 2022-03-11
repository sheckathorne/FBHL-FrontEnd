import React from 'react'
import AppNavItem from './AppNavItem'
import LoggedInNavItem from './LoggedInNavItem'
import Nav from 'react-bootstrap/Nav'
import data from '../helpers/data.js'
import Switch from '@mui/material/Switch'


const AppNavGroup = ({ handleSwitch, theme, user, handleSidebarAction, handleLogout, setCreateMatchIsOpen }) => {
  const loginForm = user === null ?
    <Nav.Item><Nav.Link onClick={handleSidebarAction('open')}>Login</Nav.Link></Nav.Item> :
    <LoggedInNavItem 
      username={user.username}
      handleLogout={handleLogout}
      setCreateMatchIsOpen={setCreateMatchIsOpen}
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