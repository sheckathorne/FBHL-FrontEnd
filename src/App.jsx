import React, { useState, useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { initializeSchedule } from './reducers/scheduleReducer'
import { initializeMatches } from './reducers/matchesReducer'
import { initializeTeamRankings } from './reducers/teamRankingsReducer'
import { intializePlayers, sortSkaters } from './reducers/playersReducer'
import { setResultsOpen, setLeagueOpen, setPlayerOpen } from './reducers/viewToggleReducer'
import { setUser } from './reducers/userReducer'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import AppDashboard from './components/AppDashboard'
import ThemeContext from './components/ThemeContext'
import MobileContext from './components/MobileContext'
import LeagueContext from './components/LeagueContext'
import AppNavbar from './components/AppNavbar'
import LoginSidebar from './components/LoginSidebar'
import CreateMatchSidebar from './components/CreateMatchSidebar'
import chelService from './services/api'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import CircularProgress from '@mui/material/CircularProgress'
import jwt_decode from 'jwt-decode'

const App = () => {
  const leagueName = 'FBHL'
  
  const appLoadChecklist = { 
    matches: false,
    players: false,
    schedule: false,
    teamRankings: false 
  }

  const sortField = useSelector(state => state.sortField)
  const notification = useSelector(state => state.notification)

  /* app theme */
  const [ theme, setTheme ] = useState({ title: 'Light Theme', value: 'light' })

  /* Administration */
  const [ loadingProgress, setLoadingProgress ] = useState(appLoadChecklist)
  
  /* Detect mobile viewport */
  const [ width, setWidth ] = useState(window.innerWidth)

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
    dispatch(initializeSchedule())
    .then(() => setLoadingProgress(loadingProgress => ({ ...loadingProgress, schedule: true })))
  },[dispatch])

  // retrieve player data from database
  useEffect(() => {
    dispatch(intializePlayers()).then(() => {
      dispatch(sortSkaters({ field: 'skpoints', descending: true, alpha: false }))
      setLoadingProgress(loadingProgress => ({ ...loadingProgress, players: true }))
    })
  },[dispatch])

  useEffect(() => {
    dispatch(sortSkaters(sortField))
  },[dispatch, sortField])

  useEffect(() => {
    const loggedFBHLuser = window.localStorage.getItem('loggedFBHLuser')
    
    if ( loggedFBHLuser ) {
      const user = JSON.parse(loggedFBHLuser)
      dispatch(setUser(user))
      chelService.setToken(user.token)

    }
  },[dispatch])

  useEffect(() => {
    const loggedFBHLuser = window.localStorage.getItem('loggedFBHLuser')

    if ( loggedFBHLuser ) {
      const currentDate = new Date()
      const token = JSON.parse(loggedFBHLuser).token
      const decodedToken = jwt_decode(token)
      
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        window.localStorage.removeItem('loggedFBHLuser')
        dispatch(setUser(null))
      }
    }
  },[dispatch])

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
      width={width}
    /> :
    <Container>
    <Row className='mt-4'>
      <Col className='d-flex justify-content-center'>
        <CircularProgress />
      </Col>
    </Row>
  </Container>

  const errorBanner = notification.text !== null && notification.scope === 'app' ?
    <Container><Row className='mt-2'><Container><Alert variant={notification.type}>{notification.text}</Alert></Container></Row></Container> : null

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
              />
              <LoginSidebar />
              <CreateMatchSidebar />
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