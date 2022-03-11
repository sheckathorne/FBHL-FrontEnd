import React from 'react'
import { Row, Col, Image } from 'react-bootstrap'

const MatchCardTeamRow = ({ addDefaultSrc, abbreviation, teamName, teamScore, textClass, rowClass, themeClass, matchWasPlayed }) => {
  const scoreCol = matchWasPlayed ?
    <Col xs={2} className='my-auto'>
      <h6 className={`${textClass} ${themeClass} vertically-centered-text`}>{teamScore}</h6>
    </Col> : null

  return (
    <Row className={rowClass}>
      <Col xs={2}>
        <Image className='match-card-avatar' alt={teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${abbreviation}.png`)} />
      </Col>
      <Col className='my-auto text-start'>
        <h6 className={`${textClass} ${themeClass} vertically-centered-text`}>{teamName}</h6>
      </Col>
      {scoreCol}
    </Row>
  )
}

export default MatchCardTeamRow