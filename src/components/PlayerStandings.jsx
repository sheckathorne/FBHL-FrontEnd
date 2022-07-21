import { useContext, useEffect } from 'react'
import data from '../helpers/data.js'
import functions from '../helpers/tableGenerator'
import { Row, Col, Tabs, Tab } from 'react-bootstrap'
import { makeStyles } from '@mui/styles'
import BootstrapTable from './BootstrapTable'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import MobileContext from './MobileContext'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayerType, setStatId } from '../reducers/paginationReducer'
import { setSkaterOrGoalie } from '../reducers/skaterOrGoalieReducer'
import { intializePlayers, sortPlayers } from '../reducers/topPlayersReducer'

const PlayerStandings = ({ lightTheme, handleTableClick }) => {
  const dispatch = useDispatch()
  const playerTypeId = useSelector(state => state.pagination.playerType)
  const statId = useSelector(state => state.pagination.statId)
  
  const numberOfPlayers = 8
  const playerRankings = data.playerRankings
  const selectedPlayerType = playerRankings.find(playerType => playerType.id === playerTypeId)
  const selectedStat = selectedPlayerType.playerTypeStats.find(stat => stat.statId === statId)
  const sortField = { field: selectedStat.statName, descending: true, reversed: selectedStat.statReversed }
  const sortDir = sortField.reversed ? 'asc' : 'desc'

  useEffect(() => {
    dispatch(intializePlayers(numberOfPlayers, sortField.field, sortDir))
      .then(() => {
        dispatch(sortPlayers(sortField))
    })
  },[dispatch, selectedStat])

  const topPlayers = useSelector(state => state.topPlayers)

  const isMobile = useContext(MobileContext)
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const paginationSize = isMobile ? 'small' : 'medium'
  
  let table = null

  const playerTypeReducer = selectedPlayerType.playerType === 'goaltenders' ? 'skaters' : 'goaltenders'

  const handlePlayerTypeChange = (n) => {
    dispatch(setPlayerType(n))
    dispatch(setStatId(1))
  }

  const handleTabSelect = (k, playerTypeReducer) => {
    handlePlayerTypeChange(parseInt(k))
    dispatch(setSkaterOrGoalie({ field: playerTypeReducer }))
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

  const showNumOfPlayersOrLess = (players, rankField) => {
    for ( let i = numberOfPlayers; i > 0; i-- ) {
      const filteredPlayers = players.filter(player => player[rankField] <= i)
      if ( filteredPlayers.length <= i ) {
        return filteredPlayers
      }
    }
  }

  const classes = useStyles()

  if ( topPlayers ) {
    const sortPlayers = (players, sortField) => {
      if ( sortField.reversed ) {
        return players.sort((a,b) => a[`${sortField.field}`] - b[`${sortField.field}`])
      } else {
        return players.sort((a,b) => b[`${sortField.field}`] - a[`${sortField.field}`])
      }
    }
    
    const playersCopy =  selectedPlayerType.playerType === 'skaters' ? 
      sortPlayers([...topPlayers], sortField) : 
      sortPlayers([...topPlayers].filter(goaltender => goaltender.playerIsRanked), sortField)

    const rankField = `${sortField.field}_rank`    
    const rankedFilteredPlayers = playersCopy.filter(player => player[rankField] <= numberOfPlayers)
    const reducedPlayers = showNumOfPlayersOrLess(rankedFilteredPlayers, rankField)
    const maxReducedRank = Math.max(...reducedPlayers.map(player => player[rankField]))
    const nextPlayersRank = Math.min(...rankedFilteredPlayers.filter(player => player[rankField] > maxReducedRank).map(player => player[rankField]))
    
    const summaryObj = reducedPlayers < rankedFilteredPlayers && reducedPlayers.length < 10 ?
    {
      additionalPlayers: rankedFilteredPlayers.filter(player => player[rankField] === nextPlayersRank).length,
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
          rankedPlayers={playersCopy}
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
          onSelect={(k) => handleTabSelect(k, playerTypeReducer)}
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