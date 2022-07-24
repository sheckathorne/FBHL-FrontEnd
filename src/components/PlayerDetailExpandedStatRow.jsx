import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Col from 'react-bootstrap/Col'
import { useDispatch } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'
import chelService from '../services/api'

const PlayerDetailExpandedRow = ({ player, players, itemsPerPage, statValue, rank, valueClass }) => {
  const navigate = useNavigate('')
  const dispatch = useDispatch()

  const sortField = useSelector(state => state.sortField)
  const sort = sortField.descending ? 'desc' : 'asc'
  const statName = sortField.field
  console.log(player)
  const statVal = player[statName]
  const playerName = player.playerName
  const playerId = player.playerId
  const to_url = `/players?playerId=${playerId}`
  const playerIndex = players.findIndex(p => p.playerId === playerId)

  const handlePlayerClick = () => {
    const url = `/playerData/pagination/indexNum?skater=true&playerId=${playerId}&statName=${statName}&sort=${sort}`
    chelService.getData(url).then(index => {

      const pageNum = Math.ceil(parseFloat(index + 1)/parseFloat(itemsPerPage))
      dispatch(setPlayersActivePage(pageNum))
      navigate(to_url)
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