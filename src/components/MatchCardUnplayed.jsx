import React, { useContext, useState } from 'react'
import MatchCardTeamRow from './MatchCardTeamRow'
import { Container, Row, Col, Button, Collapse } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import data from '../helpers/data.js'
import dayjs from 'dayjs'
import Calendar from 'react-calendar'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSchedule, modifySchedule } from '../reducers/scheduleReducer'
import TimePickerForm from './TimePickerForm'

const MatchCardUnplayed = ({ id, match, addDefaultSrc, goToLastPaginationPage }) => {
  const [ editIsOpen, setEditIsOpen ] = useState(false)
  const [ deleteConfirmIsOpen, setDeleteConfirmIsOpen ] = useState(false)
  const [ selectedDate, setSelectedDate ]  = useState(dayjs.unix(match.timestamp).startOf('day').toDate())
  const [ selectedTime, setSelectedTime ] = useState(dayjs(`1/1/2020 ${match.timeString}`, 'M/D/YYYY h:mm A', 'en'))

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

  const editButtonText = editIsOpen ? 'Cancel Change' : 'Change Date/Time'

  const modifyBtnGroup = user !== null && user.role === 'admin' ?
    <Row className='mb-3 d-flex justify-content-center'>
      <Col xs={6} className='d-grid gap-2 fluid'><Button variant='warning' onClick={() => setDeleteConfirmIsOpen(true)} disabled={deleteConfirmIsOpen}>Delete</Button></Col>
      <Col xs={6} className='d-grid gap-2 fluid'><Button variant='primary' onClick={() => setEditIsOpen(!editIsOpen)} disabled={deleteConfirmIsOpen}>{editButtonText}</Button></Col>
    </Row> : null

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
              {modifyBtnGroup}
            </Col>
          </Row>
        </Container>
        <Collapse in={deleteConfirmIsOpen}>
          <Container>
          <Row className='mb-3 d-flex justify-content-center'>
              <Col className='d-grid gap-2 fluid'>
                <Button variant='primary' onClick={() => setDeleteConfirmIsOpen(false)}>Cancel Deletion</Button>
              </Col>
            </Row>
            <Row className='mb-3 d-flex justify-content-center'>
              <Col className='d-grid gap-2 fluid'>
                <Button variant='danger' onClick={handleDeleteClick(id)}>Permanently Delete</Button>
              </Col>
            </Row>
          </Container>
        </Collapse>
        <Collapse in={editIsOpen}>
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
                  <Button variant='success' onClick={handleSubmitClick(id,selectedDate)}>Submit Change</Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Collapse>
      </div>
    </div>
  )
}

export default MatchCardUnplayed