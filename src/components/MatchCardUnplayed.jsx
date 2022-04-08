import React, { useContext, useState } from 'react'
import MatchCardTeamRow from './MatchCardTeamRow'
import { Container, Row, Col, Button, Collapse, DropdownButton, Dropdown, Form } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import data from '../helpers/data.js'
import dayjs from 'dayjs'
import Calendar from 'react-calendar'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSchedule, modifySchedule } from '../reducers/scheduleReducer'
import { createForfeit } from '../reducers/forfeitReducer'
import TimePickerForm from './TimePickerForm'
import ForfeitTeam from './ForfeitTeam'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { HiOutlinePencil } from 'react-icons/hi'
import { MdDoneOutline } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid'

const MatchCardUnplayed = ({ id, match, addDefaultSrc, goToLastPaginationPage }) => {
  const [ editIsOpen, setEditIsOpen ] = useState(false)
  const [ deleteConfirmIsOpen, setDeleteConfirmIsOpen ] = useState(false)
  const [ forfeitIsOpen, setForfeitIsOpen ] = useState(false)
  const [ finishedCollapsing, setFinishedCollapsing ] = useState(true)
  const [ selectedDate, setSelectedDate ]  = useState(dayjs.unix(match.timestamp).startOf('day').toDate())
  const [ selectedTime, setSelectedTime ] = useState(dayjs(`1/1/2020 ${match.timeString}`, 'M/D/YYYY h:mm A', 'en'))
  const [ winningTeam, setWinningTeam ] = useState('')
  const [ overtimeLoss, setOvertimeLoss ] = useState(false)

  const user = useSelector(state => state.user.user)

  const dispatch = useDispatch()

  const onChange = (newSelectedDate) => {
    setSelectedDate(newSelectedDate)
  }

  const lightTheme = useContext(ThemeContext).value === 'light'
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const darkCardClass = lightTheme ? '' : ' dark'

  const teamsArr = [{
    id: match.teams[0],
    name: data.teams.find(team => team.clubId.toString() === match.teams[0]).name,
    abbreviation: data.teams.find(team => team.clubId.toString() === match.teams[0]).abbreviation,
  },
  {
    id: match.teams[1],
    name: data.teams.find(team => team.clubId.toString() === match.teams[1]).name,
    abbreviation: data.teams.find(team => team.clubId.toString() === match.teams[1]).abbreviation,
  }]

  const handleDeleteClick = (id) => () => {
    setDeleteConfirmIsOpen(false)
    setEditIsOpen(false)
    dispatch(deleteSchedule(id))
    goToLastPaginationPage()
  }

  const handleSubmitClick = (id, selectedDate) => () => {
    goToLastPaginationPage()
    dispatch(modifySchedule(id, { _id: id, teams: match.teams, matchDate: dayjs(selectedDate).format('M/D/YYYY'), timeString: dayjs(selectedTime).format('h:mm A') }))
    setEditIsOpen(false)
  }

  const handleOpenEditClick = () => {
    setEditIsOpen(!editIsOpen)
    setFinishedCollapsing(false)
  }

  const handleOpenDeleteClick = () => {
    setDeleteConfirmIsOpen(true)
    setFinishedCollapsing(false)
  }

  const handleForfeitOpenClick = () => {
    setForfeitIsOpen(true)
    setFinishedCollapsing(false)
  }

  const handleForfeitSubmit = (winnerId) => () => {
    const newForfeit = {
      matchId: uuidv4(),
      timestamp: match.timestamp,
      matchDate: match.matchDate,
      winningClub: winnerId,
      losingClub: teamsArr.find(team => team.id !== winnerId).id,
      overtimeLoss
    }

    dispatch(createForfeit(newForfeit))
    handleCancelForfeit()
  }

  const handleCancelForfeit = () => {
    setForfeitIsOpen(false)
    setWinningTeam('')
    setOvertimeLoss(false)
  }

  const optionsButton = user !== null && user.role === 'admin' && finishedCollapsing ?
    <Row className='mb-3 d-flex justify-content-center'>
      <Col xs={12} className='d-grid gap-2 fluid'>
        <DropdownButton className='d-grid gap-2 fluid align-items-center' variant='primary' menuVariant='dark' title='Options'>
          <Dropdown.Item onClick={handleOpenEditClick}><Row className='d-flex justify-content-center'><Col xs={1}><HiOutlinePencil color='DodgerBlue'/></Col><Col>Change Date</Col></Row></Dropdown.Item>
          <Dropdown.Item onClick={handleOpenDeleteClick}><Row className='d-flex justify-content-center'><Col xs={1}><RiDeleteBin5Line color='FireBrick'/></Col><Col>Delete</Col></Row></Dropdown.Item>
          <Dropdown.Item onClick={handleForfeitOpenClick}><Row className='d-flex justify-content-center'><Col xs={1}><MdDoneOutline color='ForestGreen'/></Col><Col>Forfeit</Col></Row></Dropdown.Item>
        </DropdownButton>
      </Col>
    </Row> : null

  const otlCheck = (
    <>
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
    </>
  )

  return(
    <div className='mb-2 d-grid'>
      <div className={`no-hover small-match-result-card${darkCardClass}`} value={match.matchId}>
        <Container>
          <Row className='mt-2'>
            <Col className='d-grid fluid'>
              {teamsArr.map((team,i) =>
                <MatchCardTeamRow
                  key={i}
                  addDefaultSrc={addDefaultSrc}
                  abbreviation={team.abbreviation}
                  teamName={team.name}
                  teamScore={''}
                  textClass='fw-light'
                  rowClass={i===0 ? 'mt-2' : 'mb-2'}
                  themeClass={themeClass}
                  matchWasPlayed={match.matchWasPlayed}
                />
              )}
              <Row>
                <Col className='my-auto text-center d-grid gap-2 fluid'>
                  <h6 className={themeClass}><small>* Scheduled for {dayjs.unix(match.timestamp).format('MMMM D, YYYY')} at {match.timeString}</small></h6>
                </Col>
              </Row>
              {optionsButton}
            </Col>
          </Row>
        </Container>
        <Collapse in={deleteConfirmIsOpen} onExited={() => setFinishedCollapsing(true)}>
          <Container>
          <Row className='mb-3 d-flex justify-content-center'>
              <Col className='d-grid gap-2 fluid'>
                <Button variant='warning' onClick={() => setDeleteConfirmIsOpen(false)}>Cancel Deletion</Button>
              </Col>
            </Row>
            <Row className='mb-3 d-flex justify-content-center'>
              <Col className='d-grid gap-2 fluid'>
                <Button variant='danger' onClick={handleDeleteClick(id)}>Permanently Delete</Button>
              </Col>
            </Row>
          </Container>
        </Collapse>
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
                  {otlCheck}
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
      </div>
    </div>
  )
}

export default MatchCardUnplayed