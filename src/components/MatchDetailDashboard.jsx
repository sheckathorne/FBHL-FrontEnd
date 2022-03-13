import React from 'react'
import MatchDetail from './MatchDetail'
import { Container, Col } from 'react-bootstrap'
import dayjs from 'dayjs'
import data from '../helpers/data'
import matchDetails from '../helpers/matchDetails'
import LeaderCard from './LeaderCard'
import colorCompare from '../helpers/colorCompare'

const MatchDetailDashboard = ({ match }) => {
  const matchDate = dayjs.unix(match.timestamp).format('MMMM D, YYYY')
  const dataPointRowSpec = data.dataPointRowSpec

  const homeTeamClubId = match.clubs[0].clubId
  const awayTeamClubId = match.clubs[1].clubId

  const homeTeam = data.teams.find(team => team.clubId.toString() === match.clubs[0].clubId.toString())
  const awayTeam = data.teams.find(team => team.clubId.toString() === match.clubs[1].clubId.toString())

  const homeTeamPlayers = match.aggregate.find(a => a.clubId === homeTeamClubId).data
  const awayTeamPlayers = match.aggregate.find(a => a.clubId === awayTeamClubId).data

  const homeTeamData = matchDetails.generateMatchData(match, homeTeamPlayers, homeTeamClubId)
  const awayTeamData = matchDetails.generateMatchData(match, awayTeamPlayers, awayTeamClubId)

  const playerArray = matchDetails.generatePlayerArray(homeTeamClubId, match)
  const leaders = matchDetails.generateLeaders(playerArray, data.leadersSpec, homeTeamClubId).filter( x => x[`${x.category}`].reduce((a,b) => a + b.value, 0) !== 0 )

  const homeTeamColors = [homeTeam.primaryColor, homeTeam.secondaryColor]
  const awayTeamColors = [awayTeam.primaryColor, awayTeam.secondaryColor]
  const colors = colorCompare.selectTeamColors(homeTeamColors,awayTeamColors)

  const addDefaultSrc = (e) => e.target.src = 'https://media.contentapi.ea.com/content/dam/eacom/nhl/pro-clubs/custom-crests/42.png'

  const display = ( match ) ? (
    <Col xs={12} className='match-detail-card'>
      <Container>
        <MatchDetail
          homeTeamData={{ teamId: homeTeamClubId, color: colors.homeColor,  ...homeTeamData }}
          awayTeamData={{ teamId: awayTeamClubId, color: colors.awayColor, ...awayTeamData }}
          matchDate={matchDate}
          dataPointRowSpec={dataPointRowSpec}
          addDefaultSrc={addDefaultSrc}
          colors={colors}
        />
        {leaders.map(leader =>
          <LeaderCard
            key={leader.id}
            leaderCategory={leader.category}
            leaderList={leader[leader.category]}
            homeTeamClubId={homeTeamClubId}
          />
        )}
      </Container>
    </Col>
  ) : null

  return (display)
}

export default MatchDetailDashboard