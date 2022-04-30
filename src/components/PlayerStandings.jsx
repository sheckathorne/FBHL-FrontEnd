import React, { useContext } from 'react'
import data from '../helpers/data.js'
import functions from '../helpers/tableGenerator'
import { Row, Col, Tabs, Tab } from 'react-bootstrap'
import { makeStyles } from '@mui/styles'
import BootstrapTable from './BootstrapTable'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import MobileContext from './MobileContext'
import generateRankNumber from '../helpers/rankFunction'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayerType, setStatId } from '../reducers/paginationReducer'

const PlayerStandings = ({ lightTheme, handleTableClick }) => {
  const dispatch = useDispatch()
  const players = useSelector(state => state.players)
  const isMobile = useContext(MobileContext)
  const playerTypeId = useSelector(state => state.pagination.playerType)
  const statId = useSelector(state => state.pagination.statId)
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const numberOfPlayers = 8
  const paginationSize = isMobile ? 'small' : 'medium'
  const playerRankings = data.playerRankings
  const selectedPlayerType = playerRankings.find(playerType => playerType.id === playerTypeId)
  const selectedStat = selectedPlayerType.playerTypeStats.find(stat => stat.statId === statId)
  const sortField = { field: selectedStat.statName, descending: true, reversed: selectedStat.statReversed }
  let table = null

  const handlePlayerTypeChange = (n) => {
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
  
    const playersCopy =  selectedPlayerType.playerType === 'skaters' ? 
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

    const statTypePagination =
    <Col className='d-flex justify-content-start'>
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

    table =
      <>
        <Row>
          {statTypePagination}
        </Row>
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
      </>
  }

  return (
    <>
      <Row className='table-title d-flex align-items-center expand-paranthetical'>
        <Col className='mt-1'>
          <h5 className={themeClass + ' tiny-caps section-title'}>Players</h5>
        </Col>
      </Row>
      <Tabs
          id="controlled-tab-example"
          activeKey={selectedPlayerType.id}
          onSelect={(k) => handlePlayerTypeChange(parseInt(k))}
          className="mb-3"
        >
          <Tab eventKey={1} title="Top Skaters" tabClassName={themeClass}>
            {table}
          </Tab>
          <Tab eventKey={2} title="Top Goalies" tabClassName={themeClass}>
            {table}
          </Tab>
        </Tabs>
    </>
  )
}

export default PlayerStandings