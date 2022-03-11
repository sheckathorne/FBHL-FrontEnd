import React from 'react'
import Nav from 'react-bootstrap/Nav'
import { Link, useLocation } from 'react-router-dom'

const AppNavItem = ({ eventKey, itemValue, itemTitle, route }) => {
  const baseUrl = (url) => ( url.indexOf('/', (url.indexOf('/') + 1)) > 0 ) ? url.substring(0,url.indexOf('/', (url.indexOf('/') + 1))) : url

  const currentUrl = useLocation().pathname
  const currentBaseUrl = baseUrl(currentUrl)
  const active = currentBaseUrl === route

  return (
    <Nav.Item>
      <Nav.Link
        as={Link}
        to={route}
        eventKey={eventKey}
        item-value={itemValue}
        item-title={itemTitle}
        active={active}
      >
        {itemTitle}
      </Nav.Link>
    </Nav.Item>
  )
}

export default AppNavItem