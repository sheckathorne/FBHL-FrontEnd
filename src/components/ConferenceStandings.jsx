import { useEffect, useState } from 'react'
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
import { Row, Col, Container } from 'react-bootstrap'
import { setTeamRankingsAndForfeits } from '../reducers/teamRankingsAndForfeitsReducer'
import CircularProgress from '@mui/material/CircularProgress'

const ConferenceStandings = ({ division, handleTableClick, lightTheme, isMobile }) => {
  const [ loaded, setLoaded ] = useState(false)
  
  const teamData = useSelector(state => state.teamRankings)
  const forfeits = useSelector(state => state.forfeits)
  const dispatch = useDispatch()

  useEffect(() => {
    const countForfeits = (forfeitType) => {
      const forfeitProperty = forfeitType === 'wins' ? 'winningClub' : 'losingClub'
      return Object.entries(forfeits.map(f => f[forfeitProperty]).reduce(function (acc, curr) {
        acc[curr] ? ++acc[curr] : acc[curr] = 1
        return acc
      }, {})).map(x => ({ clubId: x[0], [forfeitType]: x[1] }))
    }

    const addForfeitDataToTeamData = () => {      
      const winAddCount = countForfeits('wins')
      const lossAddCount = countForfeits('losses')

      const newTeamData = teamData.map(team => {
        const winData = winAddCount.find(winningClub => winningClub.clubId === team.teamId)
        return ( winData ? 
        { ...team, 
          gamesPlayed: (parseInt(team.gamesPlayed) + winData.wins).toString(),
          wins: (parseInt(team.wins) + winData.wins),
        } : team)}).map(team => {
        const lossData = lossAddCount.find(losingClub => losingClub.clubId === team.teamId)
        return ( lossData ? 
        { ...team, 
          gamesPlayed: (parseInt(team.gamesPlayed) + lossData.losses).toString(),
          losses: (parseInt(team.losses) + lossData.losses),
        } : team)})

      return newTeamData
    }

    const teamRankFunction = ( i, team, teams ) => {
      let n = 0
    
      if ( i === 0 ) {
        n = 1
      } else if ( i > 0 && ((team.wins * 2) + team.overtimeLosses) === ((teams[i-1].wins * 2) + teams[i-1].overtimeLosses) ) {
        n = teams.findIndex(p => (((p.wins * 2) + p.overtimeLosses) === ((team.wins * 2) + team.overtimeLosses)) ) + 1
      } else {
        n = i + 1
      }
    
      return n
    }

    const sortTeamData = (teamData) => teamData.sort((a,b) => {
      let n = (((b.wins * 2) + b.overtimeLosses) - ((a.wins * 2) + a.overtimeLosses))
      if ( n !== 0) {
        return n
      } else {
        return ((((parseFloat((b.wins * 2) + b.overtimeLosses)) / parseFloat(b.gamesPlayed))) - ((parseFloat((a.wins * 2) + a.overtimeLosses)) / parseFloat(a.gamesPlayed)))
      }
    })
    
    const rankTheTeams = (teams) => teams.map((team,i) => ({ ...team, rank: teamRankFunction(i, team, teams) }))
    
    const newTeamData = addForfeitDataToTeamData()
    const sortedNewTeamData = sortTeamData(newTeamData)
    
    const rankedWestTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'West'))
    const rankedEastTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'East'))


    dispatch(setTeamRankingsAndForfeits([...rankedWestTeams, ...rankedEastTeams]))
    setLoaded(true)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, forfeits])

  return loaded ? <LoadedTable division={division} handleTableClick={handleTableClick} lightTheme={lightTheme} isMobile={isMobile} /> : <Spinner />
}

const LoadedTable = ({ division, handleTableClick, lightTheme, isMobile }) => {
  const pages  = useSelector(state => state.pagination.leagueStandingsPage)
  const teamRankingsAndForfeits = useSelector(state => state.teamRankingsAndForfeits)

  const dispatch = useDispatch()

  const leagueStandingsPage = division === 'West' ? pages.west : pages.east
  const leagueStandingData = functions.generateLeagueStandingData(teamRankingsAndForfeits.filter(team => team.division === division), lightTheme)

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