import React from 'react'
import { Row, Col, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import data from '../helpers/data.js'

const SmallMatchResultCard = ({ match, themeClass, lightTheme }) => {
  let navigate = useNavigate('')
  const addDefaultSrc = (e) => e.target.src = data.defaultCrest

  const url = `/calendar?matchId=${match.matchId}`
  const darkCardClass = lightTheme ? '' : ' dark'
  const winnerClass = 'fw-bolder'
  const loserClass = 'fw-light'

  const awayTeam = {
    team: data.teams.find(team => team.clubId.toString() === match.clubs[0].clubId),
    score: match.clubs[0].data.goals
  }

  const homeTeam = {
    team: data.teams.find(team => team.clubId.toString() === match.clubs[1].clubId),
    score: match.clubs[1].data.goals
  }

  const teams = [{
    teamName: awayTeam.team.name,
    abbreviation: awayTeam.team.abbreviation,
    textClass: `${themeClass} ${awayTeam.score > homeTeam.score ? winnerClass : loserClass} vertically-centered-text`,
    score: awayTeam.score,
  },{
    teamName: homeTeam.team.name,
    abbreviation: homeTeam.team.abbreviation,
    textClass: `${themeClass} ${awayTeam.score > homeTeam.score ? loserClass : winnerClass} vertically-centered-text`,
    score: homeTeam.score,
  }]

  const TeamRow = ({ teamName, abbreviation, textClass, score }) => (
    <Row className='d-flex align-items-center mt-2'>
      <Col xs={2}>
        <Image className='team-dropdown-card-logo' alt={teamName} onError={addDefaultSrc} src={require(`../resources/team-logos/${abbreviation}.png`)} />
      </Col>
      <Col xs={6}>
        <h6 className={textClass}>
          <small>{teamName}</small>
        </h6>
      </Col>
      <Col xs={3}>
        <h6 className={`text-center ${textClass}`}>
          <small>{score}</small>
        </h6>
      </Col>
    </Row>
  )

  return (
    <div className={`small-match-result-card pointer-cursor${darkCardClass}`} onClick={() => navigate(url)}>
      <Col className='pt-3 pb-3' xs={{ span: 11, offset: 1 }}>
        <Row>
          <Col>
            <h6 className={`${themeClass} small-match-result-card-date`}>
              <small className='fw-light'>{dayjs.unix(match.timestamp).format('MMM D h:mm A') }</small>
            </h6>
          </Col>
        </Row>
        {teams.map((team,i) =>
          <TeamRow key={i} teamName={team.teamName} abbreviation={team.abbreviation} textClass={team.textClass} score={team.score} />
        )}
      </Col>
    </div>
  )
}

export default SmallMatchResultCard