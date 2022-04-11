import React from 'react'
import { Collapse, Col, Row } from 'react-bootstrap'
import { AiOutlineCaretRight, AiOutlineCaretDown } from 'react-icons/ai'
import SmallMatchResultCard from './SmallMatchResultCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper'
import { setResultsOpen } from '../reducers/viewToggleReducer'
import { useSelector, useDispatch } from 'react-redux'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'

const RecentResultsCarousel = ({ matches, lightTheme, width }) => {
  const resultsOpen = useSelector(state => state.viewToggle.resultsOpen)
  const dispatch = useDispatch()
  const isMobile = width <= 640
  const isTablet = width > 640 && width <= 1225
  const slidesPerViewViewport = isMobile ? 1 : isTablet ? 3 : 5
  const slidesPerView = Math.min(matches.length, slidesPerViewViewport)
  const loop = matches.length >= slidesPerView
  const themeClass = lightTheme ? '' : 'dark-theme-text'
  const caret = resultsOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />
  const carouselDelay = isMobile ? 3000 : isTablet ? 5000 : 7500

  const clickableTitle = isMobile ? (
    <Col className='mt-1' onClick={() => dispatch(setResultsOpen(!resultsOpen))}>
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
        carouselItem={true}
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