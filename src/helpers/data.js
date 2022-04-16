import { v4 as uuidv4 } from 'uuid'

const dashboardButtons = [
  {
    id: 1,
    name: 'League Overview',
    value: 'league',
    active: false,
    route: '/'
  },{
    id: 2,
    name: 'Calendar',
    value: 'calendar',
    active: false,
    route: '/calendar'
  },
  /*{
    id: 3,
    name: 'Teams',
    value: 'teams',
    active: false,
    route: '/teams'
  },*/
  {
    id: 4,
    name: 'Players',
    value: 'players',
    active: false,
    route: '/players'
  }
]

const teams = [
  { clubName: 'All',  clubId: '', name: 'All Teams', abbreviation: 'ALL', conference: '', division: '', platform:'', badgeId: '', primaryColor: '', secondaryColor: '', active: true }
  ,{ clubName: 'Fbhl Anaheim mighty ducks', clubId: 4759, name: 'Anaheim Ducks', abbreviation: 'ANA', conference: 'West', division: 'Pacific', platform: 'PS4', primaryColor: '(252, 76, 2)', secondaryColor: '(185, 151, 91)', active: true }
  ,{ clubName: 'FB ARIZONA COYOTES', clubId: 43162, name: 'Arizona Coyotes', abbreviation: 'ARI', conference: 'West', division: 'Central', platform: 'PS4', primaryColor: '(140, 38, 51)', secondaryColor: '(266, 214, 181)', active: true }
  ,{ clubName: 'FBHL Boston Bruins', clubId: 316233, name: 'Boston Bruins', abbreviation: 'BOS', conference: 'East', division: 'Atlantic', platform: 'PS4', primaryColor: '(252, 181, 20)', secondaryColor: '(17, 17, 17)', active: true }
  ,{ clubName: 'Fbhl Buffalo Sabres', clubId: 26128, name: 'Buffalo Sabres', abbreviation: 'BUF', conference: 'East', division: 'Atlantic', platform: 'PS4', primaryColor: '(0, 38, 84)', secondaryColor: '(252, 181, 20)', active: true }
  ,{ clubName: 'FB Calgary Flames', clubId: 6289, name: 'Calgary Flames', abbreviation: 'CGY', conference: 'West', division: 'Pacific', platform: 'PS4', primaryColor: '(200, 16, 46)', secondaryColor: '(241, 190, 72)', active: true }
  ,{ clubName: 'FBHL Carolina Hurricanes', clubId: 76092, name: 'Carolina Hurricanes', abbreviation: 'CAR', conference: 'East', division: 'Metropolitan', platform: 'PS4', primaryColor: '(226,24,54)', secondaryColor: '(35,31,32)', active: true }
  ,{ clubName: 'FB CHICAGO BLACKHAWKS', clubId: 319602, name: 'Chicago Blackhawks', abbreviation: 'CHI', conference: 'West', division: 'Central', platform: 'PS4', primaryColor: '(207, 10, 44)', secondaryColor: '(255, 209, 0)', active: true }
  ,{ clubName: 'FBHL Colorado Avs', clubId: 159586, name: 'Colorado Avalanche', abbreviation: 'COL', conference: 'West', division: 'Central', platform: 'PS4', primaryColor: '(111, 38, 61)', secondaryColor: '(35, 97, 146)', active: true }
  ,{ clubName: 'FBHL CBJ', clubId: 102698, name: 'Columbus Blue Jackets', abbreviation: 'CBJ', conference: 'East', division: 'Metropolitan', platform: 'PS4', primaryColor: '(0,38,84)', secondaryColor: '(206,17,38)', active: true }
  ,{ clubName: 'FBHL Dallas Stars', clubId: 41074, name: 'Dallas Stars', abbreviation: 'DAL', conference: 'West', division: 'Central', platform: 'PS4', primaryColor: '(0, 104, 71)', secondaryColor: '(143, 143, 140)', active: true }
  ,{ clubName: 'FBHL Detroit Red Wings', clubId: 316134, name: 'Detroit Redwings', abbreviation: 'DET', conference: 'East', division: 'Atlantic', platform: 'PS4', primaryColor: '(206, 17, 38)', secondaryColor: '(255, 255, 255)', active: true }
  ,{ clubName: 'FBHL Edmonton Oilers', clubId: 68364, name: 'Edmonton Oilers', abbreviation: 'EDM', conference: 'West', division: 'Pacific', platform: 'PS4', primaryColor: '(4, 30, 66)', secondaryColor: '(252, 76, 0', active: true }
  ,{ clubName: 'FBHL Florida Panthers', clubId: 76146, name: 'Florida Panthers', abbreviation: 'FLA', conference: 'East', division: 'Atlantic', platform: 'PS4', primaryColor: '(4, 30, 66)', secondaryColor: '(200, 16, 46)', active: true }
  ,{ clubName: 'FB Vegas Golden Knights', clubId: 312378, name: 'Las Vegas Golden Knights', abbreviation: 'VGK', conference: 'West', division: 'Pacific', platform: 'PS4', primaryColor: '(185, 151, 91)', secondaryColor: '(51, 63, 72)', active: true }
  ,{ clubName: 'FBHL LA KINGS1', clubId: 43438, name: 'Los Angeles Kings', abbreviation: 'LA', conference: 'West', division: 'Pacific', platform: 'PS4', primaryColor: '(17, 17, 17)', secondaryColor: '(162, 170, 173)', active: true }
  ,{ clubName: 'F B H L Minnesota Wild', clubId: 315276, name: 'Minnesota Wild', abbreviation: 'MIN', conference: 'West', division: 'Central', platform: 'PS4', primaryColor: '(2, 73, 48)', secondaryColor: '(237, 170, 0)', active: true }
  ,{ clubName: 'FBHL Montreal Canadiens', clubId: 26593, name: 'Montreal Canadiens', abbreviation: 'MTL', conference: 'East', division: 'Atlantic', platform: 'PS4', primaryColor: '(175, 30, 45)', secondaryColor: '(25, 33, 104)', active: true }
  ,{ clubName: 'FBHL NASHVILLE PREDTORS', clubId: 5263, name: 'Nashville Predators', abbreviation: 'NSH', conference: 'West', division: 'Central', platform: 'PS4', primaryColor: '(255,184,28)', secondaryColor: '(4, 30, 66)', active: true }
  ,{ clubName: 'Fb New Jersey Devils', clubId: 123113, name: 'New Jersey Devils', abbreviation: 'NJ', conference: 'East', division: 'Metropolitan', platform: 'PS4', primaryColor: '(206, 17, 38)', secondaryColor: '(0, 0, 0)', active: true }
  ,{ clubName: 'FBHL New York Islanders', clubId: 26815, name: 'New York Islanders', abbreviation: 'NYI', conference: 'East', division: 'Metropolitan', platform: 'PS4', primaryColor: '(244, 125, 48)', secondaryColor: '(0, 83, 155)', active: true }
  ,{ clubName: 'FBHL New York Rangers', clubId: 9286, name: 'New York Rangers', abbreviation: 'NYR', conference: 'East', division: 'Metropolitan', platform: 'PS4', primaryColor: '(0, 56, 168)', secondaryColor: '(206, 17, 38)', active: true }
  ,{ clubName: 'FBHL Ottawa Senators', clubId: 72960, name: 'Ottawa Senators', abbreviation: 'OTT', conference: 'East', division: 'Atlantic', platform: 'PS4', primaryColor: '(197, 32, 50)', secondaryColor: '(194, 145, 44)', active: true }
  ,{ clubName: 'FBHL Philadelphia Flyers', clubId: 13405, name: 'Philadelphia Flyers', abbreviation: 'PHI', conference: 'East', division: 'Metropolitan', platform: 'PS4', primaryColor: '(247, 73, 2)', secondaryColor: '(0, 0, 0)', active: true }
  ,{ clubName: 'FBHL Pittsburgh Penguins', clubId: 6472, name: 'Pittsburgh Penguins', abbreviation: 'PIT', conference: 'East', division: 'Metropolitan', platform: 'PS4', primaryColor: '(0, 0, 0)', secondaryColor: '(252,181,20)', active: true }
  ,{ clubName: 'FBHL SJ Sharks', clubId: 140953, name: 'San Jose Sharks', abbreviation: 'SJ', conference: 'West', division: 'Pacific', platform: 'PS4', primaryColor: '(0, 109, 117)', secondaryColor: '(234, 114, 0)', active: true }
  ,{ clubName: 'FBHL Seattle Kraken', clubId: 7789, name: 'Seattle Kraken', abbreviation: 'SEA', conference: 'West', division: 'Pacific', platform: 'PS4', primaryColor: '(153, 217, 217)', secondaryColor: '(0, 22, 40)', active: true }
  ,{ clubName: 'FB Blues', clubId: 475, name: 'St. Louis Blues', abbreviation: 'STL', conference: 'West', division: 'Central', platform: 'PS4', primaryColor: '(0, 47, 135)', secondaryColor: '(252, 181, 20)', active: true }
  ,{ clubName: 'FBHL Tampa Bay Lightning', clubId: 3934, name: 'Tampa Bay Lightning', abbreviation: 'TB', conference: 'East', division: 'Atlantic', platform: 'PS4', primaryColor: '(0, 40, 104)', secondaryColor: '(255, 255, 255)', active: true }
  ,{ clubName: 'FBHL Toronto', clubId: 6343, name: 'Toronto Mapleleafs', abbreviation: 'TOR', conference: 'East', division: 'Atlantic', platform: 'PS4', primaryColor: '(0, 32, 91)', secondaryColor: '(255, 255, 255)', active: true }
  ,{ clubName: 'FBHL Vancouver Canucks', clubId: 314010, name: 'Vancouver Canucks', abbreviation: 'VAN', conference: 'West', division: 'Pacific', platform: 'PS4', primaryColor: '(0, 32, 91)', secondaryColor: '(10, 134, 61)', active: true }
  ,{ clubName: 'FBHL Washington Capitals', clubId: 9583, name: 'Washington Capitals', abbreviation: 'WSH', conference: 'East', division: 'Metropolitan', platform: 'PS4', primaryColor: '(4, 30, 66)', secondaryColor: '(200, 16, 46)', active: true }
  ,{ clubName: 'FBHL WINNIPEGJETS', clubId: 9148, name: 'Winnipeg Jets', abbreviation: 'WPG', conference: 'West', division: 'Central', platform: 'PS4', primaryColor: '(4, 30, 66)', secondaryColor: '(0, 76, 151)', active: true }
 ]

 const divisions = [{
  conferenceId: 1,
  conferenceName: 'East',
  conferenceDisplayName: 'East',
  active: true,
  divisions: [{
    divisionId: 1,
    divisionName: 'Atlantic',
    divisionDisplayName: 'Atlantic',
    active: true
  },
  {
    divisionId: 2,
    divisionName: 'Metropolitan',
    divisionDisplayName: 'Metro',
    active: false
  }]
},
{
  conferenceId: 2,
  conferenceName: 'West',
  conferenceDisplayName: 'West',
  active: false,
  divisions: [{
    divisionId: 1,
    divisionName: 'Central',
    divisionDisplayName: 'Central',
    active: true
  },
  {
    divisionId: 2,
    divisionName: 'Pacific',
    divisionDisplayName: 'Pacific',
    active: false
  }]
}]

