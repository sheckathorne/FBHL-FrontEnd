import React from 'react'
import { useOutletContext } from 'react-router-dom'
import PlayersAndPaginationDisplay from './PlayersAndPaginationDisplay'

const PlayersDisplay = () => {
  const contextObj = useOutletContext()
  const rankedFilteredPlayers = contextObj.rankedFilteredPlayers

  return (
    <PlayersAndPaginationDisplay
      sortField={contextObj.sortField}
      playerIsRanked={contextObj.playerIsRankedValue}
      playerSearch={contextObj.playerSearch}
      rankedFilteredPlayers={rankedFilteredPlayers}
      playersActivePage={contextObj.playersActivePage}
      itemsPerPage={contextObj.itemsPerPage}
      delta={contextObj.delta}
      handlePaginationClick={contextObj.handlePaginationClick}
      queriedPlayer={contextObj.queriedPlayer}
      playerDetailStats={contextObj.playerDetailStats}
    />
  )
}

export default PlayersDisplay