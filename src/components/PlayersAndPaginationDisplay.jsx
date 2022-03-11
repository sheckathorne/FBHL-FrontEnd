import React from 'react'
import PlayerCardDashboard from './PlayerCardDashboard'
import PaginationRow from './PaginationRow'
import { Row, Col } from 'react-bootstrap'
import paginationFunction from '../helpers/paginationFunction.js'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'

const PlayersAndPaginationDisplay = ({ sortField, playerIsRanked, playerSearch, rankedFilteredPlayers, itemsPerPage, delta, queriedPlayer, playerDetailStats }) => {
  const dispatch = useDispatch()
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
  const displayedPlayers = searchedPlayers.slice((playersActivePage - 1) * itemsPerPage, ((playersActivePage - 1) * itemsPerPage) + itemsPerPage)
  const pageCount = Math.ceil(searchedPlayers.length/itemsPerPage)
  const paginationItems = paginationFunction.generatePaginationItems(playersActivePage, pageCount, delta, paginationClick)
  const playerCardWidth = queriedPlayer ? 6 : 8

  const paginationDisplay = ( pageCount > 1 ) ? <Row><Col className='d-grid gap-2'><PaginationRow items={paginationItems} /></Col></Row> : null

  return (
    <>
      <Col xs={12} lg={8} className='mt-2'>
        <Row>
          <Col lg={playerCardWidth}>
            {paginationDisplay}
          </Col>
        </Row>
        <Row>
          <PlayerCardDashboard
            players={displayedPlayers}
            sortField={sortField}
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