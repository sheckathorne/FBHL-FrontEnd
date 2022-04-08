import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import BootstrapTable from './BootstrapTable'
import data from '../helpers/data.js'
import { setConferencePage, setDivisionPage } from '../reducers/paginationReducer'
import functions from '../helpers/tableGenerator.js'
import { makeStyles } from '@mui/styles'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import { setTeamRankingsAndForfeits } from '../reducers/teamRankingsAndForfeitsReducer'
import CircularProgress from '@mui/material/CircularProgress'

const ConferenceStandings = ({ handleTableClick, lightTheme, isMobile }) => { 
  const [ loaded, setLoaded ] = useState(false)

  const teamData = useSelector(state => state.teamRankings)
  const forfeits = useSelector(state => state.forfeits)
  const dispatch = useDispatch()

  useEffect(() => {
    const countForfeits = (forfeitType) => {
      const forfeitsToSum = forfeitType === 'overtimeLossClub' ?
        forfeits.filter(forfeit => forfeit.overtimeLoss) :
          forfeitType === 'winningClub' ? forfeits :
            forfeits.filter(forfeit => !forfeit.overtimeLoss)

      const forfeitTypeProp = forfeitType === 'overtimeLossClub' ? 'losingClub' : forfeitType


      return Object.entries(forfeitsToSum.map(f => f[forfeitTypeProp]).reduce(function (acc, curr) {
        acc[curr] ? ++acc[curr] : acc[curr] = 1
        return acc
      }, {})).map(x => ({ clubId: x[0], [forfeitTypeProp]: x[1] }))
    }

    const addForfeitDataToTeamData = () => {      
      const winAddCount = countForfeits('winningClub')
      const lossAddCount = countForfeits('losingClub')
      const overtimeLossAddCount = countForfeits('overtimeLossClub')

      const newTeamData = teamData.map(team => {
        const winData = winAddCount.find(winningClub => winningClub.clubId === team.teamId)
        return ( winData ? 
        { ...team, 
          gamesPlayed: (parseInt(team.gamesPlayed) + winData.winningClub).toString(),
          wins: (parseInt(team.wins) + winData.winningClub),
        } : team)}).map(team => {
        const lossData = lossAddCount.find(losingClub => losingClub.clubId === team.teamId)
        return ( lossData ? 
        { ...team, 
          gamesPlayed: (parseInt(team.gamesPlayed) + lossData.losingClub).toString(),
          losses: (parseInt(team.losses) + lossData.losingClub),
        } : team)}).map(team => {
        const overtimeLossData = overtimeLossAddCount.find(overtimeLossClub => overtimeLossClub.clubId === team.teamId)
        return ( overtimeLossData ? 
        { ...team, 
          gamesPlayed: (parseInt(team.gamesPlayed) + overtimeLossData.losingClub).toString(),
          overtimeLosses: (parseInt(team.overtimeLosses) + overtimeLossData.losingClub),
        } : team)})

      return newTeamData
    }

    const teamRankFunction = ( i, team, teams ) => {
      let n = 0
    
      if ( i === 0 ) {
        n = 1
      } else if ( i > 0 && ((parseInt(team.wins) * 2) + parseInt(team.overtimeLosses)) === ((parseInt(teams[i-1].wins) * 2) + parseInt(teams[i-1].overtimeLosses)) ) {
        n = teams.findIndex(p => (((parseInt(p.wins) * 2) + parseInt(p.overtimeLosses)) === ((parseInt(team.wins) * 2) + parseInt(team.overtimeLosses))) ) + 1
      } else {
        n = i + 1
      }
    
      return n
    }

    const sortTeamData = (teamData) => teamData.sort((a,b) => {
      let n = (((parseInt(b.wins * 2)) + parseInt(b.overtimeLosses)) - ((parseInt(a.wins * 2)) + parseInt(a.overtimeLosses)))
      if ( n !== 0) {
        return n
      } else {
        return ((((parseFloat((parseInt(b.wins) * 2) + parseInt(b.overtimeLosses))) / parseFloat(b.gamesPlayed))) - ((parseFloat((parseInt(a.wins) * 2) + parseInt(a.overtimeLosses))) / parseFloat(a.gamesPlayed)))
      }
    })
    
    const rankTheTeams = (teams) => teams.map((team,i) => ({ ...team, rank: teamRankFunction(i, team, teams) }))
    
    const newTeamData = addForfeitDataToTeamData()
    const sortedNewTeamData = sortTeamData(newTeamData)

    const rankedMetroTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'Metropolitan'))
    const rankedAtlanticTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'Atlantic'))
    const rankedPacificTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'Pacific'))
    const rankedCentralTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'Central'))

    dispatch(setTeamRankingsAndForfeits([...rankedMetroTeams, ...rankedAtlanticTeams, ...rankedPacificTeams, ...rankedCentralTeams]))
    setLoaded(true)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, forfeits])

  return loaded ? <LoadedTable conference={'West'} handleTableClick={handleTableClick} lightTheme={lightTheme} isMobile={isMobile} /> : <Spinner />
}

