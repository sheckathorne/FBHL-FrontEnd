import helperData from './data'

const generateMatchData = (match, guys, clubId) => (
  {
    teamName: helperData.teams.find(team => team.clubId.toString() === clubId.toString()).name,
    abbreviation: helperData.teams.find(team => team.clubId.toString() === clubId.toString()).abbreviation,
    goals: match.clubs.find(club => club.clubId === clubId).data.goals,
    shots: guys.skshots.toString(),
    hits: guys.skhits.toString(),
    passingPct: ((guys.skpasses / guys.skpassattempts) * 100).toFixed(2).toString() ,
    faceoffPct: ((guys.skfow / (guys.skfow + guys.skfol)) * 100).toFixed(2).toString(),
    penaltyMins: guys.skpim.toString()
  }
)

const generatePlayerArray = (clubId, match) => {
  const playersObj = match.players
  let result = []

  playersObj.forEach(club => {
    club.members.forEach(member => {
      result.push({playerId: member.playerId, ...member.data, clubId: club.clubId, homeTeam: club.clubId === clubId })
    })
  })

  return result
}

const generateLeaders = (playerArray, leaderSpec, homeTeamClubId) => {
  let result = []

  for ( let i = 0; i < leaderSpec.length; i++ ) {
    result.push({
      id: i+1,
      category: leaderSpec[i].propName,
      [leaderSpec[i].propName]: playerArray.map((player,idx) => ({
        id: idx+1,
        clubId: player.clubId,
        playerId: player.playerId,
        value: parseInt(player[leaderSpec[i].statName]),
        playerName: player.playername,
        homeTeam: player.clubId === homeTeamClubId,
        positionAbbreviation: helperData.translatePositions.find(a => a.posSorted === player.posSorted).abbreviation,
      })) }
    )
  }

  return result
}

const generateGoalieData = (match, clubId) => {
  const goalie = match.players.find(player => player.clubId === clubId).members.find(member => member.data.position === 'goalie').data
  return {
    playerName: goalie.playername,
    goalsAllowed: goalie.glga,
    shotsFaced: goalie.glshots,
    saves: goalie.glsaves,
    toi: goalie.toi,
  }
}

const obj = {
  generatePlayerArray,
  generateLeaders,
  generateMatchData,
  generateGoalieData
}

export default obj