import { React, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import TeamDropdown from './TeamDropdown'
import data from '../helpers/data.js'
import ThemeContext from './ThemeContext'
import MobileContext from './MobileContext'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import MobileTitle from './MobileTitle'
import LeagueContext from './LeagueContext'
import { useSelector, useDispatch } from 'react-redux'
import { setTeamsActivePage } from '../reducers/paginationReducer'

const TeamsLayout = ({ teamData }) => {
  const teamsActivePage = useSelector(state => state.pagination.teamsActivePage)

  const dispatch = useDispatch()
  const addDefaultSrc = (e) => e.target.src = data.defaultCrest
  const isMobile = useContext(MobileContext)
  const lightTheme = useContext(ThemeContext).value === 'light'
  const leagueName = useContext(LeagueContext)

  const paginationClick = (type, num) => () => {
    switch(type) {
    case 'next':
      if ( teamsActivePage < pageCount ) {
        const pageNum = teamsActivePage + 1
        dispatch(setTeamsActivePage(pageNum))
      }
      break
    case 'prev':
      if ( teamsActivePage > 1 ) {
        const pageNum = teamsActivePage - 1
        dispatch(setTeamsActivePage(pageNum))
      }
      break
    case 'num':
      dispatch(setTeamsActivePage(num))
      break
    default:
      break
    }
  }

  const itemsPerPage = 4
  const pageCount = Math.ceil(teamData.length/itemsPerPage)
  const delta = isMobile ? 2 : 3

  const mobileTitle = isMobile ? <MobileTitle title='Team Standings' otherClasses='mt-2' lightTheme={lightTheme} /> : null

  return (
    <HelmetProvider>
      <Helmet>
        <title>Teams - {leagueName}</title>
      </Helmet>
      <Container>
        {mobileTitle}
        <Row>
          <Col xs={12} lg={{ span: 6, offset: 3 }} className={isMobile ? '' : 'mt-2'}>
            <Row className='mb-2'>
              <TeamDropdown source='teams' />
            </Row>
            <Outlet
              context={{
                teamsActivePage,
                pageCount,
                delta,
                paginationClick,
                teamData,
                itemsPerPage,
                addDefaultSrc,
              }}
            />
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  )
}

export default TeamsLayout