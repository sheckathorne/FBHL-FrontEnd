import React from 'react'
import { Row, Col, Image } from 'react-bootstrap'
import { generateFromString } from 'generate-avatar'

const UnrankedAvatar = ({ playerId }) => (
  <>
    <Row>
      <Col className='d-flex justify-content-center'>
        <Image className='avatar' src={`data:image/svg+xml;utf8,${generateFromString(`${playerId}`)}`} roundedCircle />
      </Col>
    </Row>
  </>
)

export default UnrankedAvatar