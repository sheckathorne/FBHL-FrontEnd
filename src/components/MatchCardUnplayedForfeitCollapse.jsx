import { Collapse, Container, Row, Col, Form, Button } from 'react-bootstrap'
import ForfeitTeam from './ForfeitTeam'

const MatchCardUnplayedForfeitCollapse = ({ overtimeLoss, setOvertimeLoss, forfeitIsOpen, setFinishedCollapsing, ineligiblePlayer, setIneligiblePlayer, teamsArr, themeClass, addDefaultSrc, winningTeam, setWinningTeam, handleCancelForfeit, handleForfeitSubmit }) => (
  <Collapse in={forfeitIsOpen} onExited={() => setFinishedCollapsing(true)}>
    <div>
      <Container>
        <Form>
          <Form.Label className='mt-4 fw-bold'>Select the winning team</Form.Label>
            {teamsArr.map((team, i) =>
              <ForfeitTeam 
                key={team.id}
                team={team}
                textClass='fw-light'
                rowClass={i===0 ? 'mt-2' : 'mb-2'}
                themeClass={themeClass}
                addDefaultSrc={addDefaultSrc}
                winningTeam={winningTeam}
                setWinningTeam={setWinningTeam}
              />
            )}
          <Row>
            <Col xs={1}>
              <Form.Check 
                id='otlCheck'
                type="checkBox"
                label='' 
                name="overtimeLoss"
                onClick={() => setOvertimeLoss(!overtimeLoss)}
                onChange={() => false}
              />
            </Col>
            <Col>
              <Form.Label onClick={() => setOvertimeLoss(!overtimeLoss)}>Count forfeit as an overtime loss</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col xs={1}>
              <Form.Check 
                id='ineligibleCheck'
                type="checkBox"
                label='' 
                name="ineligiblePlayer"
                onClick={() => setIneligiblePlayer(!ineligiblePlayer)}
                onChange={() => false}
              />
            </Col>
            <Col>
              <Form.Label onClick={() => setOvertimeLoss(!overtimeLoss)}>Forfeit because of ineligible player</Form.Label>
            </Col>
          </Row>
          <Container>
            <Row className='mb-3 d-flex justify-content-center'>
              <Col className='d-grid gap-2 fluid'>
                <Button variant='warning' onClick={handleCancelForfeit}>Cancel Forfeit</Button>
              </Col>
            </Row>
            <Row className='mb-3 d-flex justify-content-center'>
              <Col className='d-grid gap-2 fluid'>
                <Button variant='success' onClick={handleForfeitSubmit(winningTeam)} disabled={winningTeam === ''}>Submit</Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Container>
    </div>
  </Collapse>
)

export default MatchCardUnplayedForfeitCollapse