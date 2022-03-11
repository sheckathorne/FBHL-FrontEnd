import React from 'react'
import { Collapse, Col, Row } from 'react-bootstrap'
import { AiOutlineCaretRight, AiOutlineCaretDown } from 'react-icons/ai'
import SmallMatchResultCard from './SmallMatchResultCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'

const RecentResultsCarousel = ({ matches, lightTheme, resultsOpen, handleCollapseClick, width }) => {
  const isMobile = width <= 640
  const isTablet = width > 640 && width <= 768
  const slidesPerViewViewport = isMobile ? 1 : isTablet ? 3 : 5
  const slidesPerView = Math.min(matches.length, slidesPerViewViewport)
  const loop = matches.length >= slidesPerView
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const caret = resultsOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />
  const carouselDelay = isMobile ? 3000 : isTablet ? 5000 : 7500

  const clickableTitle = isMobile ? (
    <Col className='mt-1' onClick={handleCollapseClick('results')}>
      <h5 className={themeClass + ' tiny-caps section-title'}>Recent Results{caret}</h5>
    </Col>
  ) : (
    <Col className='mt-1'>
      <h5 className={themeClass + ' tiny-caps section-title'}>Recent Results</h5>
    </Col>
  )

  const swiperItems = matches.map((match,i) =>
    <SwiperSlide key={i}>
      <SmallMatchResultCard
        match={match}
        themeClass={themeClass}
        lightTheme={lightTheme}
      />
    </SwiperSlide>
  )

  return (
    <>
      <Row className='table-title d-flex align-items-center expand-paranthetical'>
        {clickableTitle}
      </Row>
      <Collapse in={resultsOpen}>
        <div>
          <Swiper
            navigation={false}
            modules={[Navigation, Autoplay ]}
            spaceBetween={50}
            slidesPerView={slidesPerView}
            loop={loop}
            autoplay={{
              delay: carouselDelay,
              disableOnInteraction: false,
            }}
          >
            {swiperItems}
          </Swiper>
        </div>
      </Collapse>
    </>
  )
}

export default RecentResultsCarousel