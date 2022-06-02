import React, { useContext, useState } from 'react'
import PlayerDetailStatRow from './PlayerDetailStatRow'
import { Row, Col, Popover } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import MobileContext from './MobileContext'
import PlayerDetailStatCategoryTitleRow from './PlayerDetailStatCategoryTitleRow'
import generateRankNumber from '../helpers/rankFunction'
import PlayerStatsDoughnutChart from './PlayerStatsDoughnutChart'


const PlayerDetailStatCategory = ({ category, player, players, itemsPerPage }) => {
  const [ selectedStat, setSelectedStat ] = useState('')

  const isMobile = useContext(MobileContext)
  const lightTheme = useContext(ThemeContext).value === 'light'
  const actionTxt = isMobile ? 'Tap' : 'Click'

  const statClicked = (statTitle) => () => {
    if ( statTitle === selectedStat ) {
      setSelectedStat('')
    } else {
      setSelectedStat(statTitle)
    }
  }

  const calculateValuePerGameOfStat = (player, statName) => (parseFloat(player[`${statName}`])/parseFloat(player.skGamesPlayed)).toFixed(2).toString()

  const generateCustomStats = (player) => (
    {
      skpointspg: calculateValuePerGameOfStat(player,'skpoints'),
      skgoalspg: calculateValuePerGameOfStat(player,'skgoals'),
      skassistspg: calculateValuePerGameOfStat(player,'skassists'),
      skshotspg: calculateValuePerGameOfStat(player,'skshots'),
      skpasspct: parseFloat(player.skpasspct),
      skhitspg: calculateValuePerGameOfStat(player,'skhits'),
      skinterceptionspg: calculateValuePerGameOfStat(player,'skinterceptions'),
      sktakeawayspg: calculateValuePerGameOfStat(player,'sktakeaways'),
      skblockedshotspg: calculateValuePerGameOfStat(player,'skbs'),
    }
  )

  const playerStats = generateCustomStats(player)

  const rankTheStat = (stats) => stats.map((stat,i) => ({ rank: generateRankNumber(i, stats, stat), ...stat }))

  const ordinal_suffix_of = (i) => {
    let j = i % 10,
      k = i % 100
    if (j === 1 && k !== 11) {
      return i + 'st'
    }
    if (j === 2 && k !== 12) {
      return i + 'nd'
    }
    if (j === 3 && k !== 13) {
      return i + 'rd'
    }
    return i + 'th'
  }

  const popover = (
    <Popover id='popover-basic'>
      <Popover.Header as='h3'>Rank Criteria:</Popover.Header>
      <Popover.Body>
        To be ranked for these stats, you must have played in one-third the number of games as the average of the ten players who have played the most games.
        <br></br><br></br>
        For example, if the average of number of games played by the top 10 is 33, then you must play in at least 11 games to be ranked.
        <br></br><br></br>
        For passing percentage, you must have attempted 60% of the average of the top ten passing attempts to be ranked.
      </Popover.Body>
    </Popover>
  )
  
  const chartColors = {
    'legend-red': 'rgb(255, 99, 132)',
    'legend-orange': 'rgb(255, 159, 64)',
    'legend-yellow': 'rgb(255, 205, 86)',
    'legend-green': 'rgb(75, 192, 192)',
    'legend-blue': 'rgb(54, 162, 235)',
    'legend-purple': 'rgb(153, 102, 255)',
    'legend-grey': 'rgb(201, 203, 207)'
  };

  const generateChartData = (playerStats, categoryStats) => {
    const chartData = {}

    for ( const [key, val] of Object.entries(playerStats) ) {
      if ( categoryStats.map(x => x.statName).includes(key) && key.includes('pg') ) {
        const title = categoryStats.find(stat => stat.statName === key).statTitle
        chartData[title] = val
      }
    }

    return chartData
  }

  const chartData = generateChartData(playerStats, category.stats)
  const thisChartsColors = Object.keys(chartColors).slice(0, Object.keys(chartData).length)

  return (
    <Row className='mt-2 mb-4'>
      <Col lg={9}>
        <PlayerDetailStatCategoryTitleRow lightTheme={lightTheme} actionTxt={actionTxt} popover={popover} categoryTitle={category.categoryTitle} />
        {category.stats.map((stat,i) => (
          <PlayerDetailStatRow
            key={stat.id}
            statTitle={stat.statTitle}
            statName={stat.baseStatName}
            players={players}
            calculateValuePerGameOfStat={calculateValuePerGameOfStat}
            playerStatValue={playerStats[`${stat.statName}`]}
            lightTheme={lightTheme}
            currentIndex={i}
            statCount={category.stats.length}
            rankTheStat={rankTheStat}
            ordinal_suffix_of={ordinal_suffix_of}
            statType={stat.type}
            selectedStat={selectedStat}
            statClicked={statClicked}
            playerId={player.playerId}
            itemsPerPage={itemsPerPage}
            color={thisChartsColors.includes(Object.keys(chartColors)[i]) ? Object.keys(chartColors)[i] : 'legend-black' }
          />
        ))}
      </Col>
      <Col lg={3} className='d-flex align-self-center'>
        <div style={{"height" : "150px"}}>
          <PlayerStatsDoughnutChart chartData={chartData} chartColors={chartColors} />
        </div>
      </Col>
    </Row>
  )
}

export default PlayerDetailStatCategory