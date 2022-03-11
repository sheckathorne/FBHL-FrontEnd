import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { AiOutlineCaretRight, AiOutlineCaretDown } from 'react-icons/ai'
import PlayerDetailExpandedStatRow from './PlayerDetailExpandedStatRow'

const PlayerDetailStatRow = ({ statTitle, statName, players, calculateValuePerGameOfStat, playerStatValue, lightTheme, rankTheStat, ordinal_suffix_of, statType, selectedStat, statClicked, playerId, itemsPerPage }) => {
  const rowIsSelected = selectedStat === statTitle
  const titleClass = lightTheme ? '' : 'dark-theme-text'
  const valueClass = lightTheme ? 'fw-light' : 'dark-theme-text fw-light'
  const perGameStat = statType === 'perGame'
  const percentageStat = statType === 'percentage'

  const playersArr = players.map(player => ({
    value: perGameStat ? parseFloat(calculateValuePerGameOfStat(player,statName)) : parseFloat(player[`${statName}`]),
    playerName: player.playerName,
    playerId: player.playerId,
    gamesPlayed: player.skGamesPlayed }))

  const numberOfGamesPlayedToBeRanked = (parseFloat(playersArr.sort((a,b) => b.gamesPlayed - a.gamesPlayed).slice(0,10).map(x => x.gamesPlayed).reduce((y,a) => y+a, 0))/parseFloat(10) * .33)
  const rankedPlayers = rankTheStat(playersArr.filter(player => parseFloat(player.gamesPlayed) >= numberOfGamesPlayedToBeRanked).sort((a,b) => b.value - a.value))
  const unrankedPlayers = playersArr.filter(player => parseFloat(player.gamesPlayed) < numberOfGamesPlayedToBeRanked).map(player => ({ ...player, rank: 0 }))
  const allPlayers = [...rankedPlayers, ...unrankedPlayers]
  const topFiveRankedPlayers = rankedPlayers.filter(player => player.rank <= 5)
  const currentPlayerRankByStat = allPlayers.find(s => s.playerId === playerId).rank

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
        <Col xs={6} lg={4} className='my-auto pointer-cursor' onClick={statClicked(statTitle)}>
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