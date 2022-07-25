import React, { useContext, useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ThemeContext from './ThemeContext'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'
import chelService from '../services/api'

const LeaderDetailValue = ({ offset, position, name, playerId, teamId, value }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate('')

  const [ playerIndex, setPlayerIndex ] = useState(0)
  const sortField = useSelector(state => state.sortField)
  const lightTheme = useContext(ThemeContext).value === 'light'
  
  const itemsPerPage = 6
  const sort = sortField.descending ? 'desc' : 'asc'
  const statName = sortField.field

  useEffect(() => {
    const countUrl = `/playerData/pagination/count?skater=true`
    chelService.getData(countUrl).then(count => {
      const indexUrl = `/playerData/pagination/indexNum?skater=true&playerId=${playerId}&statName=${statName}&sort=${sort}&playerCount=${count}`
      chelService.getData(indexUrl).then(index => {
        setPlayerIndex(index)
      })
    })
  },[playerId, sort, statName])

  const handlePlayerClick = () => {
    const pageNum = Math.ceil(parseFloat(playerIndex + 1)/parseFloat(itemsPerPage))
    dispatch(setPlayersActivePage(pageNum))
    navigate(`/players?playerId=${playerId}`)
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