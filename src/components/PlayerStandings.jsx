import React, { useContext } from 'react'
import data from '../helpers/data.js'
import functions from '../helpers/tableGenerator'
import { Row, Col, Collapse } from 'react-bootstrap'
import { makeStyles } from '@mui/styles'
import BootstrapTable from './BootstrapTable'
import { AiOutlineCaretRight, AiOutlineCaretDown } from 'react-icons/ai'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MobileContext from './MobileContext'
import generateRankNumber from '../helpers/rankFunction'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayerStandingsPage } from '../reducers/paginationReducer'
import { setPlayerOpen } from '../reducers/viewToggleReducer.js'

const PlayerStandings = ({ lightTheme, handleTableClick }) => {
  const dispatch = useDispatch()
  const players = useSelector(state => state.players)
  const playerStandingsPage = useSelector(state => state.pagination.playerStandingsPage)
  const playerOpen = useSelector(state => state.viewToggle.playerOpen)
  const isMobile = useContext(MobileContext)
  const caret = playerOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const topPlayers = data.topPlayers
  const numberOfPlayers = 10
  const paginationSize = isMobile ? 'small' : 'medium'
  const top = topPlayers.find((t,i) => i+1 === playerStandingsPage)
  let table = null

  const useStyles = makeStyles(() => {
    if ( !lightTheme ) {
      return (
        {
          ul: {
            '& .MuiPaginationItem-root': {
              color: '#fff'
            }
          }
        }
      )
    }
  })

  const handlePlayerPaginationChange = (e,n) => {
    dispatch(setPlayerStandingsPage(n))
  }

  const rankThePlayers = (players, sortField) =>
    players.map((player,i) => {
      const allPlayersStatValue = players.map(player => player[`${sortField.field}`])
      const currentPlayerStatValue = player[`${sortField.field}`]
      return { rank: generateRankNumber(i, allPlayersStatValue, currentPlayerStatValue), ...player }
    })

  const showTenPlayersOrLess = (players) => {
    for ( let i = numberOfPlayers; i > 0; i-- ) {
      const filteredPlayers = players.filter(player => player.rank <= i)
      if ( filteredPlayers.length <= i ) {
        return filteredPlayers
      }
    }
  }

  const classes = useStyles()

  if ( players.skaters ) {
    const playersCopy = [...players.skaters].sort((a,b) => b[`${top.sortField.field}`] - a[`${top.sortField.field}`])
    const rankedPlayers = rankThePlayers(playersCopy, top.sortField)
    const rankedFilteredPlayers = rankedPlayers.filter(player => player.rank <= numberOfPlayers)
    const reducedPlayers = showTenPlayersOrLess(rankedFilteredPlayers)
    const maxReducedRank = Math.max(...reducedPlayers.map(player => player.rank))
    const nextPlayersRank = Math.min(...rankedFilteredPlayers.filter(player => player.rank > maxReducedRank).map(player => player.rank))
    
    const summaryObj = reducedPlayers < rankedFilteredPlayers && reducedPlayers.length < 10 ?
    {
      additionalPlayers: rankedFilteredPlayers.filter(player => player.rank === nextPlayersRank).length,
      nextRank: nextPlayersRank
    } : null

    table = (
      <>
        <BootstrapTable
          title={top.title}
          columns={functions.generateStandingsColumns(data.playerStandingsColumns, top.stat, themeClass)}
          data={functions.generatePlayerStandingData(reducedPlayers, top.sortField.field, themeClass)}
          hover={true}
          responsive={true}
          striped={false}
          variant={lightTheme ? 'light' : 'dark'}
          themeClass={themeClass}
          size={isMobile ? 'sm' : ''}
          sortField={top.sortField}
          handleTableClick={handleTableClick}
          type='players'
          summaryObj={summaryObj}
          rankedPlayers={rankedPlayers}
        />
      </>
    )
  }

  const clickableTitle = isMobile ? (
    <Col className='' onClick={() => dispatch(setPlayerOpen(!playerOpen))}>
      <h5 className={themeClass + ' tiny-caps section-title'}>Top Players {caret}</h5>
    </Col>
  ) : (
    <Col className=''>
      <h5 className={themeClass + ' tiny-caps section-title'}>Top Players</h5>
    </Col>
  )

  const pagination = playerOpen ? (
    <Col className='d-flex justify-content-end'>
      <Stack spacing={2}>
        <Pagination
          classes={{ ul: classes.ul }}
          count={3}
          color='primary'
          size={paginationSize}
          variant='outlined'
          onChange={handlePlayerPaginationChange}
          page={playerStandingsPage}
          renderItem={(item) => {
            if ( item.page === 1 ) {
              item = { ...item, page: 'Pts' }
            } else if ( item.page === 2 ) {
              item = { ...item, page: 'Gls' }
            } else if ( item.page === 3 ) {
              item = { ...item, page: 'Ast' }
            }

            return (
              <PaginationItem
                components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}}
        />
      </Stack>
    </Col>
  ) : null

  return (
    <>
      <Row className='table-title d-flex align-items-center'>
        {clickableTitle}
      </Row>
      <Collapse in={playerOpen}>
        <div>
          <Row>
            <Col className='mt-1'>
              <h5 className={themeClass + ' tiny-caps section-title'}>{top.title}</h5>
            </Col>
            {pagination}
          </Row>
          {table}
        </div>
      </Collapse>
    </>
  )
}

export default PlayerStandings