import React, { useContext } from 'react'
import { Row, Col, Collapse } from 'react-bootstrap'
import { AiOutlineCaretRight, AiOutlineCaretDown } from 'react-icons/ai'
import MobileContext from './MobileContext'
import { useDispatch, useSelector } from 'react-redux'
import { setLeagueOpen } from '../reducers/viewToggleReducer.js'
import data from '../helpers/data.js'
import ConferenceStandings from './ConferenceStandings'

const LeagueStandings = ({ lightTheme, handleTableClick }) => {
  const dispatch = useDispatch()
  
  const leagueOpen = useSelector(state => state.viewToggle.leagueOpen)
  const isMobile = useContext(MobileContext)
  
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const caret = leagueOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />

  const clickableTitle = isMobile ? (
    <Col className='' onClick={() => dispatch(setLeagueOpen(!leagueOpen))}>
      <h5 className={themeClass + ' tiny-caps section-title'}>League Standings{caret}</h5>
    </Col>
  ) : (
    <Col className=''>
      <h5 className={themeClass + ' tiny-caps section-title'}>League Standings</h5>
    </Col>
  )

  const divisions = [...new Set(data.teams.map(team => team.division).filter(division => division !== ''))]

  return (
    <>
      <Row className='table-title d-flex align-items-center expand-paranthetical'>
        {clickableTitle}
      </Row>
      <Collapse in={leagueOpen}>
        <div>
          {divisions.map((division, i) => 
            <ConferenceStandings
              key={i}
              division={division}
              handleTableClick={handleTableClick}
              lightTheme={lightTheme}
              isMobile={isMobile}
            />
          )}
        </div>
      </Collapse>
    </>
  )
}

export default LeagueStandings