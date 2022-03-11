import React, { useContext } from 'react'
import { Row, Col, Image, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MatchDetailRow from './MatchDetailRow'
import HorizontalDivider from './HorizontalDivider'
import ThemeContext from './ThemeContext'

const MatchDetail = ({ homeTeamData, awayTeamData, dataPointRowSpec, addDefaultSrc }) => {
  let navigate = useNavigate('')
  const lightTheme = useContext(ThemeContext).value === 'light'

  return (
    <Row>
      <Col className='match-detail-text'>
        <Row className='d-flex'>
          <Col xs='auto' className='align-self-center pointer-cursor' onClick={() => navigate(`/players/${homeTeamData.teamId}`)}><Image className='match-detail-avatar' alt={homeTeamData.teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${homeTeamData.abbreviation}.png`)} /></Col>
          <Col className='text-start align-self-center match-detail-title-row pointer-cursor' onClick={() => navigate(`/players/${homeTeamData.teamId}`)}><h5 className={lightTheme ? 'align-self-center' : 'align-self-center dark-theme-text'}>{homeTeamData.teamName}</h5></Col>
          <Col xs={2} className='text-center my-auto align-self-center match-detail-title-row'><h5 className={lightTheme ? 'align-self-center' : 'align-self-center dark-theme-text'}>{homeTeamData.goals} - {awayTeamData.goals}</h5></Col>
          <Col className='text-end align-self-center match-detail-title-row pointer-cursor' onClick={() => navigate(`/players/${awayTeamData.teamId}`)}><h5 className={lightTheme ? 'align-self-center' : 'align-self-center dark-theme-text'}>{awayTeamData.teamName}</h5></Col>
          <Col xs='auto' className='align-self-center pointer-cursor' onClick={() => navigate(`/players/${awayTeamData.teamId}`)}><Image className='match-detail-avatar' alt={awayTeamData.teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${awayTeamData.abbreviation}.png`)} /></Col>
        </Row>
        <Container><HorizontalDivider width='11' classname='justify-content-md-center'/></Container>
        {
          dataPointRowSpec.sort((a,b) => a.id - b.id).map(row =>
            <MatchDetailRow
              key={row.id}
              homeTeamDataPoint={homeTeamData[`${row.propertyName}`]}
              dataPointTitle={row.fullName}
              awayTeamDataPoint={awayTeamData[`${row.propertyName}`]}
              greaterIsBetter={row.greaterIsBetter}
              homeTeamColor={homeTeamData.color}
              awayTeamColor={awayTeamData.color}
            />
          )
        }
      </Col>
    </Row>
  )
}

export default MatchDetail