const LoadedTable = ({ handleTableClick, lightTheme, isMobile }) => {
  const teamRankingsAndForfeits = useSelector(state => state.teamRankingsAndForfeits)
  const divisionTable = data.divisions
  const conferencePage = useSelector(state => state.pagination.conferencePage)
  const divisionPage = useSelector(state => state.pagination.divisionPage)

  const dispatch = useDispatch()

  const paginationSize = isMobile ? 'small' : 'medium'
  const themeClass = lightTheme ? '' : 'dark-theme-text'

  const handleConferencePaginationChange = (e,n) => {
    dispatch(setConferencePage(n))
    dispatch(setDivisionPage(1))
  }

  const handleDivisionPaginationChange = (e,n) => {
    dispatch(setDivisionPage(n))
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

  const selectedConference = divisionTable.find(conference => conference.conferenceId === conferencePage)
  const selectedDivision = selectedConference.divisions.find(division => division.divisionId === divisionPage)
  const leagueStandingData = functions.generateLeagueStandingData(teamRankingsAndForfeits.filter(team => team.conference === selectedConference.conferenceName && team.division === selectedDivision.divisionName), lightTheme)

  const conferencePagination = 
    <Col className='mt-1'>
      <Stack spacing={2}>
        <Pagination
          classes={{ ul: classes.ul }}
          count={divisionTable.length}
          color='primary'
          size={paginationSize}
          variant='outlined'
          onChange={handleConferencePaginationChange}
          page={conferencePage}
          hidePrevButton
          hideNextButton
          renderItem={(item) => {
            if ( item.page === 1 ) {
              item = { ...item, page: divisionTable.find(conference => conference.conferenceId === 1).conferenceDisplayName }
            } else if ( item.page === 2 ) {
              item = { ...item, page: divisionTable.find(conference => conference.conferenceId === 2).conferenceDisplayName }
            }

            return (
              <PaginationItem
                {...item}
              />
            )}}
        />
      </Stack>
    </Col>
  
  const divisionPagination =
    <Col className='d-flex justify-content-end'>
      <Stack spacing={2}>
        <Pagination
          classes={{ ul: classes.ul }}
          count={divisionTable.length}
          color='primary'
          size={paginationSize}
          variant='outlined'
          onChange={handleDivisionPaginationChange}
          page={divisionPage}
          hidePrevButton
          hideNextButton
          renderItem={(item) => {
            if ( item.page === 1 ) {
              item = { ...item, page: selectedConference.divisions.find(division => division.divisionId === 1).divisionDisplayName }
            } else if ( item.page === 2 ) {
              item = { ...item, page: selectedConference.divisions.find(division => division.divisionId === 2).divisionDisplayName }
            }

            return (
              <PaginationItem
                {...item}
              />
            )}}
        />
      </Stack>
    </Col>

  return (
    <>
      <Row>
        {conferencePagination}
        {divisionPagination}
      </Row>
      <BootstrapTable
        columns={functions.generateColumns(data.leagueStandingsColumns, themeClass)}
        data={leagueStandingData}
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

const Spinner = () => {
  return (
    <Container>
      <Row className='mt-4'>
        <Col className='d-flex justify-content-center'>
          <CircularProgress />
        </Col>
      </Row>
    </Container>
  )
}

export default ConferenceStandings