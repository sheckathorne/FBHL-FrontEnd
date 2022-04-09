import React, { useContext } from 'react'
import Col from 'react-bootstrap/Col'
import MobileContext from './MobileContext'

const StatRowCol = ({ value, bold, themeTextClass, aPlayerIsSelelected }) => {
  const isMobile = useContext(MobileContext)
  const statColClass = isMobile ? 'stat-col-text' : 'stat-col-lg'
  const boldClass = bold ? 'fw-bolder' : 'fw-light'
  const playerIsSelectedClass = aPlayerIsSelelected ? ' selected-player-stat-row' : ''

  return (
    <Col className={`text-center ${statColClass} ${themeTextClass} ${boldClass}${playerIsSelectedClass}`}>{value}</Col>
  )
}

export default StatRowCol