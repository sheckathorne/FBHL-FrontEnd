import helperData from './data'

const generateMatchData = (match, guys, clubId) => (
  {
    teamName: helperData.teams.find(team => team.clubId.toString() === clubId.toString()).name,
    abbreviation: helperData.teams.find(team => team.clubId.toString() === clubId.toString()).abbreviation,
    goals: match.clubs[`${Object.keys(match.clubs).find(a => a === clubId)}`].goals,
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

  for (const [key] of Object.entries(playersObj)) {
    result.push(...Object.entries(playersObj[key]).map(x => ({ ...x[1], playerId: x[0], clubId: key, homeTeam: key === clubId })))
  }

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

const obj = {
  generatePlayerArray,
  generateLeaders,
  generateMatchData,
}

export default obj