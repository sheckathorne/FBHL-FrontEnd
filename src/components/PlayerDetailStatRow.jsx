import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { AiOutlineCaretRight, AiOutlineCaretDown } from 'react-icons/ai'
import PlayerDetailExpandedStatRow from './PlayerDetailExpandedStatRow'
import chelService from '../services/api'

const PlayerDetailStatRow = ({ setChartArr, statTitle, statName, actualStatName, statAverage, players, player, playerStatValue, lightTheme, ordinal_suffix_of, statType, selectedStat, statClicked, itemsPerPage, color }) => {
  const [ topPlayers, setTopPlayers ] = useState([])

  useEffect(() => {
    const url = `/playerData/topByStat?skater=true&statName=${actualStatName}&topCount=5&sort=desc`
    chelService.getData(url).then(players => {
      setTopPlayers(players)
    })
  },[actualStatName])

  const rowIsSelected = selectedStat.title === statTitle
  const titleClass = lightTheme ? '' : 'dark-theme-text'
  const valueClass = lightTheme ? 'fw-light' : 'dark-theme-text fw-light'
  const percentageStat = statType === 'percentage'

  const rankField = `${actualStatName}_rank`
  const playerId = player.playerId
  const currentPlayerRankByStat = player[rankField]

  useEffect(() => {
    const chartData = topPlayers
      .map(player => ({
        playerName: player.playerName,
        value: player.value,
        isSelectedPlayer: player.playerId === playerId
      }))
      .concat({ 
        playerName: 'Average',
        value: statAverage,
        isSelectedPlayer: false
      })

    //if current selected player is not in the top five, add the player to the array
    if ( chartData.every(player => !player.isSelectedPlayer) ) {
      console.log(player)
      chartData.push({ playerName: player.playerName, value: player[actualStatName], isSelectedPlayer: true })
    }
  
    chartData.sort((a,b) => a.value - b.value)
    const obj = { category: statName, data: chartData  }
  
    setChartArr(arr => {
      const newArr = arr.map(item => item.category !== obj.category ? item : obj )
      if ( !newArr.map(a => a.category).includes(obj.category) ) {
        newArr.push(obj)
      }

      return newArr
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[topPlayers])

  const caret = rowIsSelected ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />

  const expandedRow = rowIsSelected ? (
    topPlayers.map((player,i) =>
      <Row key={i} className={topPlayers.length === i + 1 ? 'mb-4' : ''}>
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