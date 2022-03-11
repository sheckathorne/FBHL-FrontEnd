import React from 'react'
import { useNavigate } from 'react-router-dom'
import Col from 'react-bootstrap/Col'

const PlayerDetailExpandedRow = ({ playerName, playerId, players, itemsPerPage, statValue, rank, valueClass, handlePaginationClick }) => {
  const navigate = useNavigate('')
  const url = `/players?playerId=${playerId}`
  const playerIndex = players.findIndex(p => p.playerId === playerId)

  const handlePlayerClick = () => {
    navigate(url)
    handlePaginationClick(Math.ceil(parseFloat(playerIndex + 1)/parseFloat(itemsPerPage)),'players')
  }

  return (
    <>
      <Col xs={6} lg={4} className='ml-4 pointer-cursor' onClick={handlePlayerClick}>
        <small className={valueClass + ' stat-detail-row'}>{playerName}</small>
      </Col>
      <Col xs={3} lg={4} className='pointer-cursor' onClick={handlePlayerClick}>
        <small className={valueClass + ' stat-detail-row'}>{statValue}</small>
      </Col>
      <Col xs={3} lg={4} className='pointer-cursor' onClick={handlePlayerClick}>
        <small className={valueClass + ' stat-detail-row'}>{rank}</small>
      </Col>
    </>
  )
}

export default PlayerDetailExpandedRow