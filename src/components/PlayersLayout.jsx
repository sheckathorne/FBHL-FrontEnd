import React, { useState, useContext } from 'react'
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
import generateRankNumber from '../helpers/rankFunction'
import { useDispatch, useSelector } from 'react-redux'
import { setPlayersActivePage } from '../reducers/paginationReducer'

const PlayersLayout = ({ handleSortClick, handleSkaterOrGoalieClick, sortField, skaterOrGoalie }) => {
  const [ playerSearch, setPlayerSearch ] = useState('')
  const players = useSelector(state => state.players)
  const dispatch = useDispatch()

  const useQuery = () => {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
  }

  const playerIsRanked = (showingSkaters, sortField) => showingSkaters ? (!(typeof(sortField.field) === 'undefined') && !sortField.alpha) : true

  const rankThePlayers = (players, sortField) => {
    if ( playerIsRanked(showingSkaters,sortField) ) {
      if ( sortField.descending ) {
        return players.map((player,i) => {
          const allPlayersStatValue = players.map(player => player[`${sortField.field}`])
          const currentPlayerStatValue = player[`${sortField.field}`]
          return { rank: generateRankNumber(i, allPlayersStatValue, currentPlayerStatValue), ...player }
        })
      } else {
        const reversed = players.reverse()
        return reversed.map((player,i) => {
          const allPlayersStatValue = reversed.map(player => player[`${sortField.field}`])
          const currentPlayerStatValue = player[`${sortField.field}`]
          return { rank: generateRankNumber(i, allPlayersStatValue, currentPlayerStatValue), ...player }
        }).reverse()
      }
    } else {
      return players
    }
  }

  const determineGoaltenderRankingCriteria = (goaltenders) => parseFloat(goaltenders.map(x => x.gkShotsFaced).sort((a,b) => b - a).slice(0,3).reduce((y,a) => y+a, 0))/parseFloat(3)

  const rankAndFilterPlayers = (playerType) => {
    const createPlayerArray = (playerType) => {
      if ( playerType === 'skaters' ) {
        return { players: [...playerGroup], inellgiblePlayers: null }
      } else if ( playerType === 'goaltenders' ) {
        const goaltendersCopy = [...playerGroup]
        const goaltendersElligibleToBeRanked = goaltendersCopy.filter(goaltender => parseFloat(goaltender.gkShotsFaced) >= (.65 * determineGoaltenderRankingCriteria(goaltendersCopy)))
        const sortedRankedGoaltenders = goaltendersElligibleToBeRanked.sort((a,b) => {
          let n = b.gksvpct - a.gksvpct
          if ( n !== 0) {
            return n
          } else {
            return a.gkgaa - b.gkgaa
          }
        })

        return {
          players: sortedRankedGoaltenders,
          inellgiblePlayers: goaltendersCopy.filter(goaltender => !sortedRankedGoaltenders.map(x => x.playerId).includes(goaltender.playerId)).map(x => ({ ...x, playerIsRanked: false }))
        }
      }
    }

    switch(playerType) {
    case 'skaters':
      return rankThePlayers(createPlayerArray(playerType).players, sortField)
    case 'goaltenders':
      return rankThePlayers(createPlayerArray(playerType).players, { field: 'gksvpct', descending: true }).map(x => ({ ...x, playerIsRanked: true })).concat(createPlayerArray(playerType).inellgiblePlayers)
    default:
      break
    }
  }

  const rankedPlayerType = (showingSkaters) => showingSkaters ? 'skaters' : 'goaltenders'

  const query = useQuery()
  const isMobile = useContext(MobileContext)
  const lightTheme = useContext(ThemeContext).value === 'light'
  const leagueName = useContext(LeagueContext)

  const itemsPerPage = 6
  const delta = isMobile ? 1 : 2
  const teamId = useLocation().pathname.replace('/players','').replace('/','')
  const themeVariant = lightTheme ? 'outline-dark' : 'dark'

  const showingSkaters = skaterOrGoalie.field === 'skaters'
  const playerIsRankedValue = playerIsRanked(showingSkaters, sortField)
  const playerGroup = showingSkaters ? players.skaters : players.goaltenders
  const queriedPlayer = playerGroup.find(player => player.playerId.toString() === query.get('playerId'))
  const rankedFilteredPlayers = rankAndFilterPlayers(rankedPlayerType(showingSkaters))

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

  const sortButtonGroup = showingSkaters ? (
    <Row className='mt-2'>
      <SortButtonGroup
        handleSortClick={handleSortClick}
        sortField={sortField}
      />
    </Row>) : null

  const leftNavGroup = queriedPlayer ? null : (
    <Col lg={4} className={isMobile ? '': 'mt-2'}>
      <Row>
        <TeamDropdown source='players' />
      </Row>
      <Row className='mt-2'>
        <Col>
          <SkaterGoalieToggleDropdown
            handleSkaterOrGoalieClick={handleSkaterOrGoalieClick}
            skaterOrGoalie={skaterOrGoalie}
          />
        </Col>
      </Row>
      {sortButtonGroup}
      <Row className='mt-2'>
        <Col>
          <Form.Control placeholder='Player search' onChange={(e) => {
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
              playerSearch,
              sortField,
              itemsPerPage,
              rankedFilteredPlayers,
              delta,
              playerIsRankedValue,
              queriedPlayer,
              playerDetailStats }}
          />
        </Row>
      </Container>
    </HelmetProvider>
  )
}

export default PlayersLayout