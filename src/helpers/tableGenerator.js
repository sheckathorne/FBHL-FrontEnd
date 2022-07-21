import Image from 'react-bootstrap/Image'
import data from './data.js'

const generateLeagueStandingData = (teams, themeClass, playoffs) => teams.map((team, i) => {
  const streakClass = team.currentStreak ? team.currentStreak.includes('W') ? 'winner-streak' : 'loser-streak' : 'no-streak'
  let teamRank = team.rank
  let dataRowClass = 'table-body-row'.concat(' ',themeClass)
  const addDefaultSrc = (e) => e.target.src = data.defaultCrest

  if ( playoffs ) {
    teamRank = i + 1

    if ( team.conferenceLeader ) {
      dataRowClass = 'table-body-row'.concat(' playoff-conference-leader')
    } else if ( team.wildcard ) {
      dataRowClass = 'table-body-row'.concat(' playoff-wildcard-leader')
    } else {
      dataRowClass = 'table-body-row'.concat(' ',themeClass)
    }

    if ( teamRank === 8 ) {
      dataRowClass = dataRowClass.concat(' playoff-cutoff-row')
    }
  }

  return ({
    rowUrl: `calendar/${team.teamId}`,
    conference: team.conference,
    columns: {
      rank: {
        value: teamRank,
        class: dataRowClass,
        position: 'center',
      },
      team: {
        value: <><Image className='table-row-logo' alt={team.teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${team.abbreviation}.png`)} /> {team.teamName}</>,
        class: dataRowClass,
        position: 'start'
      },
      gamesPlayed: {
        value: team.gamesPlayed,
        class: dataRowClass,
        position: 'center',
      },
      wins: {
        value: team.wins,
        class: dataRowClass,
        position: 'center',
      },
      losses: {
        value: team.losses,
        class: dataRowClass,
        position: 'center',
      },
      overtimeLosses:{
        value: team.overtimeLosses,
        class: dataRowClass,
        position: 'center',
      },
      points:{
        value: ((parseInt(team.wins * 2)) + parseInt(team.overtimeLosses)).toString(),
        class: dataRowClass,
        position: 'center',
      },
      goalsFor:{
        value: team.goalsScored,
        class: dataRowClass,
        position: 'center',
      },
      goalsAgainst:{
        value: team.goalsAllowed,
        class: dataRowClass,
        position: 'center',
      },
      goalDifference:{
        value: (parseInt(team.goalsScored)-parseInt(team.goalsAllowed)).toString(),
        class: dataRowClass,
        position: 'center',
      },
      streak:{
        value: team.currentStreak,
        class: dataRowClass + ' ' + streakClass,
        position: 'center',
      }, } }
  )}
)

const generateColumns = (cols, themeClass) => {
  const headerItemClass = themeClass
  return (cols.map(col => ({ ...col, className: headerItemClass, })))
}

const generateStandingsColumns = (cols, stat, themeClass) => cols.all.slice(0,2).map(col => ({ ...col, className: themeClass, })).concat(cols[`${stat}`].map(col => ({ ...col, className: themeClass, })),cols.all.slice(2).map(col => ({ ...col, className: themeClass, })))

const generatePlayerStandingData = (players, stat, themeClass) => players.map(player => {
  const dataRowClass = 'table-body-row'.concat(' ',themeClass)
  const addDefaultSrc = (e) => e.target.src = data.defaultCrest
  const team = data.teams.find(team => team.clubId.toString() === player.teamId )
  const position = data.translatePositions.find(position => position.posSorted === player.posSorted).abbreviation
  const statVal = position === 'G' ? parseFloat(player[stat]).toFixed(3) : player[stat]

  return ({
    rowUrl: `players/${team.clubId.toString()}?playerId=${player.playerId}`,
    columns: {
      rank: {
        value: player.rank,
        class: dataRowClass,
        position: 'center',
      },
      name: {
        value: player.playerName,
        class: dataRowClass,
        position: 'start'
      },
      stat: {
        value: statVal,
        class: dataRowClass,
        position: 'center',
      },
      team: {
        value: <><Image className='table-row-logo' alt={team.teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${team.abbreviation}.png`)} /> {team.name}</>,
        class: dataRowClass,
        position: 'start'
      },
      position: {
        value: position,
        class: dataRowClass,
        position: 'center'
      },
    }
  })}
)

const obj = { generateLeagueStandingData, generateColumns, generateStandingsColumns, generatePlayerStandingData }

export default obj