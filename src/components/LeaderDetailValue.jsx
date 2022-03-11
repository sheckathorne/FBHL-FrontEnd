import React, { useContext } from 'react'
import { Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ThemeContext from './ThemeContext'
import { useDispatch } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'

const LeaderDetailValue = ({ offset, position, name, playerId, teamId, value, players }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate('')
  const lightTheme = useContext(ThemeContext).value === 'light'
  const playerIndex = players.skaters.filter(player => player.teamId === teamId).findIndex(p => p.playerId === playerId)
  const itemsPerPage = 6
  
  const handlePlayerClick = () => {
    const pageNum = Math.ceil(parseFloat(playerIndex + 1)/parseFloat(itemsPerPage))
    dispatch(setPlayersActivePage(pageNum))
    navigate(`/players/${teamId}?playerId=${playerId}`)
  }

  return (
    <>
      <Col xs={{ span: 1, offset: offset }} className='my-auto text-center pointer-cursor' onClick={handlePlayerClick}>
        <h6><small className="text-muted">{position}</small></h6>
      </Col>
      <Col xs={3} className='my-auto pointer-cursor' onClick={handlePlayerClick}>
        <h6 className={lightTheme ? '' : 'dark-theme-text'}><small>{name} ({ value })</small></h6>
      </Col>
    </>
  )
}

export default LeaderDetailValue