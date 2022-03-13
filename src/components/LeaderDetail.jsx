import React from 'react'
import LeaderDetailValue from './LeaderDetailValue'
import Row from 'react-bootstrap/Row'

const LeaderDetail = ({ playerName, playerId, teamId, playerMaxValue, playerPosition, homeTeamObj, rowCounterpart, totalRows, rowDiff, currentRow }) => {
  const offsetValue = currentRow > totalRows - 1 - rowDiff ? 8 : 4
  const sourceObjOffset = homeTeamObj ? 0 : offsetValue
  const counterPartOffset = homeTeamObj ? offsetValue : 0

  const sourceObj = playerMaxValue === 0 ? null :
    <LeaderDetailValue
      offset={sourceObjOffset}
      position={playerPosition}
      name={playerName}
      playerId={playerId}
      teamId={teamId}
      value={playerMaxValue}
    />

  const counterPartObj = rowCounterpart ? rowCounterpart.value === 0 ? null :
    <LeaderDetailValue
      offset={counterPartOffset}
      position={rowCounterpart.positionAbbreviation}
      name={rowCounterpart.playerName}
      playerId={rowCounterpart.playerId}
      teamId={rowCounterpart.clubId}
      value={rowCounterpart.value}
    />
    : null

  const detail = homeTeamObj ? (
    <>{sourceObj}{counterPartObj}</>
  ) : (
    <>{counterPartObj}{sourceObj}</>
  )

  return (
    <><Row className='match-detail-text'>{detail}</Row></>
  )
}

export default LeaderDetail