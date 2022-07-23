import React from 'react'
import { useOutletContext } from 'react-router-dom'
import PlayersAndPaginationDisplay from './PlayersAndPaginationDisplay'

const PlayersDisplay = () => {
  const contextObj = useOutletContext()
  const rankedFilteredPlayers = contextObj.rankedFilteredPlayers

  return (
    <PlayersAndPaginationDisplay
      playerIsRanked={contextObj.playerIsRankedValue}
      rankedFilteredPlayers={rankedFilteredPlayers}
      itemsPerPage={contextObj.itemsPerPage}
      delta={contextObj.delta}
      queriedPlayer={contextObj.queriedPlayer}
      playerDetailStats={contextObj.playerDetailStats}
      searchTerm={contextObj.searchTerm}
    />
  )
}

export default PlayersDisplay