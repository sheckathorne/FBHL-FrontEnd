import React, { useContext } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import ThemeContext from './ThemeContext'

const PaginationRow = ({ items }) => <Pagination size="sm" className={useContext(ThemeContext).value === 'light' ? 'd-flex' : 'd-flex pagination-dark'} variant='dark'>{items}</Pagination>

export default PaginationRow