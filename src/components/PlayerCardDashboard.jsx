import React from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import PlayerCard from './PlayerCard'
import { useLocation } from 'react-router-dom'


const PlayerCardDashboard = ({ players, playerIsRanked, playerDetailStats, playerCardWidth }) => {
  const useQuery = () => {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
  }

  const lastPlayerIndex = players.length
  const query = useQuery()
  const queriedPlayerId = query.get('playerId')

  return (
    <Flipper flipKey={players}>{
      players.map((player, i) => {
        const stats = player.posSorted !== '0' ? {
          total: {
            goals: player.skgoals.toString(),
            assists: player.skassists.toString(),
            points: player.skpoints.toString(),
            plusmin: player.skplusmin.toString() },
          perGame: {
            goals: '0',
            assists: '0',
            points: '0',
            plusmin: '0' }
        } : {
          goaltender: {
            gkGamesPlayed: player.gkGamesPlayed.toString(),
            gkgaa: player.gkgaa.toString(),
            gksvpct: player.gksvpct.toString(),
            gkso: player.gkso.toString() },
          perGame: {
            goals: '0',
            assists: '0',
            points: '0',
            plusmin: '0' } }

        return (
          <Flipped key={player.playerId} flipId={player.playerId}>
            <PlayerCard
              key={player.playerId}
              name={player.playerName}
              teamId={player.teamId}
              stats={stats}
              playerId={player.playerId}
              marginClass={lastPlayerIndex === i + 1 ? 'mb-4' : 'mb-2'}
              rank={player.rank}
              playerIsRanked={player.posSorted === '0' ? player.playerIsRanked : playerIsRanked}
              posSorted={player.posSorted}
              playerCardClickSource='players'
              playerDetailStats={queriedPlayerId === player.playerId ? playerDetailStats : null}
              playerCardWidth={playerCardWidth}
            />
          </Flipped>
        )
      })}
    </Flipper>
  )
}

export default PlayerCardDashboard