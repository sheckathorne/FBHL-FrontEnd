import { useEffect, useState } from 'react'
import PlayerCardDashboard from './PlayerCardDashboard'
import PaginationRow from './PaginationRow'
import { Row, Col } from 'react-bootstrap'
import paginationFunction from '../helpers/paginationFunction.js'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'
import chelService from '../services/api'

const PlayersAndPaginationDisplay = ({ playerIsRanked, playerSearch, rankedFilteredPlayers, itemsPerPage, delta, queriedPlayer, playerDetailStats, teamId }) => {
  const dispatch = useDispatch()
  const [ playerCount, setPlayerCount ] = useState('')

  const skaterOrGoalie = useSelector(state => state.skaterOrGoalie)
  const showingSkaters = skaterOrGoalie.field === 'skaters'

  useEffect(() => {
    const url = teamId ? 
      `/playerData/count/club?skater=${showingSkaters}&clubId=${teamId}` :
      `/playerData/count?skater=${showingSkaters}`
    
    chelService.getData(url).then(r => {
      setPlayerCount(r.count)
    })
  },[showingSkaters, teamId])
  
  const playersActivePage = useSelector(state => state.pagination.playersActivePage)

  const paginationClick = (type, num) => () => {
    switch(type) {
    case 'next':
      if ( playersActivePage < pageCount ) {
        const pageNum = playersActivePage + 1
        dispatch(setPlayersActivePage(pageNum))
      }
      break
    case 'prev':
      if ( playersActivePage > 1 ) {
        const pageNum = playersActivePage - 1
        dispatch(setPlayersActivePage(pageNum))
      }
      break
    case 'num':
      dispatch(setPlayersActivePage(num))
      break
    default:
      break
    }
  }

  const searchedPlayers = ( playerSearch === '' ) ? rankedFilteredPlayers : rankedFilteredPlayers.filter(player => player.playerName.toLowerCase().includes(playerSearch.toLowerCase()))
  const pageCount = Math.ceil(playerCount/itemsPerPage)
  const paginationItems = paginationFunction.generatePaginationItems(playersActivePage, pageCount, delta, paginationClick)
  const playerCardWidth = queriedPlayer ? 6 : 8
  const dashboardWidth = queriedPlayer ? 10 : 8

  const paginationDisplay = ( pageCount > 1 ) ? <Row><Col className='d-grid gap-2'><PaginationRow items={paginationItems} /></Col></Row> : null

  return (
    <>
      <Col xs={12} lg={dashboardWidth} className='mt-2'>
        <Row>
          <Col lg={playerCardWidth}>
            {paginationDisplay}
          </Col>
        </Row>
        <Row>
          <PlayerCardDashboard
            players={searchedPlayers}
            playerIsRanked={playerIsRanked}
            playerDetailStats={playerDetailStats}
            playerCardWidth={playerCardWidth}
          />
        </Row>
      </Col>
    </>
  )
}

export default PlayersAndPaginationDisplay