import React, { useContext } from 'react'
import { Row, Col, Collapse } from 'react-bootstrap'
import data from '../helpers/data.js'
import functions from '../helpers/tableGenerator.js'
import BootstrapTable from './BootstrapTable'
import { makeStyles } from '@mui/styles'
import { AiOutlineCaretRight, AiOutlineCaretDown } from 'react-icons/ai'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MobileContext from './MobileContext'
import { useDispatch, useSelector } from 'react-redux'
import { setLeagueStandingsPage } from '../reducers/paginationReducer'

const LeagueStandings = ({ teamData, lightTheme, handleTableClick, leagueOpen, handleCollapseClick }) => {
  const dispatch = useDispatch()
  const leagueStandingsPage = useSelector(state => state.pagination.leagueStandingsPage)

  const handlePaginationChange = (e,n) => {
    dispatch(setLeagueStandingsPage(n))
  }
  
  const useStyles = makeStyles(() => {
    if ( !lightTheme ) {
      return (
        {
          ul: {
            '& .MuiPaginationItem-root': {
              color: '#fff'
            }
          }
        }
      )
    }
  })

  const itemsPerPage = 10
  const leagueStandingData = functions.generateLeagueStandingData(teamData, lightTheme)
  const numberOfPages = Math.ceil(parseFloat(leagueStandingData.length/10))
  const isMobile = useContext(MobileContext)
  const classes = useStyles()
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const paginationSize = isMobile ? 'small' : 'medium'

  const caret = leagueOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />

  const clickableTitle = isMobile ? (
    <Col className='mt-1' onClick={handleCollapseClick('league')}>
      <h5 className={themeClass + ' tiny-caps section-title'}>League Standings{caret}</h5>
    </Col>
  ) : (
    <Col className='mt-1'>
      <h5 className={themeClass + ' tiny-caps section-title'}>League Standings</h5>
    </Col>
  )

  const pagination = leagueOpen ? (
    <Col className='d-flex justify-content-end'>
      <Stack spacing={2}>
        <Pagination
          classes={{ ul: classes.ul }}
          count={numberOfPages}
          color='primary'
          size={paginationSize}
          variant='outlined'
          onChange={handlePaginationChange}
          page={leagueStandingsPage}
          renderItem={(item) => (
            <PaginationItem
              components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>
    </Col> ) : null

  return (
    <>
      <Row className='table-title d-flex align-items-center expand-paranthetical'>
        {clickableTitle}
        {pagination}
      </Row>
      <Collapse in={leagueOpen}>
        <div>
          <BootstrapTable
            title={'League Standings'}
            columns={functions.generateColumns(data.leagueStandingsColumns, themeClass)}
            data={leagueStandingData.slice((leagueStandingsPage - 1) * itemsPerPage, ((leagueStandingsPage - 1) * itemsPerPage) + itemsPerPage)}
            hover={true}
            size={isMobile ? 'sm' : ''}
            striped={false}
            variant={lightTheme ? 'light' : 'dark'}
            themeClass={themeClass}
            responsive={true}
            handleTableClick={handleTableClick}
            type='league'
          />
        </div>
      </Collapse>
    </>
  )
}

export default LeagueStandings