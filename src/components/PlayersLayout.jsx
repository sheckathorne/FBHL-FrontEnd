import { useState, useContext, useMemo, useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import SortButtonGroup from './SortButtonGroup'
import SkaterGoalieToggleDropdown from './SkaterGoalieToggleDropdown'
import PlayerDetailStatCategory from './PlayerDetailStatCategory'
import TeamDropdown from './TeamDropdown'
import ThemeContext from './ThemeContext'
import MobileContext from './MobileContext'
import data from '../helpers/data.js'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import MobileTitle from './MobileTitle'
import LeagueContext from './LeagueContext'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'
import { initializePlayers } from '../reducers/paginatedPlayersReducer'
import { useDebounce } from '../hooks/useDebounce'

const PlayersLayout = () => {
  const [ playerSearch, setPlayerSearch ] = useState('')
  const debouncedSearchTerm = useDebounce(playerSearch, 500)
  const searchTerm = debouncedSearchTerm || ''

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  const query = useQuery()

  function sortDirection(playerSortField) {
    if ( playerSortField.descending ) {
      if ( playerSortField.reversed ) {
        return 'asc'
      } else {
        return 'desc'
      }
    } else {
      if ( playerSortField.reversed ) {
        return 'desc'
      } else {
        return 'asc'
      }
    }
  }
  
  const dispatch = useDispatch()

  const activePage = useSelector(state => state.pagination.playersActivePage)
  const sortField = useSelector(state => state.sortField)
  const gkSortField = useSelector(state => state.gkSortField)
  const skaterOrGoalie = useSelector(state => state.skaterOrGoalie)
  
  const itemsPerPage = 6
  const showingSkaters = skaterOrGoalie.field === 'skaters'
  const playerSortField = showingSkaters ? sortField : gkSortField
  const sortDir = sortDirection(playerSortField)
  const teamId = useLocation().pathname.replace('/players','').replace('/','')

  useEffect(() => {
    dispatch(initializePlayers(activePage, itemsPerPage, playerSortField.field, sortDir, showingSkaters, teamId, searchTerm))
  }, [dispatch, activePage, playerSortField.field, sortDir, showingSkaters, teamId, searchTerm])

  const rankedFilteredPlayers = useSelector(state => state.paginatedPlayers)
  
  const isMobile = useContext(MobileContext)
  const lightTheme = useContext(ThemeContext).value === 'light'
  const leagueName = useContext(LeagueContext)
  const themeVariant = lightTheme ? 'outline-dark' : 'dark'
  const delta = isMobile ? 1 : 2

  const playerIsRanked = (showingSkaters, sortField) => showingSkaters ? (!(typeof(sortField.field) === 'undefined') && !sortField.alpha) : true
  const playerIsRankedValue = playerIsRanked(showingSkaters, sortField)
  const queriedPlayer = rankedFilteredPlayers.find(player => player.playerId.toString() === query.get('playerId'))

  const calendarBtn = teamId.length > 0 ?
    <Row>
      <Col className='d-grid gap-2 fluid mt-2'>
        <Button as={Link} to={`/calendar/${teamId}`} variant={themeVariant}>Show Team Calendar</Button>
      </Col>
    </Row> : null

  const mobileTitle = isMobile ? <MobileTitle title='Players' lightTheme={lightTheme} otherClasses='mt-2' /> : null

  const teamTitle = queriedPlayer && teamId && teamId.length > 0 ?
    <Row className='mt-2'>
      <Col lg={4}>
        <TeamDropdown source='players' />
      </Col>
    </Row> : null

  const sortButtonGroup =
    <Row className='mt-2'>
      <SortButtonGroup showingSkaters={showingSkaters}/>
    </Row>

  const leftNavGroup = queriedPlayer ? null : (
    <Col lg={4} className={isMobile ? '': 'mt-2'}>
      <Row>
        <TeamDropdown source='players' />
      </Row>
      <Row className='mt-2'>
        <Col>
          <SkaterGoalieToggleDropdown />
        </Col>
      </Row>
      {sortButtonGroup}
      <Row className='mt-2'>
        <Col>
          <Form.Control
            placeholder='Player search'
            defaultValue={playerSearch}
            onChange={(e) => {
              setPlayerSearch(e.target.value)
              dispatch(setPlayersActivePage(1))
          }} />
        </Col>
      </Row>
      {calendarBtn}
    </Col>
  )

  const playerDetailStats = queriedPlayer && queriedPlayer.posSorted !== '0' ? (
    <Col>
      <Container>
        {data.playerDetailStats.map(category => (
          <PlayerDetailStatCategory
            key={category.id}
            category={category}
            player={queriedPlayer}
            players={rankedFilteredPlayers}
            playerIsSkater={queriedPlayer.posSorted !== '0'}
            itemsPerPage={itemsPerPage}
          />
        ))}
      </Container>
    </Col>

  ) : null

  return (
    <HelmetProvider>
      <Helmet>
        <title>Players - {leagueName}</title>
      </Helmet>
      <Container>
        {mobileTitle}
        {teamTitle}
        <Row>
          {leftNavGroup}
          <Outlet
            context={{
              itemsPerPage,
              rankedFilteredPlayers,
              delta,
              playerIsRankedValue,
              queriedPlayer,
              playerDetailStats,
              searchTerm }}
          />
        </Row>
      </Container>
    </HelmetProvider>
  )
}

export default PlayersLayout