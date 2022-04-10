import React, { useContext, useEffect } from 'react'
import paginationFunction from '../helpers/paginationFunction.js'
import PaginationRow from './PaginationRow'
import MatchCardPlayed from './MatchCardPlayed'
import MatchCardUnplayed from './MatchCardUnplayed'
import data from '../helpers/data.js'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Alert } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import MobileContext from './MobileContext'
import { useSelector, useDispatch } from 'react-redux'
import { setMatchActivePage } from '../reducers/paginationReducer.js'
import { setNotification, clearNotification } from '../reducers/notificationReducer.js'

const MatchCardDashboard = ({ filteredMatchCards, queriedMatch, teamId }) => {
  const notification = useSelector(state => state.notification)
  const matchActivePage = useSelector(state => state.pagination.matchActivePage)
  const user = useSelector(state => state.user.user)
  const invalidMatches = useSelector(state => state.invalidMatches)

  const dispatch = useDispatch()
  const addDefaultSrc = (e) => e.target.src = data.defaultCrest

  const isMobile = useContext(MobileContext)
  const themeVariant = useContext(ThemeContext).value === 'light' ? 'outline-dark' : 'dark'

  const returnUrl = teamId ? `/calendar/${teamId}` : '/calendar'
  const delta = isMobile ? 1 : 2
  const itemsPerPage = isMobile ? 3 : queriedMatch ? 4 : 8

  const displayAlert = (message, type) => {
    dispatch(setNotification({ message: message, type: type, scope: 'MatchCardDashboard' }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 4000)
  }

  const matchCardsWithInvalidFlag = filteredMatchCards.map(match => ({invalid: invalidMatches.includes(match.matchId), ...match }))
  const filteredMatchCardsByInvalid = user !== null && user.role === 'admin' ? matchCardsWithInvalidFlag : matchCardsWithInvalidFlag.filter(match => !match.invalid)
  const pageCount = Math.ceil(filteredMatchCardsByInvalid.length/itemsPerPage)

  // When clicking on the match card carousel on league dashboard, change the match card dashboard pagination to the page which contains the clicked match
  useEffect(() => {
    if ( queriedMatch ) {
      const matchIndex = filteredMatchCardsByInvalid.findIndex(match => match.matchId === queriedMatch.matchId)
      const pageNum = Math.ceil(parseFloat((matchIndex + 1))/parseFloat(itemsPerPage))
      dispatch(setMatchActivePage(pageNum))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[queriedMatch, dispatch])

  useEffect(() => {
    if ( matchActivePage > pageCount && pageCount !== 0 ) {
      dispatch(setMatchActivePage(pageCount))
    }
  },[dispatch, matchActivePage, pageCount])

  const displayedMatches = filteredMatchCardsByInvalid.sort((a,b) => a.timestamp - b.timestamp).slice((matchActivePage - 1) * itemsPerPage, ((matchActivePage - 1) * itemsPerPage) + itemsPerPage)
  const paginationItems = paginationFunction.generatePaginationItems(matchActivePage, pageCount, delta, paginationClick)

  function paginationClick (type, num) {
    return () => {
      switch(type) {
      case 'next':
        if ( matchActivePage < pageCount ) {
          const pageNum = matchActivePage + 1
          dispatch(setMatchActivePage(pageNum))
        }
        break
      case 'prev':
        if ( matchActivePage > 1 ) {
          const pageNum = matchActivePage - 1
          dispatch(setMatchActivePage(pageNum))
        }
        break
      case 'num':
        dispatch(setMatchActivePage(num))
        break
      default:
        break
      }
    }
  }

  // if deleting a scheduled match card results in current pagination page being greater than number of pages, roll back one page
  const goToLastPaginationPage = () => {
    const pageCount = Math.ceil((filteredMatchCardsByInvalid.length - 1)/itemsPerPage)
    if ( matchActivePage > pageCount ) {
      dispatch(setMatchActivePage(pageCount))
    }
  }

  const pagination = pageCount > 1 ?  (
    <PaginationRow
      items={paginationItems}
    />) : null

  const calendarBtn = queriedMatch ? (
    <Row className='mb-2'>
      <Col>
        <Button as={Link} to={returnUrl} className='d-grid gap-2 fluid' variant={themeVariant}>Show Calendar</Button>
      </Col>
    </Row> ) : null

  const alertBanner = ( notification.message !== null && notification.scope === 'MatchCardDashboard' ) ? <Alert variant={notification.type} onClose={() => dispatch(clearNotification())} dismissible>{notification.text}</Alert> : null

  return (
    <>
      <Row>
        <Col>
          {pagination}
          {alertBanner}
        </Col>
      </Row>
      {calendarBtn}
      <Row>
        {displayedMatches.map(match => {
          if ( match.matchWasPlayed ) {
            return (
              <MatchCardPlayed
                key={match._id}
                id={match._id}
                match={match}
                addDefaultSrc={addDefaultSrc}
                goToLastPaginationPage={goToLastPaginationPage}
                queriedMatch={queriedMatch}
              />
            )
          } else {
            return (
              <MatchCardUnplayed
                key={match._id}
                id={match._id}
                match={match}
                addDefaultSrc={addDefaultSrc}
                displayAlert={displayAlert}
                goToLastPaginationPage={goToLastPaginationPage}
              />
            )
          }
        })}
      </Row>
    </>
  )
}

export default MatchCardDashboard