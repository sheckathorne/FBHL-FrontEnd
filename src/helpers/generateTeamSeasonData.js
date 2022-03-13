import data from './data.js'

const teamRankFunction = ( i, team, teams ) => {
  let n = 0

  if ( i === 0 ) {
    n = 1
  } else if ( i > 0 && ((team.wins * 2) + team.overtimeLosses) === ((teams[i-1].wins * 2) + teams[i-1].overtimeLosses) ) {
    n = teams.findIndex(p => (((p.wins * 2) + p.overtimeLosses) === ((team.wins * 2) + team.overtimeLosses)) ) + 1
  } else {
    n = i + 1
  }

  return n
}

const rankTheTeams = (teams) => teams.map((team,i) => ({ rank: teamRankFunction(i, team, teams), ...team }))

const sortTeamData = (teamData) => teamData.sort((a,b) => {
  let n = (((b.wins * 2) + b.overtimeLosses) - ((a.wins * 2) + a.overtimeLosses))
  if ( n !== 0) {
    return n
  } else {
    return ((((parseFloat((b.wins * 2) + b.overtimeLosses)) / parseFloat(b.gamesPlayed))) - ((parseFloat((a.wins * 2) + a.overtimeLosses)) / parseFloat(a.gamesPlayed)))
  }
})

const generateTeamData = (teamId, matches) => {
  const gamesPlayed = matches.length
  if ( gamesPlayed === 0 ) {
    return false
  } else {
    const passes = matches.map(x => parseInt(x.aggregate.find(team => team.clubId === teamId).data.skpasses)).reduce((a,b) => a+b)
    const passAttempts = matches.map(x => parseInt(x.aggregate.find(team => team.clubId === teamId).data.skpassattempts)).reduce((a,b) => a+b)
    const shots = matches.map(x => parseInt(x.aggregate.find(team => team.clubId === teamId).data.skshots)).reduce((a,b) => a+b)
    const hits = matches.map(x => parseInt(x.aggregate.find(team => team.clubId === teamId).data.skhits)).reduce((a,b) => a+b)
    const pim = matches.map(x => parseInt(x.aggregate.find(team => team.clubId === teamId).data.skpim)).reduce((a,b) => a+b)
    const streaks = matches.sort((a,b) => b.timestamp - a.timestamp).map(match => {
      if ( ['2','10','6'].includes(match.clubs.find(club => club.clubId === teamId).data.result) ) {
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
      gamesPlayed: matches.filter(match => ['1','5','16385','2','10','6'].includes(match.clubs.find(club => club.clubId === teamId).data.result)).length.toString(),
      wins: matches.filter(match => ['1','5','16385'].includes(match.clubs.find(club => club.clubId === teamId).data.result)).length.toString(),
      losses: matches.filter(match => ['2','10'].includes(match.clubs.find(club => club.clubId === teamId).data.result)).length.toString(),
      overtimeLosses: matches.filter(match => match.clubs.find(club => club.clubId === teamId).data.result === '6').length.toString(),
      goalsScored: matches.map(x => parseInt(x.clubs.find(club => club.clubId === teamId).data.goals)).reduce((a,b) => a+b).toString(),
      goalsAllowed: matches.map(x => parseInt(x.clubs.find(club => club.clubId === teamId).data.goalsAgainst)).reduce((a,b) => a+b).toString(),
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
    const filteredMatches = matches.filter(match => match.clubs.map(club => club.clubId).includes(clubId))

    if ( filteredMatches.length > 0 ) {
      result.push(generateTeamData(clubId,filteredMatches))
    }
  })
  return result
}

const obj = { generateTeamData, generateAllTeamData }

export default obj