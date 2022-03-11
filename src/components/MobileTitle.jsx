import React from 'react'
import Row from 'react-bootstrap/Row'

const MobileTitle = ({ title, lightTheme, otherClasses }) => <Row><h5 className={`${lightTheme ? '' : 'dark-theme-text'} ${otherClasses}`}>{title}</h5></Row>

export default MobileTitle