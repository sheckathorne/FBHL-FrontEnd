import React, { useState, useEffect } from 'react'
import AppDashboard from './components/AppDashboard'
import ThemeContext from './components/ThemeContext'
import MobileContext from './components/MobileContext'
import LeagueContext from './components/LeagueContext'
import AppNavbar from './components/AppNavbar'
import chelService from './services/api'
import teamConfig from './helpers/generateTeamSeasonData'
import data from './helpers/data.js'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import CircularProgress from '@mui/material/CircularProgress'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import LoginSidebar from './components/LoginSidebar'
import loginService from './services/login'
import CreateMatchSidebar from './components/CreateMatchSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { initializeMatches } from './reducers/matchesReducer'

const App = () => {
  const leagueName = 'FBHL'

  /* app theme */
  const [ theme, setTheme ] = useState({ title: 'Light Theme', value: 'light' })

  /* Login */
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ user, setUser ] = useState(null)
  const [ loginIsOpen, setLoginIsOpen ] = useState(false)

  /* Administration */
  const [ createMatchIsOpen, setCreateMatchIsOpen ] = useState(false)

  /* Sort players */
  const [ sortField, setSortField ] = useState({ field: 'skpoints', descending: true, alpha: false })
  const [ skaterOrGoalie, setSkaterOrGoalie ] = useState({ field: 'skaters' })

  /* Leaguewide match data */
  const [ schedule, setSchedule ] = useState([])
  const [ skaters, setSkaters ] = useState([])
  const [ goaltenders, setGoaltenders ] = useState([])
  const [ teamData, setTeamData ] = useState([])
  const [ loadingProgress, setLoadingProgress ] = useState(0)

  /* Pagination */
  const [ matchActivePage, setMatchActivePage ] = useState(1)
  const [ playersActivePage, setPlayersActivePage ] = useState(1)
  const [ teamsActivePage, setTeamsActivePage ] = useState(1)
  const [ leagueStandingsPage, setLeagueStandingsPage ] = useState(1)
  const [ playerStandingsPage, setPlayerStandingsPage ] = useState(1)

  /* Detect mobile viewport */
  const [ width, setWidth ] = useState(window.innerWidth)

  /* Collapsible modules on home page */
  const [ resultsOpen, setResultsOpen ] = useState(true)
  const [ leagueOpen, setLeagueOpen ] = useState(true)
  const [ playerOpen, setPlayerOpen ] = useState(true)

  const [ message, setMessage ] = useState({ type: null, text: null })

  const dispatch = useDispatch()
  const matches = useSelector(state => state.matches)

  // retrieve match history from database
  useEffect(() => {
    dispatch(initializeMatches())
    setLoadingProgress(v => v + 1)
  }, [dispatch])

  useEffect(() => {
    chelService
      .getData('/schedule')
      .then(initialData => {
        setSchedule(initialData)
      })
  }, [])

  // retrieve player data from database
  useEffect(() => {
    chelService
      .getData('/playerData')
      .then(initialData => {
        setLoadingProgress(v => v + 1)
        setSkaters([...initialData].filter(player => player.skater).sort((a, b) => b[`${sortField.field}`] - a[`${sortField.field}`]))
        setGoaltenders([...initialData].filter(player => !player.skater))
      })
      .then (
        () => setLoadingProgress(v => v + 1)
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    const rankTheTeams = (teams) => teams.map((team,i) => ({ rank: teamRankFunction(i, team, teams), ...team }))
    setTeamData(rankTheTeams(sortTeamData(teamConfig.generateAllTeamData(data.teams.filter(team => team.clubId !== '' && team.active), matches))))
  }, [matches])

  useEffect(() => {
    const sortPlayerState = (sortField) => {
      if ( sortField.field ) {
        if (sortField.alpha) {
          if ( sortField.descending ) {
            setSkaters(p => [...p].sort((b, a) => a[`${sortField.field}`].localeCompare(b[`${sortField.field}`])))
          } else {
            setSkaters(p => [...p].sort((a, b) => a[`${sortField.field}`].localeCompare(b[`${sortField.field}`])))
          }
        } else {
          if ( sortField.descending ) {
            setSkaters(p => [...p].sort((b, a) => a[`${sortField.field}`] - b[`${sortField.field}`]))
          } else {
            setSkaters(p => [...p].sort((a, b) => a[`${sortField.field}`] - b[`${sortField.field}`]))
          }
        }
      }
    }
    sortPlayerState(sortField)
  },[sortField])

  useEffect(() => {
    const loggedFHBLuser = window.localStorage.getItem('loggedFHBLuser')
    if ( loggedFHBLuser ) {
      const user = JSON.parse(loggedFHBLuser)
      setUser(user)
      chelService.setToken(user.token)
    }
  },[])

  let navigate = useNavigate()

  const handleUsernameChange = (name) => setUsername(name)
  const handlePasswordChange = (password) => setPassword(password)

  const handleLogin = async (e, username, password) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username: username.toLowerCase(), password,
      })

      window.localStorage.setItem(
        'loggedFHBLuser', JSON.stringify(user)
      )
      chelService.setToken(user.token)
      setUser(user)
      setLoginIsOpen(false)
      setMessage({ type: 'success', text: `Logged in as ${username}` })
      setUsername('')
      setPassword('')
      setTimeout(() => {
        setMessage({ type: null, text: null })
      }, 3000)
    } catch (exception) {
      setLoginIsOpen(false)
      setMessage({ type: 'danger', text: 'Login failed - Bad credentials' })
      setTimeout(() => {
        setMessage({ type: null, text: null })
      }, 3000)
    }
  }

  const handleCreateMatchSubmit = async (e, awayTeamId, homeTeamId, matchDate) => {
    e.preventDefault()

    try {
      const newScheduledMatch = await chelService.createSchedueldMatch (
        {
          matchDate: matchDate,
          teams: [ awayTeamId.toString(), homeTeamId.toString() ]
        }
      )

      setSchedule(matches => [...matches].concat(newScheduledMatch))
      const awayTeamAbbreviation = data.teams.find(team => team.clubId.toString() === newScheduledMatch.teams[0]).abbreviation
      const homeTeamAbbreviation = data.teams.find(team => team.clubId.toString() === newScheduledMatch.teams[1]).abbreviation

      setCreateMatchIsOpen(false)
      setMessage({ type: 'success', text: `Game bewteen ${awayTeamAbbreviation} and ${homeTeamAbbreviation} added for ${newScheduledMatch.matchDate}` })
      setTimeout(() => {
        setMessage({ type: null, text: null })
      }, 5000)
    } catch (exception) {
      setMessage({ type: 'danger', text: 'Failed to add game to schedule' })
      setTimeout(() => {
        setMessage({ type: null, text: null })
      },3000)
    }
  }

  const handleLogout = () => {
    setMessage({ type: 'success', text: 'You have successfully logged out' })
    window.localStorage.removeItem('loggedFHBLuser')
    setTimeout(() => {
      setMessage({ type: null, text: null })
    }, 3000)
    setUser(null)
  }

  const handleLeaguePaginationChange = (e,n) => setLeagueStandingsPage(n)
  const handlePlayerPaginationChange = (e,n) => setPlayerStandingsPage(n)

  const handleCollapseClick = (type) => () => {
    if ( type === 'league' ) {
      setLeagueOpen(!leagueOpen)
    } else if ( type === 'players' )  {
      setPlayerOpen(!playerOpen)
    } else if ( type === 'results' ) {
      setResultsOpen(!resultsOpen)
    }
  }

  const handleSidebarAction = (action) => () => {
    if ( action === 'open' ) {
      setLoginIsOpen(true)
    } else if ( action === 'close' ) {
      setLoginIsOpen(false)
    }
  }

  const sortTeamData = (teamData) => teamData.sort((a,b) => {
    let n = (((b.wins * 2) + b.overtimeLosses) - ((a.wins * 2) + a.overtimeLosses))
    if ( n !== 0) {
      return n
    } else {
      return ((((parseFloat((b.wins * 2) + b.overtimeLosses)) / parseFloat(b.gamesPlayed))) - ((parseFloat((a.wins * 2) + a.overtimeLosses)) / parseFloat(a.gamesPlayed)))
    }
  })

  const handleSortClick = (e) => {
    setSortField({ field: e.currentTarget.getAttribute('item-value'), descending: !(e.currentTarget.getAttribute('descending') === 'true'), alpha: (e.currentTarget.getAttribute('alpha') === 'true') })
  }

  const handleTopPlayerClick = (sortField, url) => () => {
    setSortField({ field: sortField.field, descending: true, alpha: false })
    setSkaterOrGoalie({ field: 'skaters' })
    navigate(url)
  }

  const handleLeagueRowClick = (url) => () => {
    navigate(url)
  }

  const handleSkaterOrGoalieClick = (e) => {
    setSkaterOrGoalie({ field: e.currentTarget.getAttribute('item-value') })
  }

  const handleTableClick = {
    players: handleTopPlayerClick,
    league: handleLeagueRowClick
  }

  const handlePaginationClick = (n,type) => ( type === 'match' ) ? setMatchActivePage(n) : ( type === 'teams' ) ? setTeamsActivePage(n) : setPlayersActivePage(n)

  const resetAllPagination = () => {
    setMatchActivePage(1)
    setTeamsActivePage(1)
    setPlayersActivePage(1)
  }

  //determine device/window size
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth)
    if ( window.innerWidth >= 768 ) {
      setResultsOpen(true)
      setLeagueOpen(true)
      setPlayerOpen(true)
    }
  }

  const handleSwitch = (theme) => {
    if ( theme === 'light' ) {
      setTheme({ title: 'Dark Theme', value: 'dark' })
      document.body.style= 'background: #404040'
    } else {
      setTheme({ title: 'Light Theme', value: 'light' })
      document.body.style = 'background: white'
    }
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

  const isMobile = width < 768

  const progress = (loadingProgress) => {
    const target = 4
    const current = (parseFloat(loadingProgress) / parseFloat(target)) * 100
    return { target: target, current: current }
  }

  const appMain = loadingProgress < progress(loadingProgress).target ?
    <Container>
      <Row className='mt-4'>
        <Col className='d-flex justify-content-center'>
          <CircularProgress />
        </Col>
      </Row>
    </Container> :
    <AppDashboard
      teamData={teamData}
      matchActivePage={matchActivePage}
      handlePaginationClick={handlePaginationClick}
      resetAllPagination={resetAllPagination}
      handleSortClick={handleSortClick}
      handleSkaterOrGoalieClick={handleSkaterOrGoalieClick}
      sortField={sortField}
      players={{ skaters: skaters, goaltenders: goaltenders }}
      playersActivePage={playersActivePage}
      teamsActivePage={teamsActivePage}
      skaterOrGoalie={skaterOrGoalie}
      handleTableClick={handleTableClick}
      leagueOpen={leagueOpen}
      playerOpen={playerOpen}
      resultsOpen={resultsOpen}
      leagueStandingsPage={leagueStandingsPage}
      playerStandingsPage={playerStandingsPage}
      handleLeaguePaginationChange={handleLeaguePaginationChange}
      handlePlayerPaginationChange={handlePlayerPaginationChange}
      handleCollapseClick={handleCollapseClick}
      width={width}
      loginIsOpen={loginIsOpen}
      user={user}
      schedule={schedule}
      setSchedule={setSchedule}
    />

  const errorBanner = message.text === null ? null : <Container><Row className='mt-2'><Alert variant={message.type}>{message.text}</Alert></Row></Container>

  return (
    <>
      <ThemeContext.Provider value={theme}>
        <MobileContext.Provider value={isMobile}>
          <LeagueContext.Provider value={leagueName}>
            <HelmetProvider>
              <Helmet>
                <title>{leagueName}</title>
              </Helmet>
              <AppNavbar
                handleSwitch={handleSwitch}
                theme={theme}
                handleSidebarAction={handleSidebarAction}
                user={user}
                handleLogout={handleLogout}
                createMatchIsOpen={createMatchIsOpen}
                setCreateMatchIsOpen={setCreateMatchIsOpen}
                handleCreateMatchSubmit={handleCreateMatchSubmit}
              />
              <LoginSidebar
                loginIsOpen={loginIsOpen}
                username={username}
                password={password}
                handleSidebarAction={handleSidebarAction}
                handleUsernameChange={handleUsernameChange}
                handlePasswordChange={handlePasswordChange}
                handleLogin={handleLogin}
              />
              <CreateMatchSidebar
                createMatchIsOpen={createMatchIsOpen}
                setCreateMatchIsOpen={setCreateMatchIsOpen}
                handleCreateMatchSubmit={handleCreateMatchSubmit}
              />
              {errorBanner}
              {appMain}
            </HelmetProvider>
          </LeagueContext.Provider>
        </MobileContext.Provider>
      </ThemeContext.Provider>
    </>
  )
}

export default App