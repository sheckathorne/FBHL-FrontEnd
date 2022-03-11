import React, { useContext, useState } from 'react'
import paginationFunction from '../helpers/paginationFunction.js'
import PaginationRow from './PaginationRow'
import MatchCardPlayed from './MatchCardPlayed'
import MatchCardUnplayed from './MatchCardUnplayed'
import data from '../helpers/data.js'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Alert } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import MobileContext from './MobileContext'

const MatchCardDashboard = ({ filteredMatchCards, matchActivePage, handlePaginationClick, queriedMatch, teamId, deleteScheduledMatch, updateScheduledMatch, user }) => {
  const [ alertMessage, setAlertMessage ] = useState({ message: null, type: null })

  const addDefaultSrc = (e) => e.target.src = data.defaultCrest

  const isMobile = useContext(MobileContext)
  const themeVariant = useContext(ThemeContext).value === 'light' ? 'outline-dark' : 'dark'

  const returnUrl = teamId ? `/calendar/${teamId}` : '/calendar'
  const delta = isMobile ? 1 : 2
  const itemsPerPage = 3

  const displayAlert = (message, type) => {
    setAlertMessage({ message: message, type: type })
    setTimeout(() => {
      setAlertMessage({ message: null, type: null })
    }, 3000)
  }

  const pageCount = Math.ceil(filteredMatchCards.length/itemsPerPage)

  const displayedMatches = filteredMatchCards.sort((a,b) => a.timestamp - b.timestamp).slice((matchActivePage - 1) * itemsPerPage, ((matchActivePage - 1) * itemsPerPage) + itemsPerPage)
  const paginationItems = paginationFunction.generatePaginationItems(matchActivePage, pageCount, delta, paginationClick)

  function paginationClick (type, num) {
    return () => {
      switch(type) {
      case 'next':
        if ( matchActivePage < pageCount ) {
          handlePaginationClick(matchActivePage + 1, 'match')
        }
        break
      case 'prev':
        if ( matchActivePage > 1 ) {
          handlePaginationClick(matchActivePage - 1, 'match')
        }
        break
      case 'num':
        handlePaginationClick(num, 'match')
        break
      default:
        break
      }
    }
  }

  // if deleting a scheduled match card results in current pagination page being greater than number of pages, roll back one page
  const goToLastPaginationPage = () => {
    const pageCount = Math.ceil((filteredMatchCards.length - 1)/itemsPerPage)
    if ( matchActivePage > pageCount ) {
      handlePaginationClick(pageCount, 'match')
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

  const alertBanner = ( alertMessage.message !== null ) ? <Alert variant={alertMessage.type} onClose={() => setAlertMessage({ message: null, type: null })} dismissible>{alertMessage.message}</Alert> : null

  return (
    <>
      <Row>
        <Col>
          {pagination}
          {alertBanner}
        </Col>
      </Row>
      {calendarBtn}
      {displayedMatches.map(match => {
        if ( match.matchWasPlayed ) {
          return (
            <MatchCardPlayed
              key={match._id}
              id={match._id}
              match={match}
              addDefaultSrc={addDefaultSrc}
              goToLastPaginationPage={goToLastPaginationPage}
            />
          )
        } else {
          return (
            <MatchCardUnplayed
              key={match._id}
              id={match._id}
              match={match}
              addDefaultSrc={addDefaultSrc}
              deleteScheduledMatch={deleteScheduledMatch}
              updateScheduledMatch={updateScheduledMatch}
              displayAlert={displayAlert}
              goToLastPaginationPage={goToLastPaginationPage}
              user={user}
            />
          )
        }
      })}
    </>
  )
}

export default MatchCardDashboard