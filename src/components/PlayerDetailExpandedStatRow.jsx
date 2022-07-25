import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Col from 'react-bootstrap/Col'
import { useDispatch } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'
import chelService from '../services/api'

const PlayerDetailExpandedRow = ({ player, itemsPerPage, statValue, rank, valueClass }) => {
  const navigate = useNavigate('')
  const dispatch = useDispatch()

  const sortField = useSelector(state => state.sortField)
  const sort = sortField.descending ? 'desc' : 'asc'
  const statName = sortField.field
  const playerName = player.playerName
  const playerId = player.playerId
  const to_url = `/players?playerId=${playerId}`

  const handlePlayerClick = () => {
    const countUrl = `/playerData/pagination/count?skater=true`
    chelService.getData(countUrl).then(count => {
      const indexUrl = `/playerData/pagination/indexNum?skater=true&playerId=${playerId}&statName=${statName}&sort=${sort}&playerCount=${count}`
      chelService.getData(indexUrl).then(index => {
        const pageNum = Math.ceil(parseFloat(index + 1)/parseFloat(itemsPerPage))
        dispatch(setPlayersActivePage(pageNum))
        navigate(to_url)
      })
    })
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