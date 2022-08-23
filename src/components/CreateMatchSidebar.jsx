import React, { useState } from 'react'
import { Offcanvas, Form, Button, Col } from 'react-bootstrap'
import Calendar from 'react-calendar'
import MatchCreateTeamDropdown from './MatchCreateTeamDropdown'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { setCreateMatchIsOpen } from '../reducers/viewToggleReducer'
import { createSchedule } from '../reducers/dayMatchesReducer'
import data from '../helpers/data'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import TimePickerForm from './TimePickerForm'
import { StyledEngineProvider } from '@mui/material/styles'

const CreateMatchSidebar = () => {
  const [ value, setValue ] = useState(dayjs().startOf('day').toDate())
  const [ timePick, setTimePick ] = useState(null)
  const [ awayTeamId, setAwayTeamId ] = useState('')
  const [ homeTeamId, setHomeTeamId ] = useState('')
  const createMatchIsOpen = useSelector(state => state.viewToggle.createMatchIsOpen)

  const dispatch = useDispatch()

  const onChange = nextValue => setValue(nextValue)
  
  const setTeamId = (type, teamId) => () => {
    if ( type === 'away' ) {
      setAwayTeamId(teamId)
    } else if ( type === 'home' ) {
      setHomeTeamId(teamId)
    }
  }

  const handleCreateMatchSubmit = async (e, awayTeamId, homeTeamId, matchDate) => {
    e.preventDefault()
    const newScheduledMatch = {
      matchDate: matchDate,
      teams: [ awayTeamId.toString(), homeTeamId.toString() ],
      timeString: dayjs(timePick).format('h:mm A')
    }

    try {
      dispatch(createSchedule(newScheduledMatch))

      const awayTeamAbbreviation = data.teams.find(team => team.clubId.toString() === newScheduledMatch.teams[0]).abbreviation
      const homeTeamAbbreviation = data.teams.find(team => team.clubId.toString() === newScheduledMatch.teams[1]).abbreviation

      dispatch(setCreateMatchIsOpen(false))
      dispatch(setNotification({ type: 'success', text: `Game bewteen ${awayTeamAbbreviation} and ${homeTeamAbbreviation} added for ${newScheduledMatch.matchDate}`, scope: 'app' }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } catch (exception) {
      dispatch(setNotification({ type: 'danger', text: 'Failed to add game to schedule', scope: 'app' }))
      setTimeout(() => {
        dispatch(clearNotification())
      },3000)
    }
  }

  return (
    <Offcanvas show={createMatchIsOpen} placement='end' onHide={() => dispatch(setCreateMatchIsOpen(false))}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          Create Match
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={(e) => handleCreateMatchSubmit(e, awayTeamId, homeTeamId, dayjs(value).format('M/D/YYYY'))}>
          <Form.Group className='mb-3' controlId='formAwayTeam'>
            <Form.Label>Away Team</Form.Label>
            <MatchCreateTeamDropdown key='away' type='away' selectedTeamId={awayTeamId} removeSelectedTeamId={homeTeamId} setTeamId={setTeamId} />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formHomeTeam'>
            <Form.Label>Home Team</Form.Label>
            <MatchCreateTeamDropdown key='home' type='home' selectedTeamId={homeTeamId} removeSelectedTeamId={awayTeamId} setTeamId={setTeamId}/>
          </Form.Group>
          <Form.Group className='mb-3' controlId='formCalendar'>
            <Form.Label>Game Date</Form.Label>
            <Col className='d-flex'>
              <Calendar
                onChange={onChange}
                value={value}
                className='flex-fill calendar-light'
              />
            </Col>
          </Form.Group>
          <Form.Group>
            <Form.Label>Game Time</Form.Label>
            <Col className='d-flex align-items-center mb-2'>
            <StyledEngineProvider injectFirst>
              <TimePickerForm
                timePick={timePick}
                setTimePick={setTimePick}
              />
            </StyledEngineProvider>
            </Col>
          </Form.Group>
          <Button type='submit' variant='primary' disabled={awayTeamId === '' || homeTeamId === '' || timePick === null}>
            Submit
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default CreateMatchSidebar