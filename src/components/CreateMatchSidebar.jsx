import React, { useState } from 'react'
import { Offcanvas, Form, Button, Col } from 'react-bootstrap'
import Calendar from 'react-calendar'
import MatchCreateTeamDropdown from './MatchCreateTeamDropdown'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { setCreateMatchIsOpen } from '../reducers/viewToggleReducer'

const CreateMatchSidebar = ({ handleCreateMatchSubmit }) => {
  const [ value, setValue ] = useState(new Date())
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

  const buttonDiabled = awayTeamId === '' || homeTeamId === ''

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
          <Button type='submit' variant='primary' disabled={buttonDiabled}>
            Submit
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default CreateMatchSidebar