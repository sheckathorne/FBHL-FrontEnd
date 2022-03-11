import React from 'react'
import LeaderDetailValue from './LeaderDetailValue'
import Row from 'react-bootstrap/Row'

const LeaderDetail = ({ playerName, playerId, teamId, playerMaxValue, playerPosition, homeTeamObj, rowCounterpart, totalRows, rowDiff, currentRow, players, handlePaginationClick }) => {
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
      players={players}
      handlePaginationClick={handlePaginationClick}
    />

  const counterPartObj = rowCounterpart ? rowCounterpart.value === 0 ? null :
    <LeaderDetailValue
      offset={counterPartOffset}
      position={rowCounterpart.positionAbbreviation}
      name={rowCounterpart.playerName}
      playerId={rowCounterpart.playerId}
      teamId={rowCounterpart.clubId}
      value={rowCounterpart.value}
      players={players}
      handlePaginationClick={handlePaginationClick}
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