import { Collapse, Container, Row, Col, Button } from 'react-bootstrap'
import TimePickerForm from './TimePickerForm'
import Calendar from 'react-calendar'

const MatchCardUnplayedEditFormCollapse = ({ editIsOpen, setFinishedCollapsing, onChange, selectedDate, lightTheme, selectedTime, setSelectedTime, setEditIsOpen, handleSubmitClick, id }) => (
  <Collapse in={editIsOpen} onExited={() => setFinishedCollapsing(true)}>
    <div>
      <Row className='mb-2'>
        <Col className='d-flex justify-content-center mt-2'>
          <Calendar
            onChange={onChange}
            value={selectedDate}
            className={lightTheme ? 'flex-fill calendar-light match-card-calendar' : 'flex-fill calendar-dark match-card-calendar'}
          />
        </Col>
      </Row>
      <Container>
        <Row className='mb-4 mt-4 justify-content-center'>
          <Col className='d-grid fluid'>
            <TimePickerForm
              timePick={selectedTime}
              setTimePick={setSelectedTime}
              themeMode={lightTheme ? 'light' : 'dark'}
            />
          </Col>
        </Row>
      </Container>
      <Container>
      <Row className='mb-2'>
          <Col className='d-grid fluid'>
            <Button variant='warning' onClick={() => setEditIsOpen(!editIsOpen)}>Cancel Change</Button>
          </Col>
        </Row>
        <Row className='mb-2'>
          <Col className='d-grid fluid'>
            <Button variant='success' onClick={handleSubmitClick(id,selectedDate)}>Submit Change</Button>
          </Col>
        </Row>
      </Container>
    </div>
  </Collapse>
)

export default MatchCardUnplayedEditFormCollapse