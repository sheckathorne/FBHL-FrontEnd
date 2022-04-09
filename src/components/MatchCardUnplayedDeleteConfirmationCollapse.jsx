import { Collapse, Container, Row, Col, Button } from 'react-bootstrap'

const MatchCardUnplayedDeleteConfirmationCollapse = ({ deleteConfirmIsOpen, setFinishedCollapsing, setDeleteConfirmIsOpen, handleDeleteClick, id }) => (
  <Collapse in={deleteConfirmIsOpen} onExited={() => setFinishedCollapsing(true)}>
    <Container>
      <Row className='mb-3 d-flex justify-content-center'>
        <Col className='d-grid gap-2 fluid'>
          <Button variant='warning' onClick={() => setDeleteConfirmIsOpen(false)}>Cancel Deletion</Button>
        </Col>
      </Row>
      <Row className='mb-3 d-flex justify-content-center'>
        <Col className='d-grid gap-2 fluid'>
          <Button variant='danger' onClick={handleDeleteClick(id)}>Permanently Delete</Button>
        </Col>
      </Row>
    </Container>
  </Collapse>
)

export default MatchCardUnplayedDeleteConfirmationCollapse