import React, { useState, useEffect } from 'react'
import MatchDetail from './MatchDetail'
import { Container, Col, Row } from 'react-bootstrap'
import dayjs from 'dayjs'
import data from '../helpers/data'
import matchDetails from '../helpers/matchDetails'
import LeaderCard from './LeaderCard'
import colorCompare from '../helpers/colorCompare'
import api from '../services/api'
import CircularProgress from '@mui/material/CircularProgress'

const MatchDetailDashboard = ({ queriedMatchId }) => {
  const [ match, setMatch ] = useState({})
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    api
      .getMatch(queriedMatchId)
      .then(returnedMatch => {
        const fetchedMatch = returnedMatch.find(match => match)
        setMatch(fetchedMatch)
        setLoading(false)
    })
  },[queriedMatchId])

  const display = loading ?
    <Container>
      <Row className='mt-4'>
        <Col className='d-flex justify-content-center'>
          <CircularProgress />
        </Col>
      </Row>
    </Container> :
    <LoadedMatchDetailDashboard match={match} />

    return display
}

const LoadedMatchDetailDashboard = ({ match }) => {
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

  return (
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
  )
}

export default MatchDetailDashboard