const bins = {
  matchHistoryBinId: '61db51fd39a33573b3262564',
  playerDataBinId: '61e238ccdbe5d1308325eede'
}

const defaultCrest = 'https://media.contentapi.ea.com/content/dam/eacom/nhl/pro-clubs/custom-crests/42.png'

const sortButtons = [
  /*
  {
    id: 1,
    field: 'playerName',
    fieldName: 'Player Name',
    descending: true,
    active: false,
    alpha: true
  },*/
  {
    id: 4,
    field: 'skpoints',
    fieldName: 'Points',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },{
    id: 2,
    field: 'skgoals',
    fieldName: 'Goals',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },{
    id: 3,
    field: 'skassists',
    fieldName: 'Assists',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },{
    id: 8,
    field: 'skplusmin',
    fieldName: 'Plus/Min',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },{
    id: 5,
    field: 'skGamesPlayed',
    fieldName: 'Games Played',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },{
    id: 6,
    field: 'skhits',
    fieldName: 'Hits',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },{
    id: 7,
    field: 'skbs',
    fieldName: 'Blocked Shots',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },
]

const goaltenderSortButtons = [
  /*{
    id: 1,
    field: 'playerName',
    fieldName: 'Player Name',
    descending: true,
    active: false,
    alpha: true
  },*/
  {
    id: 2,
    field: 'gksvpct',
    fieldName: 'Save %',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },{
    id: 3,
    field: 'gkwins',
    fieldName: 'Wins',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },{
    id: 4,
    field: 'gkso',
    fieldName: 'Shutouts',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },{
    id: 5,
    field: 'gkgaa',
    fieldName: 'Goals Against Average',
    descending: false,
    active: false,
    alpha: false,
    reversed: true,
  },{
    id: 6,
    field: 'gkGamesPlayed',
    fieldName: 'Games Played',
    descending: false,
    active: false,
    alpha: false,
    reversed: false,
  },
]

