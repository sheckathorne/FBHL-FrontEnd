import React, { useContext } from 'react'
import HorizontalDivider from './HorizontalDivider'
import { Row, Col } from 'react-bootstrap'
import dataHelper from '../helpers/data'
import LeaderDetail from './LeaderDetail'
import ThemeContext from './ThemeContext'

const LeaderCard = ({ leaderCategory, leaderList, homeTeamClubId }) => {
  const lightTheme = useContext(ThemeContext).value === 'light'
  const leaderSpec = dataHelper.leadersSpec.find(spec => spec.propName === leaderCategory)

  const maxValue = {
    homeMax: Math.max(...leaderList.filter(player => player.clubId === homeTeamClubId).map(o => o.value), 0),
    awayMax: Math.max(...leaderList.filter(player => player.clubId !== homeTeamClubId).map(o => o.value), 0)
  }

  const leaders = {
    homeTeamLeaders: leaderList.filter(player => player.value > 0 && player.clubId === homeTeamClubId).map(x => ({ ...x, maxValue: maxValue.homeMax })).sort((a,b) => b.value - a.value),
    awayTeamLeaders: leaderList.filter(player => player.value > 0 && player.clubId !== homeTeamClubId).map(x => ({ ...x, maxValue: maxValue.awayMax })).sort((a,b) => b.value - a.value)
  }

  const homeTeamLeaders = leaders.homeTeamLeaders.filter(player => player.value > 0)
  const awayTeamLeaders = leaders.awayTeamLeaders.filter(player => player.value > 0)

  const maxLenProperty = homeTeamLeaders.length >= awayTeamLeaders.length ? 'homeTeamLeaders' : 'awayTeamLeaders'
  const minLenProperty = homeTeamLeaders.length >= awayTeamLeaders.length ? 'awayTeamLeaders' : 'homeTeamLeaders'

  const maxLenLeadersListPlayers = leaders[`${maxLenProperty}`].filter(player => player.value > 0)
  const minLenLeadersListPlayers = leaders[`${minLenProperty}`].filter(player => player.value > 0)

  const leaderArray = leaders[`${maxLenProperty}`].map((x,i) => ( { ...x, counterPart: leaders[`${minLenProperty}`][i] } ))

  const totalRows = maxLenLeadersListPlayers.length
  const rowDiff = totalRows - minLenLeadersListPlayers.length

  return (
    <>
      <HorizontalDivider width='11'/>
      <Row className='match-detail-text'><Col><h5 className={lightTheme ? '' : 'dark-theme-text'}>{leaderSpec.fullStatName} {(leaderArray.length > 1) ? 'Leaders' : 'Leader' }</h5></Col></Row>
      {leaderArray.map((leader,i) =>
        <LeaderDetail
          key={leader.id}
          playerName={leader.playerName}
          playerId={leader.playerId}
          teamId={leader.clubId}
          playerValue={leader.value}
          playerPosition={leader.positionAbbreviation}
          homeTeamObj={leader.homeTeam}
          rowCounterpart={leader.counterPart}
          totalRows={totalRows}
          rowDiff={rowDiff}
          currentRow={i}
        />
      )}
    </>
  )
}

export default LeaderCard