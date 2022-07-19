import React from 'react'
import Nav from 'react-bootstrap/Nav'
import { Link, useLocation } from 'react-router-dom'

interface AppNavItemProps {
  eventKey: number,
  itemValue: string,
  itemTitle: string,
  route: string}

const AppNavItem = ({ eventKey, itemValue, itemTitle, route }: AppNavItemProps) => {
  const baseUrl = (url: string): string => ( url.indexOf('/', (url.indexOf('/') + 1)) > 0 ) ? url.substring(0,url.indexOf('/', (url.indexOf('/') + 1))) : url

  const currentUrl: string = useLocation().pathname
  const currentBaseUrl: string = baseUrl(currentUrl)
  const active: boolean = currentBaseUrl === route

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