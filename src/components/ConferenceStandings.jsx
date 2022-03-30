import React from 'react'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import BootstrapTable from './BootstrapTable'
import data from '../helpers/data.js'
import { setLeagueStandingsPage } from '../reducers/paginationReducer'
import functions from '../helpers/tableGenerator.js'
import { makeStyles } from '@mui/styles'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

const ConferenceStandings = ({ division, handleTableClick, lightTheme, isMobile }) => {
  const pages  = useSelector(state => state.pagination.leagueStandingsPage)
  const teamData = useSelector(state => state.teamRankings)
  const dispatch = useDispatch()

  const leagueStandingsPage = division === 'West' ? pages.west : pages.east

  const leagueStandingData = functions.generateLeagueStandingData(teamData.filter(team => team.division === division), lightTheme)

  const itemsPerPage = 4
  const numberOfPages = Math.ceil(parseFloat(leagueStandingData.length/itemsPerPage))
  const paginationSize = isMobile ? 'small' : 'medium'
  const themeClass = lightTheme ? '' : 'dark-theme-text'

  const handlePaginationChange = (_e,n) => {
    dispatch(setLeagueStandingsPage({ division, page: n }))
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

  const classes = useStyles()

  const pagination =
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
    </Col>

  return (
    <>
      <Row>
        <Col className='mt-1'>
          <h5 className={themeClass + ' tiny-caps section-title'}>{division}ern Conference</h5>
        </Col>
        {pagination}
      </Row>
      <BootstrapTable
        title={`${division} Division Standings`}
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
    </>
  )
}

export default ConferenceStandings