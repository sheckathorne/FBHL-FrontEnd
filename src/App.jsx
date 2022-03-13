import React, { useState, useEffect } from 'react'
import AppDashboard from './components/AppDashboard'
import ThemeContext from './components/ThemeContext'
import MobileContext from './components/MobileContext'
import LeagueContext from './components/LeagueContext'
import AppNavbar from './components/AppNavbar'
import chelService from './services/api'
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
import { useDispatch } from 'react-redux'
import { initializeMatches } from './reducers/matchesReducer'
import { initializeTeamRankings } from './reducers/teamRankingsReducer'
import { setResultsOpen, setLeagueOpen, setPlayerOpen, setLoginIsOpen, setCreateMatchIsOpen } from './reducers/viewToggleReducer'

const App = () => {
  const leagueName = 'FBHL'
  
  const itemsToLoad = { 
    matches: false,
    players: false,
    schedule: false,
    teamRankings: false 
  }

  /* app theme */
  const [ theme, setTheme ] = useState({ title: 'Light Theme', value: 'light' })

  /* Login */
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ user, setUser ] = useState(null)

  /* Administration */
  const [ loadingProgress, setLoadingProgress ] = useState(itemsToLoad)

  /* Sort players */
  const [ sortField, setSortField ] = useState({ field: 'skpoints', descending: true, alpha: false })
  const [ skaterOrGoalie, setSkaterOrGoalie ] = useState({ field: 'skaters' })

  /* Leaguewide match data */
  const [ schedule, setSchedule ] = useState([])
  const [ skaters, setSkaters ] = useState([])
  const [ goaltenders, setGoaltenders ] = useState([])
  
  /* Detect mobile viewport */
  const [ width, setWidth ] = useState(window.innerWidth)

  /* Fail/Success banner */
  const [ message, setMessage ] = useState({ type: null, text: null })

  const dispatch = useDispatch()

  // retrieve match history from database
  useEffect(() => {
    dispatch(initializeMatches())
    .then(() => setLoadingProgress(loadingProgress => ({ ...loadingProgress, matches: true })))
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeTeamRankings())
    .then(() => setLoadingProgress(loadingProgress => ({ ...loadingProgress, teamRankings: true })))
  },[dispatch])

  useEffect(() => {
    chelService
      .getData('/schedule')
      .then(initialData => {
        setSchedule(initialData)        
      })
      .then(() => setLoadingProgress(loadingProgress => ({ ...loadingProgress, schedule: true })))
  }, [])

  // retrieve player data from database
  useEffect(() => {
    chelService
      .getData('/playerData')
      .then(initialData => {
        setSkaters([...initialData].filter(player => player.skater).sort((a, b) => b[`${sortField.field}`] - a[`${sortField.field}`]))
        setGoaltenders([...initialData].filter(player => !player.skater))
      })
      .then(() => setLoadingProgress(loadingProgress => ({ ...loadingProgress, players: true })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

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
      dispatch(setLoginIsOpen(false))
      setMessage({ type: 'success', text: `Logged in as ${username}` })
      setUsername('')
      setPassword('')
      setTimeout(() => {
        setMessage({ type: null, text: null })
      }, 3000)
    } catch (exception) {
      dispatch(setLoginIsOpen(false))
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

      dispatch(setCreateMatchIsOpen(false))
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

  const handleSidebarAction = (action) => () => {
    if ( action === 'open' ) {
      dispatch(setLoginIsOpen(true))
    } else if ( action === 'close' ) {
      dispatch(setLoginIsOpen(false))
    }
  }

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

  //determine device/window size
  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth)
      if ( window.innerWidth >= 768 ) {
        dispatch(setResultsOpen(true))
        dispatch(setLeagueOpen(true))
        dispatch(setPlayerOpen(true))
      }
    }
    
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [dispatch])

  const handleSwitch = (theme) => {
    if ( theme === 'light' ) {
      setTheme({ title: 'Dark Theme', value: 'dark' })
      document.body.style= 'background: #404040'
    } else {
      setTheme({ title: 'Light Theme', value: 'light' })
      document.body.style = 'background: white'
    }
  }

  const isMobile = width < 768

  const appIsLoaded = (loadingProgress) => Object.values(loadingProgress).every(item => item === true)

  const appMain = appIsLoaded(loadingProgress) ?
    <AppDashboard
      handleSortClick={handleSortClick}
      handleSkaterOrGoalieClick={handleSkaterOrGoalieClick}
      sortField={sortField}
      players={{ skaters: skaters, goaltenders: goaltenders }}
      skaterOrGoalie={skaterOrGoalie}
      handleTableClick={handleTableClick}
      width={width}
      user={user}
      schedule={schedule}
      setSchedule={setSchedule}
    /> :
    <Container>
    <Row className='mt-4'>
      <Col className='d-flex justify-content-center'>
        <CircularProgress />
      </Col>
    </Row>
  </Container>

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
                handleCreateMatchSubmit={handleCreateMatchSubmit}
              />
              <LoginSidebar
                username={username}
                password={password}
                handleSidebarAction={handleSidebarAction}
                handleUsernameChange={handleUsernameChange}
                handlePasswordChange={handlePasswordChange}
                handleLogin={handleLogin}
              />
              <CreateMatchSidebar
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