const skaterGoalieToggleButtons = [
  {
    id: 1,
    field: 'skaters',
    fieldName: 'Skaters',
    active: false,
  },{
    id: 2,
    field: 'goaltenders',
    fieldName: 'Goaltenders',
    active: false,
  }
]

const gkStatCols = [
  {
    id: uuidv4(),
    columnLabel: 'GP',
    statName: 'gkGamesPlayed',
    toolTip: 'Games Played'
  },{
    id: uuidv4(),
    columnLabel: 'W',
    statName: 'gkwins',
    toolTip: 'Wins'
  },{
    id: uuidv4(),
    columnLabel: 'W%',
    statName: 'gkwinpct',
    toolTip: 'Win Percentage'
  },{
    id: uuidv4(),
    columnLabel: 'GAA',
    statName: 'gkgaa',
    toolTip: 'Goals Against Average'
  },{
    id: uuidv4(),
    columnLabel: 'SV%',
    statName: 'gksvpct',
    toolTip: 'Save Percentage'
  },{
    id: uuidv4(),
    columnLabel: 'SO',
    statName: 'gkso',
    toolTip: 'Shutouts'
  }
]

const statCols = [
  {
    id: uuidv4(),
    columnLabel: 'P',
    statName: 'points',
    toolTip: 'Points'
  },{
    id: uuidv4(),
    columnLabel: 'G',
    statName: 'goals',
    toolTip: 'Goals'
  },{
    id: uuidv4(),
    columnLabel: 'A',
    statName: 'assists',
    toolTip: 'Assists'
  },{
    id: uuidv4(),
    columnLabel: '+/-',
    statName: 'plusmin',
    toolTip: 'Plus/Minus'
  },{
    id: uuidv4(),
    columnLabel: 'GP',
    statName: 'gamesPlayed',
    toolTip: 'Games Played'
  },{
    id: uuidv4(),
    columnLabel: 'H',
    statName: 'hits',
    toolTip: 'Hits'
  },{
    id: uuidv4(),
    columnLabel: 'BS',
    statName: 'blockedShots',
    toolTip: 'Blocked Shots'
  }
]

