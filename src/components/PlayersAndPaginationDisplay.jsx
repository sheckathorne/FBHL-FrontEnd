import { useEffect, useState } from 'react'
import PlayerCardDashboard from './PlayerCardDashboard'
import PaginationRow from './PaginationRow'
import { Row, Col } from 'react-bootstrap'
import paginationFunction from '../helpers/paginationFunction.js'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'
import chelService from '../services/api'

const PlayersAndPaginationDisplay = ({ playerIsRanked, rankedFilteredPlayers, itemsPerPage, delta, queriedPlayer, playerDetailStats, teamId, searchTerm }) => {
  const dispatch = useDispatch()
  const [ playerCount, setPlayerCount ] = useState('')

  const skaterOrGoalie = useSelector(state => state.skaterOrGoalie)
  const showingSkaters = skaterOrGoalie.field === 'skaters'

  useEffect(() => {
    function getUrl(teamId, searchTerm) {
      let url = `/playerData/pagination/count?skater=${showingSkaters}`

      if ( teamId ) {
        url += `&clubId=${teamId}`
      }

      if ( searchTerm.length > 0 ) {
        url += `&name=${searchTerm}`
      }

      return url
    }

    chelService.getData(getUrl(teamId, searchTerm)).then(count => {
      setPlayerCount(count)
    })
  },[showingSkaters, teamId, searchTerm])

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
            players={rankedFilteredPlayers}
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