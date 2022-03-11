const generateRankNumber = (i, allPlayersStatValue, currentPlayerStatValue) => {
  let n = 0
  if ( i === 0 ) {
    n = 1
  } else if ( i > 0 && currentPlayerStatValue === allPlayersStatValue[i-1] ) {
    n = allPlayersStatValue.findIndex(p => p === currentPlayerStatValue) + 1
  } else {
    n = i + 1
  }
  return n
}

export default generateRankNumber