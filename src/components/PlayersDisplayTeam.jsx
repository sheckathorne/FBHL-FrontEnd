import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import PlayersAndPaginationDisplay from './PlayersAndPaginationDisplay'
import data from '../helpers/data.js'
import { Helmet, HelmetProvider } from 'react-helmet-async'


const PlayersDisplayTeam = () => {
  const contextObj = useOutletContext()
  const teamId = useParams().teamId.toString()
  const teamName = data.teams.find(team => team.clubId.toString() === teamId).name

  return (
    <HelmetProvider>
      <Helmet>
        <title>Players - {teamName}</title>
      </Helmet>
      <PlayersAndPaginationDisplay
        playerIsRanked={contextObj.playerIsRankedValue}
        rankedFilteredPlayers={contextObj.rankedFilteredPlayers}
        itemsPerPage={contextObj.itemsPerPage}
        delta={contextObj.delta}
        queriedPlayer={contextObj.queriedPlayer}
        playerDetailStats={contextObj.playerDetailStats}
        teamId={teamId}
        searchTerm={contextObj.searchTerm}
      />
    </HelmetProvider>
  )
}

export default PlayersDisplayTeam