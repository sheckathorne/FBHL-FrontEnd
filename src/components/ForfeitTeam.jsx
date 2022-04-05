import { Form, Row, Col, Image } from 'react-bootstrap'

const ForfeitTeam = ({ team, textClass, rowClass, themeClass, addDefaultSrc, winningTeam, setWinningTeam }) => {
  const isChecked = winningTeam === team.id

  return (
    <Row className={rowClass}>
      <Col xs={1} className='align-self-center'>
        <Form.Check 
          id={team.id}
          type="radio"
          label='' 
          name="winningTeam"
          onClick={() => setWinningTeam(team.id)}
          onChange={() => false}
          checked={isChecked}
        />
      </Col>
      <Col xs={2}>
        <Image className='match-card-avatar pointer-cursor' onClick={() => setWinningTeam(team.id)} alt={team.name} onError={addDefaultSrc} src={require(`../resources/team-logos/${team.abbreviation}.png`)} />
      </Col>
      <Col className='my-auto text-start pointer-cursor' onClick={() => setWinningTeam(team.id)}>
        <h6 className={`${textClass} ${themeClass} vertically-centered-text`}>{team.name}</h6>
      </Col>
    </Row>
  )
}

export default ForfeitTeam