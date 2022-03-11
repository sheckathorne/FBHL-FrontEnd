import React, { useContext } from 'react'
import Col from 'react-bootstrap/Col'
import MobileContext from './MobileContext'

const StatRowCol = ({ value, bold, themeTextClass }) => {
  const isMobile = useContext(MobileContext)
  const statColClass = isMobile ? 'stat-col-text' : ''
  const boldClass = bold ? 'fw-bolder' : 'fw-light'

  return (
    <Col className={`text-center ${statColClass} ${themeTextClass} ${boldClass}`}>{value}</Col>
  )
}

export default StatRowCol