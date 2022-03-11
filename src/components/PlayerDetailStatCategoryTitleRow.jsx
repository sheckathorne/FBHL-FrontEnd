import React, { useRef, useEffect } from 'react'
import { Row, Col, OverlayTrigger } from 'react-bootstrap'
import { AiOutlineInfoCircle } from 'react-icons/ai'

const PlayerDetailStatCategoryTitleRow = ({ lightTheme, actionTxt, popover, categoryTitle }) => {
  const rowRef = useRef(null)

  useEffect(() => {
    rowRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' })
  },[])

  return (
    <Row className='border-bottom border-solid' ref={rowRef}>
      <Col xs={6} lg={4} className='my-auto'>
        <Row>
          <Col>
            <h6 className={lightTheme ? 'fw-bolder tiny-caps stat-column-title' : 'dark-theme-text fw-bolder tiny-caps stat-column-title'}>
              {categoryTitle}
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className={lightTheme ? 'fw-light tiny-caps expand-parathetical' : 'dark-theme-text fw-light tiny-caps expand-parathetical'}>
              {`(${actionTxt} to expand)`}
            </small>
          </Col>
        </Row>
      </Col>
      <OverlayTrigger trigger={['hover', 'focus']} placement='auto-start' overlay={popover}>
        <Col xs={{ span: 3, offset: 3 }} lg={{ span: 4, offset: 4 }} className='d-flex justify-content-start my-auto pointer-cursor'>
          <h6 className={lightTheme ? 'fw-bolder tiny-caps' : 'dark-theme-text fw-bolder tiny-caps'}>League Rank <AiOutlineInfoCircle /></h6>
        </Col>
      </OverlayTrigger>
    </Row>
  )
}

export default PlayerDetailStatCategoryTitleRow