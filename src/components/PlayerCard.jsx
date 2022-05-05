import React, { useContext, useMemo } from 'react'
import StatRow from './StatRow'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Image } from 'react-bootstrap'
import RankedAvatar from './RankedAvatar'
import UnrankedAvatar from './UnrankedAvatar'
import data from '../helpers/data'
import ThemeContext from './ThemeContext'
import { useSelector } from 'react-redux'

const PlayerCard = ({ name, teamId, stats, playerId, marginClass, rank, playerIsRanked, posSorted, playerCardClickSource, handleTopPlayerClick, playerDetailStats, playerCardWidth, aPlayerIsSelelected, ...rest }) => {
  let navigate = useNavigate('')
  const sortField = useSelector(state => state.sortField)
  const addDefaultSrc = (e) => e.target.src = data.defaultCrest
  const lightTheme = useContext(ThemeContext).value === 'light'

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  const query = useQuery()
  const buttonSelected = ( query.get('playerId') === playerId.toString() )
  const url = playerCardClickSource === 'players' ? buttonSelected  ? '' : `?playerId=${playerId}` : `players/${teamId}?playerId=${playerId}`

  const avatarColClass = lightTheme ? 'my-auto border-end border-dark' : 'my-auto border-end border-light'
  const buttonSelectedClass = buttonSelected ? 'card-selected' : ''
  const themeClass = lightTheme ? 'clickable-card' : 'clickable-card-dark'
  const themeTextClass = lightTheme ? '' : 'dark-theme-text'

  const position = data.translatePositions.find(position => position.posSorted === posSorted)
  const playerIsGk = position.abbreviation === 'G'
  const team = data.teams.find(team => team.clubId === parseInt(teamId))
  const teamName = team.name
  const teamAbbreviation = team.abbreviation

  const avatar = playerIsRanked ?
    <RankedAvatar rank={rank} /> :
    <UnrankedAvatar playerId={playerId} />

  return (
    <>
      <Row>
        <Col lg={playerCardWidth}>
          <div {...rest} className={`${marginClass} d-grid gap-2 pointer-cursor ${themeClass} ${buttonSelectedClass}`}>
            <div onClick={() => {
              navigate(url)
              if ( playerCardClickSource === 'league' ) {
                handleTopPlayerClick(sortField)
              }}} value={playerId}
            >
              <Container>
                <Row>
                  <Col className={avatarColClass} xs={3}>
                    {avatar}
                  </Col>
                  <Col xs={9} className='pl-4 pr-4'>
                    <Row className='mt-2 mb-2 d-flex align-items-center'>
                      <Col className='text-start'>
                        <span className={`fw-bold text-start player-card-name ${themeTextClass}`}>{name}</span>
                        <span className={`fw-light text-start player-card-position ${themeTextClass}`}> ({position.abbreviation})</span>
                      </Col>
                      <Col xs={3} className='text-center'>
                        <Image className='player-card-team-logo align-middle' alt={teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${teamAbbreviation}.png`)} />
                        <span className={`fw-bold player-card-name align-middle ${themeTextClass}`}>{` ${team.abbreviation}`}</span>
                      </Col>
                    </Row>
                    <Row className='mb-2'>
                      <StatRow
                        stats={playerIsGk ?
                          stats.goaltender :
                          stats.total}
                        statColumns={playerIsGk ?
                          data.gkStatCols :
                          data.statCols}
                        type={'total'}
                        themeTextClass={themeTextClass}
                        aPlayerIsSelelected={aPlayerIsSelelected}
                      />
                    </Row>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </Col>
        <Row>
          {playerDetailStats}
        </Row>
      </Row>
    </>
  )
}

export default PlayerCard