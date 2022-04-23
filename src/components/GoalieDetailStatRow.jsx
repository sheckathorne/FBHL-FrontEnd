import { Row, Col } from 'react-bootstrap'

const GoalieDetailStatRow = ({ title, homeTeamStat, awayTeamStat, lightTheme }) => {
  return (
    <Row className='match-detail-text'>
      <Col xs={2} className='my-auto text-center align-self-center'>
        <h6 className={lightTheme ? '' : 'dark-theme-text'}><small>{homeTeamStat}</small></h6>
      </Col>
      <Col xs={8} className='my-auto text-center align-self-center'>
        <h6 className={lightTheme ? '' : 'dark-theme-text'}><small>{title}</small></h6>
      </Col>
      <Col xs={2} className='my-auto text-center align-self-center'>
        <h6 className={lightTheme ? '' : 'dark-theme-text'}><small>{awayTeamStat}</small></h6>
      </Col>
    </Row>
  )
}

export default GoalieDetailStatRow