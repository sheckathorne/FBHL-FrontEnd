import React from 'react'
import PlayerCardDashboard from './PlayerCardDashboard'
import PaginationRow from './PaginationRow'
import { Row, Col } from 'react-bootstrap'
import paginationFunction from '../helpers/paginationFunction.js'

const PlayersAndPaginationDisplay = ({ sortField, playerIsRanked, playerSearch, rankedFilteredPlayers, playersActivePage, itemsPerPage, delta, handlePaginationClick, queriedPlayer, playerDetailStats }) => {
  const paginationClick = (type, num) => () => {
    switch(type) {
    case 'next':
      if ( playersActivePage < pageCount ) {
        handlePaginationClick(playersActivePage + 1, 'players')
      }
      break
    case 'prev':
      if ( playersActivePage > 1 ) {
        handlePaginationClick(playersActivePage - 1, 'players')
      }
      break
    case 'num':
      handlePaginationClick(num, 'players')
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