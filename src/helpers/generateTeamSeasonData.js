import data from './data.js'

const generateTeamData = (teamId, matches) => {
  const gamesPlayed = matches.length
  if ( gamesPlayed === 0 ) {
    return false
  } else {
    const passes = matches.map(x => parseInt(x.aggregate[`${teamId}`].skpasses)).reduce((a,b) => a+b)
    const passAttempts = matches.map(x => parseInt(x.aggregate[`${teamId}`].skpassattempts)).reduce((a,b) => a+b)
    const shots = matches.map(x => parseInt(x.aggregate[`${teamId}`].skshots)).reduce((a,b) => a+b)
    const hits = matches.map(x => parseInt(x.aggregate[`${teamId}`].skhits)).reduce((a,b) => a+b)
    const pim = matches.map(x => parseInt(x.aggregate[`${teamId}`].skpim)).reduce((a,b) => a+b)
    const streaks = matches.sort((a,b) => b.timestamp - a.timestamp).map(match => {
      if ( ['2','10','6'].includes(match.clubs[`${teamId}`].result ) ) {
        return 'L'
      } else {
        return 'W'
      }
    })

    const streakCalculator = (streaks) => {
      if ( streaks.length === 0 ) {
        return {}
      } else {
        let streak = { result: streaks[0], count: 1 }
        for ( let i = 1; i < streaks.length && streaks.length > 1; i++ ) {
          if ( streak.result === streaks[i] ) {
            streak.count++
          } else {
            break
          }
        }
        return streak
      }
    }

    const currentStreak = streakCalculator(streaks)

    return {
      teamId: teamId,
      abbreviation: data.teams.find(team => team.clubId.toString() === teamId).abbreviation,
      teamName: data.teams.find(team => team.clubId.toString() === teamId).name,
      gamesPlayed: matches.filter(match => ['1','5','16385','2','10','6'].includes(match.clubs[`${teamId}`].result)).length.toString(),
      wins: matches.filter(match => ['1','5','16385'].includes(match.clubs[`${teamId}`].result)).length.toString(),
      losses: matches.filter(match => ['2','10'].includes(match.clubs[`${teamId}`].result)).length.toString(),
      overtimeLosses: matches.filter(match => match.clubs[`${teamId}`].result === '6').length.toString(),
      goalsScored: matches.map(x => parseInt(x.clubs[`${teamId}`].goals)).reduce((a,b) => a+b).toString(),
      goalsAllowed: matches.map(x => parseInt(x.clubs[`${teamId}`].goalsAgainst)).reduce((a,b) => a+b).toString(),
      passPct: ((passes.toFixed(2)/passAttempts.toFixed(2)) * 100).toFixed(2).toString()+'%',
      shotsPg: (shots.toFixed(2)/gamesPlayed.toFixed(2)).toFixed(2).toString(),
      hitsPg: (hits.toFixed(2)/gamesPlayed.toFixed(2)).toFixed(2).toString(),
      pimPg: (pim.toFixed(2)/gamesPlayed.toFixed(2)).toFixed(2).toString(),
      currentStreak: currentStreak.result + currentStreak.count.toString(),
    }
  }
}

const generateAllTeamData = (teamList, matches) => {
  let result = []
  teamList.forEach(team => {
    const clubId = team.clubId.toString()
    const filteredMatches = matches.filter(match => Object.keys(match.clubs).includes(clubId))

    if ( filteredMatches.length > 0 ) {
      result.push(generateTeamData(clubId,filteredMatches))
    }
  })
  return result
}

const obj = { generateTeamData, generateAllTeamData }

export default obj