const teamStatCols = [
  {
    id: uuidv4(),
    columnLabel: 'GP',
    statName: 'gamesPlayed',
    toolTip: 'Games Played'
  },{
    id: uuidv4(),
    columnLabel: 'W',
    statName: 'wins',
    toolTip: 'Wins'
  },{
    id: uuidv4(),
    columnLabel: 'L',
    statName: 'losses',
    toolTip: 'Losses'
  },{
    id: uuidv4(),
    columnLabel: 'OTL',
    statName: 'overtimeLosses',
    toolTip: 'Overtime Losses'
  },
  {
    id: uuidv4(),
    columnLabel: 'GS',
    statName: 'goalsScored',
    toolTip: 'Goals Scored'
  },
  {
    id: uuidv4(),
    columnLabel: 'GA',
    statName: 'goalsAllowed',
    toolTip: 'Goals Allowed'
  },
]

const dataPointRowSpec = [
  {
    id: 1
    ,propertyName: 'shots'
    ,fullName: 'Shots'
    ,greaterIsBetter: true
  },{
    id: 2
    ,propertyName: 'hits'
    ,fullName: 'Hits'
    ,greaterIsBetter: true
  },{
    id: 3
    ,propertyName: 'passingPct'
    ,fullName: 'Passing %'
    ,greaterIsBetter: true
  },{
    id: 4
    ,propertyName: 'faceoffPct'
    ,fullName: 'Faceoff %'
    ,greaterIsBetter: true
  },{
    id: 5
    ,propertyName: 'penaltyMins'
    ,fullName: 'Penalty Mins'
    ,greaterIsBetter: false
  }
]


