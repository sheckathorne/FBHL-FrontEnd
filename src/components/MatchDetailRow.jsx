import React, { useContext } from 'react'
import { Row, Col } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import StatRowBar from './StatRowBar'

const MatchDetailRow = ({ homeTeamDataPoint, awayTeamDataPoint, dataPointTitle, homeTeamColor, awayTeamColor }) => {
  const lightTheme = useContext(ThemeContext).value === 'light'
  return (
    <>
      <Row>
        <Col className='text-center stat-title-row'>
          <h6 className={lightTheme ? '' : 'dark-theme-text'}><small className='tiny-caps'>{dataPointTitle}</small></h6>
        </Col>
      </Row>
      <Row className='d-flex align-items-center stat-bar-row'>
        <Col xs={2} lg={1} className='text-center align-self-center'>
          <h6 className={`${lightTheme ? '' : 'dark-theme-text'}  vertically-centered-text`}><small>{homeTeamDataPoint}</small></h6>
        </Col>
        <Col>
          <StatRowBar
            homeTeamColor={homeTeamColor}
            awayTeamColor={awayTeamColor}
            homeTeamDataPoint={homeTeamDataPoint}
            awayTeamDataPoint={awayTeamDataPoint}
          />
        </Col>
        <Col xs={2} lg={1} className='text-center align-self-center'>
          <h6 className={`${lightTheme ? '' : 'dark-theme-text'}  vertically-centered-text`}><small>{awayTeamDataPoint}</small></h6>
        </Col>
      </Row>
    </>
  )
}

export default MatchDetailRow