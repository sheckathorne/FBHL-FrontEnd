import React from 'react'
import TeamCard from './TeamCard'
import data from '../helpers/data.js'
import { Row, Col } from 'react-bootstrap'
import { useOutletContext, useParams } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'

const TeamDisplay = () => {
  const contextObj = useOutletContext()
  const teamId = useParams().teamId.toString()
  const displayedTeam = contextObj.teamData.find(team => team.teamId === teamId)
  const teamName = data.teams.find(team => team.clubId.toString() === teamId).name

  return (
    <HelmetProvider>
      <Helmet>
        <title>Teams - {teamName}</title>
      </Helmet>
      <Row>
        <Col>
          <TeamCard
            team={displayedTeam}
            addDefaultSrc={contextObj.addDefaultSrc}
            handlePaginationClick={contextObj.handlePaginationClick}
          />
        </Col>
      </Row>
    </HelmetProvider>
  )
}

export default TeamDisplay