const translatePositions = [
  {
    position: 'leftWing',
    posSorted: '4',
    abbreviation: 'LW',
    fullName: 'Left Wing',
    positionGroupTitle: 'Wing',
    positionGroupValue: 'wing',
    lineGroup: 'Forward',
  },
  {
    position: 'rightWing',
    posSorted: '3',
    abbreviation: 'RW',
    fullName: 'Right Wing',
    positionGroupTitle: 'Wing',
    positionGroupValue: 'wing',
    lineGroup: 'Forward',
  },
  {
    position: 'center',
    posSorted: '5',
    abbreviation: 'C',
    fullName: 'Center',
    positionGroupTitle: 'Center',
    positionGroupValue: 'center',
    lineGroup: 'Forward',
  },
  {
    position: 'defensemen',
    posSorted: '2',
    abbreviation: 'LD',
    fullName: 'Left Defenseman',
    positionGroupTitle: 'Defense',
    positionGroupValue: 'defense',
    lineGroup: 'Defense',
  },
  {
    position: 'defensemen',
    posSorted: '1',
    abbreviation: 'RD',
    fullName: 'Right Defenseman',
    positionGroupTitle: 'Defense',
    positionGroupValue: 'defense',
    lineGroup: 'Defense',
  },
  {
    position: 'goaltender',
    posSorted: '0',
    abbreviation: 'G',
    fullName: 'Goaltender',
    positionGroupTitle: 'Goaltender',
    positionGroupValue: 'goaltender',
    lineGroup: 'Goaltender',
  },
]


const leadersSpec = [
  {
    id: 2,
    propName: 'goals',
    fullStatName: 'Goal',
    statName: 'skgoals'
  },{
    id: 3,
    propName: 'assists',
    fullStatName: 'Assist',
    statName: 'skassists'
  },{
    id: 4,
    propName: 'shots',
    fullStatName: 'Shot',
    statName: 'skshots'
  },{
    id: 5,
    propName: 'hits',
    fullStatName: 'Hit',
    statName: 'skhits'
  }
]

const topPlayers = [
  {
    title: 'Most Points',
    stat: 'points',
    sortField: { field:'skpoints', descending:true, alpha:false }
  },{
    title: 'Most Goals',
    stat: 'goals',
    sortField: { field:'skgoals', descending:true, alpha:false }
  },{
    title: 'Most Assists',
    stat: 'assists',
    sortField: { field:'skassists', descending:true, alpha:false }
  }
]

