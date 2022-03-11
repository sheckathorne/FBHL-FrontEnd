import React from 'react'
import { Row, Col } from 'react-bootstrap'

const HorizontalDivider = ({ width, className }) => <Row className={className}><Col lg={{ width }}><hr /></Col></Row>

export default HorizontalDivider