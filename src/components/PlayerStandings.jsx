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
import MobileContext from './MobileContext'
import generateRankNumber from '../helpers/rankFunction'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayerType, setStatId } from '../reducers/paginationReducer'
import { setPlayerOpen } from '../reducers/viewToggleReducer.js'

const PlayerStandings = ({ lightTheme, handleTableClick }) => {
  const dispatch = useDispatch()
  const players = useSelector(state => state.players)
  const playerOpen = useSelector(state => state.viewToggle.playerOpen)
  const isMobile = useContext(MobileContext)
  const playerTypeId = useSelector(state => state.pagination.playerType)
  const statId = useSelector(state => state.pagination.statId)
  const caret = playerOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const numberOfPlayers = 8
  const paginationSize = isMobile ? 'small' : 'medium'
  const playerRankings = data.playerRankings
  const selectedPlayerType = playerRankings.find(playerType => playerType.id === playerTypeId)
  const selectedStat = selectedPlayerType.playerTypeStats.find(stat => stat.statId === statId)
  const sortField = { field: selectedStat.statName, descending: true, reversed: selectedStat.statReversed }
  let table = null

  const handlePlayerTypeChange = (_e,n) => {
    dispatch(setPlayerType(n))
    dispatch(setStatId(1))
  }

  const handleStatIdChange = (_e,n) => {
    dispatch(setStatId(n))
  }

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

  const rankThePlayers = (players, sortField) =>
    players.map((player,i) => {
      const allPlayersStatValue = players.map(player => player[`${sortField.field}`])
      const currentPlayerStatValue = player[`${sortField.field}`]
      return { rank: generateRankNumber(i, allPlayersStatValue, currentPlayerStatValue), ...player }
    })

  const showNumOfPlayersOrLess = (players) => {
    for ( let i = numberOfPlayers; i > 0; i-- ) {
      const filteredPlayers = players.filter(player => player.rank <= i)
      if ( filteredPlayers.length <= i ) {
        return filteredPlayers
      }
    }
  }

  const classes = useStyles()

  if ( players.skaters ) {
    const determineGoaltenderRankingCriteria = (goaltenders) => parseFloat(goaltenders.map(x => x.gkShotsFaced).sort((a,b) => b - a).slice(0,3).reduce((y,a) => y+a, 0))/parseFloat(3)

    const sortPlayers = (players, sortField) => {
      if ( sortField.reversed ) {
        return players.sort((a,b) => a[`${sortField.field}`] - b[`${sortField.field}`])
      } else {
        return players.sort((a,b) => b[`${sortField.field}`] - a[`${sortField.field}`])
      }
    }
  
    const playersCopy =  selectedPlayerType.playerTypeDescription === 'Skaters' ? 
      sortPlayers([...players.skaters], sortField) : 
      sortPlayers([...players.goaltenders].filter(goaltender => parseFloat(goaltender.gkShotsFaced) >= (.65 * determineGoaltenderRankingCriteria(players.goaltenders))), sortField)

    const rankedPlayers = rankThePlayers(playersCopy, sortField)
    const rankedFilteredPlayers = rankedPlayers.filter(player => player.rank <= numberOfPlayers)
    const reducedPlayers = showNumOfPlayersOrLess(rankedFilteredPlayers)
    const maxReducedRank = Math.max(...reducedPlayers.map(player => player.rank))
    const nextPlayersRank = Math.min(...rankedFilteredPlayers.filter(player => player.rank > maxReducedRank).map(player => player.rank))
    
    const summaryObj = reducedPlayers < rankedFilteredPlayers && reducedPlayers.length < 10 ?
    {
      additionalPlayers: rankedFilteredPlayers.filter(player => player.rank === nextPlayersRank).length,
      nextRank: nextPlayersRank
    } : null

    table = 
      <BootstrapTable
        columns={functions.generateStandingsColumns(data.playerStandingsColumns, sortField.field, themeClass)}
        data={functions.generatePlayerStandingData(reducedPlayers, sortField.field, themeClass)}
        hover={true}
        responsive={true}
        striped={false}
        variant={lightTheme ? 'light' : 'dark'}
        themeClass={themeClass}
        size={isMobile ? 'sm' : ''}
        sortField={sortField}
        handleTableClick={handleTableClick}
        playerType={playerRankings.find(playerType => playerType.id === playerTypeId).playerType}
        type='players'
        summaryObj={summaryObj}
        rankedPlayers={rankedPlayers}
      />
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

  const playerTypePagination = 
    <Col className='mt-1'>
      <Stack spacing={2}>
        <Pagination
          classes={{ ul: classes.ul }}
          count={playerRankings.length}
          color='primary'
          size={paginationSize}
          variant='outlined'
          onChange={handlePlayerTypeChange}
          page={playerTypeId}
          hidePrevButton
          hideNextButton
          renderItem={(item) => {
            if ( item.page === 1 ) {
              item = { ...item, page: playerRankings.find(playerType => playerType.id === 1).playerTypeDescription }
            } else if ( item.page === 2 ) {
              item = { ...item, page: playerRankings.find(playerType => playerType.id === 2).playerTypeDescription }
            }

            return (
              <PaginationItem
                {...item}
              />
            )}}
        />
      </Stack>
    </Col>

  const statTypePagination =
    <Col className='d-flex justify-content-end'>
      <Stack spacing={2}>
        <Pagination
          classes={{ ul: classes.ul }}
          count={selectedPlayerType.playerTypeStats.length}
          color='primary'
          size={paginationSize}
          variant='outlined'
          onChange={handleStatIdChange}
          page={statId}
          hidePrevButton
          hideNextButton
          renderItem={(item) => {
            if ( item.page === 1 ) {
              item = { ...item, page: selectedPlayerType.playerTypeStats.find(stat => stat.statId === 1).statDisplayName }
            } else if ( item.page === 2 ) {
              item = { ...item, page: selectedPlayerType.playerTypeStats.find(stat => stat.statId === 2).statDisplayName }
            } else if ( item.page === 3 ) {
              item = { ...item, page: selectedPlayerType.playerTypeStats.find(stat => stat.statId === 3).statDisplayName }
            }

            return (
              <PaginationItem
                {...item}
              />
            )}}
        />
      </Stack>
    </Col>

  return (
    <>
      <Row className='table-title d-flex align-items-center'>
        {clickableTitle}
      </Row>
      <Collapse in={playerOpen}>
        <div>
          <Row>
            {playerTypePagination}
            {statTypePagination}
          </Row>
          {table}
        </div>
      </Collapse>
    </>
  )
}

export default PlayerStandings