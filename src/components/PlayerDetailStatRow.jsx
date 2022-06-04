import { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { AiOutlineCaretRight, AiOutlineCaretDown } from 'react-icons/ai'
import PlayerDetailExpandedStatRow from './PlayerDetailExpandedStatRow'

const PlayerDetailStatRow = ({ setChartArr, statTitle, statName, players, calculateValuePerGameOfStat, playerStatValue, lightTheme, rankTheStat, ordinal_suffix_of, statType, selectedStat, statClicked, playerId, itemsPerPage, color }) => {
  const rowIsSelected = selectedStat.title === statTitle
  const titleClass = lightTheme ? '' : 'dark-theme-text'
  const valueClass = lightTheme ? 'fw-light' : 'dark-theme-text fw-light'
  const perGameStat = statType === 'perGame'
  const percentageStat = statType === 'percentage'

  const playersArr = players.map(player => ({
    value: perGameStat ? parseFloat(calculateValuePerGameOfStat(player,statName)) : parseFloat(player[`${statName}`]),
    playerName: player.playerName,
    playerId: player.playerId,
    gamesPlayed: player.skGamesPlayed,
    skpasses: player.skpasses,
  }))

  const numberOfGamesPlayedToBeRanked = (parseFloat(playersArr.sort((a,b) => b.gamesPlayed - a.gamesPlayed).slice(0,10).map(x => x.gamesPlayed).reduce((y,a) => y+a, 0))/parseFloat(10) * .33)
  const nubmerOfPassesToBeRankedForPassPct = (parseFloat(playersArr.sort((a,b) => b.skpasses - a.skpasses).slice(0,10).map(x => x.skpasses).reduce((y,a) => y+a, 0))/parseFloat(10) * .60)

  const rankedPlayers = statName === 'skpasspct' ?
    rankTheStat(playersArr.filter(player => parseFloat(player.gamesPlayed) >= numberOfGamesPlayedToBeRanked && parseFloat(player.skpasses) >= nubmerOfPassesToBeRankedForPassPct).sort((a,b) => b.value - a.value)) :
    rankTheStat(playersArr.filter(player => parseFloat(player.gamesPlayed) >= numberOfGamesPlayedToBeRanked).sort((a,b) => b.value - a.value))
  const unrankedPlayers = statName === 'skpasspct' ?
    playersArr.filter(player => parseFloat(player.gamesPlayed) < numberOfGamesPlayedToBeRanked || parseFloat(player.skpasses) < nubmerOfPassesToBeRankedForPassPct).map(player => ({ ...player, rank: 0 })) :
    playersArr.filter(player => parseFloat(player.gamesPlayed) < numberOfGamesPlayedToBeRanked).map(player => ({ ...player, rank: 0 }))
  
  const allPlayers = [...rankedPlayers, ...unrankedPlayers]
  const topFiveRankedPlayers = rankedPlayers.filter(player => player.rank <= 5)
  const currentPlayerRankByStat = allPlayers.find(s => s.playerId === playerId).rank
  const totalStatValue = rankedPlayers.map(player => player.value).reduce((a,b) => a + b)
  const avgStatValue = (totalStatValue / rankedPlayers.length).toFixed(2)
  const chartData = topFiveRankedPlayers.map(player => ({ playerName: player.playerName, value: player.value, isSelectedPlayer: player.playerId === playerId })).concat({ playerName: 'Average', value: avgStatValue, isSelectedPlayer: false })

  //if current selected player is not in the top five, add the play to the array
  if ( chartData.every(player => !player.isSelectedPlayer) ) {
    const player = playersArr.find(player => player.playerId === playerId)
    chartData.push({ playerName: player.playerName, value: player.value, isSelectedPlayer: true })
  }

  chartData.sort((a,b) => a.value - b.value)

  useEffect(() => {
    const obj = { category: statName, data: chartData  }
    setChartArr(arr => arr.concat(obj))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const caret = rowIsSelected ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />

  const expandedRow = rowIsSelected ? (
    topFiveRankedPlayers.map((player,i) =>
      <Row key={i} className={topFiveRankedPlayers.length === i + 1 ? 'mb-4' : ''}>
        <PlayerDetailExpandedStatRow
          key={i}
          playerName={player.playerName}
          playerId={player.playerId}
          players={players}
          itemsPerPage={itemsPerPage}
          statValue={percentageStat ? player.value.toFixed(2).toString()+'%' : player.value.toFixed(2).toString()}
          rank={ordinal_suffix_of(player.rank)}
          valueClass={player.playerId === playerId ? valueClass.replace('fw-light','fw-bold fst-italic') : valueClass}
        />
      </Row>
    )
  ) : null

  return (
    <>
      <Row className='mt-1'>
        <Col xs={6} lg={4} className='my-auto pointer-cursor' onClick={() =>statClicked({ title: statTitle, name: statName })}>
          <div className={`box ${color}`}></div>
          <h6 className={titleClass + ' player-detail-row'}>{statTitle}{caret}</h6>
        </Col>
        <Col xs={3} lg={4} className='my-auto d-flex justify-content-start'>
          <h6 className={valueClass + ' player-detail-row'}>{percentageStat ? playerStatValue.toString()+'%' : playerStatValue.toString() }</h6>
        </Col>
        <Col xs={3} lg={4} className='my-auto d-flex justify-content-start'>
          <h6 className={valueClass + ' player-detail-row'}>{currentPlayerRankByStat === 0 ? 'Unranked' : ordinal_suffix_of(currentPlayerRankByStat)}</h6>
        </Col>
      </Row>
      {expandedRow}
    </>
  )
}

export default PlayerDetailStatRow