const playerDetailStats = [
  {
    id: uuidv4(),
    category: 'offense',
    categoryTitle: 'Offensive Stats',
    stats: [
      {
        id: uuidv4(),
        statTitle: 'Points Per Game',
        baseStatName: 'skpoints',
        statName: 'skpointspg',
        type: 'perGame',
      },
      {
        id: uuidv4(),
        statTitle: 'Goals Per Game',
        baseStatName: 'skgoals',
        statName: 'skgoalspg',
        type: 'perGame',
      },
      {
        id: uuidv4(),
        statTitle: 'Assists Per Game',
        baseStatName: 'skassists',
        statName: 'skassistspg',
        type: 'perGame',
      },
      {
        id: uuidv4(),
        statTitle: 'Shots Per Game',
        baseStatName: 'skshots',
        statName: 'skshotspg',
        type: 'perGame',
      },
      {
        id: uuidv4(),
        statTitle: 'Passing Percentage',
        baseStatName: 'skpasspct',
        statName: 'skpasspct',
        type: 'percentage',
      },
    ]
  },
  {
    id: uuidv4(),
    category: 'defense',
    categoryTitle: 'Defensive Stats',
    stats: [
      {
        id: uuidv4(),
        statTitle: 'Hits Per Game',
        baseStatName: 'skhits',
        statName: 'skhitspg',
        type: 'perGame',
      },
      {
        id: uuidv4(),
        statTitle: 'Interceptions Per Game',
        baseStatName: 'skinterceptions',
        statName: 'skinterceptionspg',
        type: 'perGame',
      },
      {
        id: uuidv4(),
        statTitle: 'Takeaways Per Game',
        baseStatName: 'sktakeaways',
        statName: 'sktakeawayspg',
        type: 'perGame',
      },
      {
        id: uuidv4(),
        statTitle: 'Blocked Shots Per Game',
        baseStatName: 'skbs',
        statName: 'skblockedshotspg',
        type: 'perGame',
      },
    ]
  },
]

const leagueStandingsColumns = [
  {
    title: 'RNK',
    position: 'center',
  },{
    title: 'Team',
    position: 'start',
  },{
    title: 'GP',
    position: 'center',
  },{
    title: 'W',
    position: 'center',
  },{
    title: 'L',
    position: 'center',
  },{
    title: 'OTL',
    position: 'center',
  },{
    title: 'PTS',
    position: 'center',
  },{
    title: 'GF',
    position: 'center',
  },{
    title: 'GA',
    position: 'center',
  },{
    title: 'DIFF',
    position: 'center',
  },{
    title: 'STRK',
    position: 'center',
  }
]

const playerStandingsColumns = {
  all: [
    {
      title: 'RNK',
      position: 'center',
    },
    {
      title: 'Player',
      position: 'start',
    },
    {
      title: 'Team',
      position: 'start',
    },
    {
      title: 'POS',
      position: 'center',
    },
  ],
  points: [{
    title: 'P',
    position: 'center',
  }],
  goals: [{
    title: 'G',
    position: 'center',
  }],
  assists: [{
    title: 'A',
    position: 'center',
  }],
}

const matchTypeButtonGroup = [
  {
    id: 1,
    type: 'all',
    display: 'All Games'
  },{
    id: 2,
    type: 'scheduled',
    display: 'Scheduled Games'
  },{
    id: 3,
    type: 'played',
    display: 'Completed Games'
  }
]

const obj = { dashboardButtons, bins, defaultCrest, teams, sortButtons, statCols, teamStatCols, dataPointRowSpec, translatePositions, leadersSpec, gkStatCols, skaterGoalieToggleButtons, topPlayers, playerDetailStats, leagueStandingsColumns, playerStandingsColumns, matchTypeButtonGroup, divisions, goaltenderSortButtons }

export default obj