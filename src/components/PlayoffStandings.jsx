import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import CircularProgress from '@mui/material/CircularProgress'
import chelService from '../services/api'
import { setPlayoffRace } from '../reducers/playoffRaceReducer'
import data from '../helpers/data.js'
import functions from '../helpers/tableGenerator.js'
import BootstrapTable from './BootstrapTable'
import { setConferencePage } from '../reducers/paginationReducer'
import { makeStyles } from '@mui/styles'

const PlayoffStandings = ({ handleTableClick, lightTheme, isMobile }) => {
  const [ loaded, setLoaded ] = useState({ invalidMatches: false, forfeits: false })
  const [ invalidMatchDetails, setInvalidMatchDetails ] = useState([])

  const teamData = useSelector(state => state.teamRankings)
  const forfeits = useSelector(state => state.forfeits)

  const invalidMatchIdsToQuery = useSelector(state => state.invalidMatches).filter(invalidMatch => invalidMatch.newRecord).map(match => match.matchId)
  const dispatch = useDispatch()

  useEffect(() => {
    const sortPlayoffTeams = (teams) => teams.sort((a,b) => {
      const pts = (((parseInt(b.wins * 2)) + parseInt(b.overtimeLosses)) - ((parseInt(a.wins * 2)) + parseInt(a.overtimeLosses)))
      const regulationWins = parseInt(b.regulationWins) - parseInt(a.regulationWins)
      const wins = parseInt(b.wins) - parseInt(a.wins)
      
      return pts || regulationWins || wins
    })

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

    const removeInvalidDataFromTeamData = (teamData) => {
      let newTeamData = [ ...teamData ]
      
      invalidMatchDetails.forEach(invalidMatch => {
        invalidMatch.clubs.forEach(club => {
          const teamRow = newTeamData.find(team => team.teamId === club.clubId)
          if ( ['1','5','16385'].includes(club.data.result) ) { //WINS
            const newTeamRow = { ...teamRow, gamesPlayed: parseInt(teamRow.gamesPlayed) - 1, wins: parseInt(teamRow.wins) - 1 }
            newTeamData = newTeamData.map(team => team.teamId === club.clubId ? newTeamRow : team)
          } else if ( ['2','10'].includes(club.data.result) ) { //LOSSES
            const newTeamRow = { ...teamRow, gamesPlayed: parseInt(teamRow.gamesPlayed) - 1, losses: parseInt(teamRow.losses) - 1 }
            newTeamData = newTeamData.map(team => team.teamId === club.clubId ? newTeamRow : team)
          } else if ( club.data.result === 6 ) {
            const newTeamRow = { ...teamRow, gamesPlayed: parseInt(teamRow.gamesPlayed) - 1, losses: parseInt(teamRow.overtimeLosses) - 1 }
            newTeamData = newTeamData.map(team => team.teamId === club.clubId ? newTeamRow : team)
          }   
        })
      })

      return newTeamData
    }
    
    const teamDataWithForfeits = addForfeitDataToTeamData()
    const teamDataWithoutInvalids = removeInvalidDataFromTeamData(teamDataWithForfeits)

    const sortedNewTeamData = sortTeamData(teamDataWithoutInvalids)

    const rankedMetroTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'Metropolitan'))
    const rankedAtlanticTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'Atlantic'))
    const rankedPacificTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'Pacific'))
    const rankedCentralTeams = rankTheTeams(sortedNewTeamData.filter(team => team.division === 'Central'))
    
    const qualifiedMetroTeams = rankedMetroTeams.splice(0,2).map(team => ({ ...team, conferenceLeader: true, wildcard: false }))
    const qualifiedAtlanticTeams = rankedAtlanticTeams.splice(0,2).map(team => ({ ...team, conferenceLeader: true, wildcard: false }))
    const qualifiedPacificTeams = rankedPacificTeams.splice(0,2).map(team => ({ ...team, conferenceLeader: true, wildcard: false }))
    const qualifiedCentralTeams = rankedCentralTeams.splice(0,2).map(team => ({ ...team, conferenceLeader: true, wildcard: false }))

    const divisionQualifiedTeams = sortPlayoffTeams([ ...qualifiedMetroTeams, ...qualifiedAtlanticTeams, ...qualifiedPacificTeams, ...qualifiedCentralTeams ])
    const remainingTeams = sortPlayoffTeams([ ...rankedMetroTeams, ...rankedAtlanticTeams, ...rankedPacificTeams, ...rankedCentralTeams ])
    const wildcardEastQualifiedTeams = sortPlayoffTeams(remainingTeams).filter(team => team.conference === 'East').splice(0,4).map(team => ({ ...team, conferenceLeader: false, wildcard: true }))
    const wildcardWestQualifiedTeams = sortPlayoffTeams(remainingTeams).filter(team => team.conference === 'West').splice(0,4).map(team => ({ ...team, conferenceLeader: false, wildcard: true }))
    
    const qualifiedTeams = [ ...divisionQualifiedTeams, ...wildcardEastQualifiedTeams, ...wildcardWestQualifiedTeams ]
    const unqualifiedTeams = remainingTeams.filter(team => !qualifiedTeams.map(qt => qt.teamId).includes(team.teamId)).map(team => ({ ...team, conferenceLeader: false, wildcard: false }))

    dispatch(setPlayoffRace([...qualifiedTeams, ...unqualifiedTeams]))
    setLoaded(prevState => ({ ...prevState, forfeits: true }))
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, forfeits, invalidMatchDetails])

  useEffect(() => {
    chelService
      .getDataFromArray('/invalidMatchesDetail', invalidMatchIdsToQuery)
      .then(matches => {
        setInvalidMatchDetails(matches)
        setLoaded(prevState => ({ ...prevState, invalidMatches: true }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return Object.values(loaded).every(item => item === true) ? <LoadedTable handleTableClick={handleTableClick} lightTheme={lightTheme} isMobile={isMobile} /> : <Spinner />
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

const LoadedTable = ({ handleTableClick, lightTheme, isMobile }) => {
  const playoffRace = useSelector(state => state.playoffRace)
  const divisionTable = data.divisions
  const conferencePage = useSelector(state => state.pagination.conferencePage)
  const divisionName = divisionTable.find(conference => conference.conferenceId === conferencePage).conferenceDisplayName
  const playoffStandingData = functions.generateLeagueStandingData(playoffRace.filter(team => team.conference === divisionName), lightTheme, true)

  const dispatch = useDispatch()

  const paginationSize = isMobile ? 'small' : 'medium'
  const themeClass = lightTheme ? '' : 'dark-theme-text'

  const handleConferencePaginationChange = (e,n) => {
    dispatch(setConferencePage(n))
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

  return (
    <>
    {conferencePagination}
      <div className='table-wrapper'>
        <BootstrapTable
          columns={functions.generateColumns(data.leagueStandingsColumns, themeClass)}
          data={playoffStandingData}
          hover={true}
          size={isMobile ? 'sm' : ''}
          striped={false}
          variant={lightTheme ? 'light' : 'dark'}
          themeClass={themeClass}
          responsive={true}
          handleTableClick={handleTableClick}
          type='league'
          className='table-fixed-header'
        />
      </div>
    </>
  )
}

export default PlayoffStandings