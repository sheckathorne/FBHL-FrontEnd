import React, { useContext } from 'react'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { StyledEngineProvider } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import MobileContext from './MobileContext'

const StatRowBar = ({ homeTeamColor, awayTeamColor, homeTeamDataPoint, awayTeamDataPoint }) => {
  const isMobile = useContext(MobileContext)
  const height = isMobile ? 2.5 : 5
  const homeProportion = (parseFloat(homeTeamDataPoint)/(parseFloat(homeTeamDataPoint) + parseFloat(awayTeamDataPoint))) * 100

  const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: height,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: `rgb${awayTeamColor}`,
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: `rgb${homeTeamColor}`,
    },
  }))

  return (
    <StyledEngineProvider injectFirst>
      <BorderLinearProgress variant='determinate' value={homeProportion} />
    </StyledEngineProvider>
  )
}

export default StatRowBar