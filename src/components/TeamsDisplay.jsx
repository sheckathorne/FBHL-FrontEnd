import React from 'react'
import TeamCard from './TeamCard'
import paginationFunction from '../helpers/paginationFunction.js'
import PaginationRow from './PaginationRow'
import { Row, Col } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom'

const TeamsDisplay = () => {
  const contextObj = useOutletContext()

  const paginationItems = paginationFunction.generatePaginationItems(contextObj.teamsActivePage, contextObj.pageCount, contextObj.delta, contextObj.paginationClick)
  const paginationDisplay = ( contextObj.pageCount > 1 ) ? <Row><Col className='d-grid gap-2'><PaginationRow items={paginationItems} /></Col></Row> : null
  const displayedTeams = contextObj.teamData.slice((contextObj.teamsActivePage - 1) * contextObj.itemsPerPage, ((contextObj.teamsActivePage - 1) * contextObj.itemsPerPage) + contextObj.itemsPerPage)

  return (
    <>
      {paginationDisplay}
      <Row>
        <Col>
          {displayedTeams.map(team =>
            <TeamCard
              key={team.teamId}
              team={team}
              addDefaultSrc={contextObj.addDefaultSrc}
              handlePaginationClick={contextObj.handlePaginationClick}
            />
          )}
        </Col>
      </Row>
    </>
  )
}

export default TeamsDisplay