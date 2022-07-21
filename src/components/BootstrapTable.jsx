import React from 'react'
import { Table, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { setSortField } from '../reducers/playerSortReducer'
import { useNavigate } from 'react-router-dom'
import { setPlayersActivePage } from '../reducers/paginationReducer'
import { setSortField as setGkSortField } from '../reducers/goaltenderSortReducer'
import data from '../helpers/data'

const BootstrapTable = ({ columns, data, responsive, striped, hover, bordered, borderless, size, variant, className, sortField, type, handleTableClick, playerType, summaryObj, rankedPlayers }) => { 
  const summaryRow = summaryObj ?
  <SummaryRow summaryObj={summaryObj} columns={columns} sortField={sortField} rankedPlayers={rankedPlayers} playerType={playerType} />
  : null

  return (
    <>
      <Row className='mt-2'>
        <Col>
          <Table
            responsive={responsive}
            striped={striped}
            hover={hover}
            bordered={bordered}
            borderles={borderless}
            size={size}
            variant={variant}
            className={className}
          > 
            <TableHead columns={columns} />
            <tbody>
              <TableRows
                data={data}
                type={type}
                sortField={sortField}
                playerType={playerType}
                handleTableClick={handleTableClick}
              />
              {summaryRow}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  )
}

const TableHead = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map((col,i) =>
          <th key={i} className={`text-${col.position} ${col.className} table-header-row`}><small>{col.title}</small></th>
        )}
      </tr>
    </thead>
  )
}

const TableRows = ({ data, type, sortField, handleTableClick, playerType }) => {
  return (
    data.map((row, i) =>
      <tr key={i} className='pointer-cursor table-row' onClick={type === 'players' ? handleTableClick.players(sortField, row.rowUrl, playerType) : handleTableClick.league(row.rowUrl)}>
        {Object.keys(row.columns).map((col, i) => {
          const colObj = row.columns[`${col}`]
          const positionClass = `text-${colObj.position}`
          return (
            <td key={i} className={'align-middle'.concat(' ',[ positionClass, colObj.class ].join(' '))}>
              {colObj.value}
            </td>
          )}
        )}
      </tr>
    )
  )
}

const SummaryRow = ({ summaryObj, columns, sortField, rankedPlayers, playerType }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate('')
  
  const rankField = `${sortField.field}_rank`    
  const itemsPerPage = 6
  const indexOfNextRank = rankedPlayers.findIndex(player => player[rankField] === summaryObj.nextRank)
  const page = Math.ceil(parseFloat(indexOfNextRank + 1)/parseFloat(itemsPerPage))

  const ordinal_suffix_of = (i) => {
    let j = i % 10,
      k = i % 100
    if (j === 1 && k !== 11) {
      return i + 'st'
    }
    if (j === 2 && k !== 12) {
      return i + 'nd'
    }
    if (j === 3 && k !== 13) {
      return i + 'rd'
    }
    return i + 'th'
  }

  function getFullSort(sortField, playerType) {
    const buttons = playerType === 'skaters' ? data.sortButtons : data.goaltenderSortButtons
    const sortButton = buttons.find(button => button.field === sortField.field)
    
    return {
      field: sortButton.field,
      descending: true,
      alpha: sortButton.alpha,
      reversed: sortButton.reversed,
      secondaryFieldName: sortButton.secondaryFieldName,
      secondaryReversed: sortButton.secondaryReversed,
    }
  }

  const handleSummaryClick = () => {
    if ( playerType === 'skaters' ) {
      dispatch(setSortField(getFullSort(sortField, playerType)))
    } else {
      dispatch(setGkSortField(getFullSort(sortField, playerType)))
    }
    dispatch(setPlayersActivePage(page)) 
    navigate('/players')
  }

  return (
    <tr className='pointer-cursor table-row' onClick={handleSummaryClick}>
      <td colSpan={columns.length} className='text-center'> 
        {`${summaryObj.additionalPlayers} more players ranked ${ordinal_suffix_of(summaryObj.nextRank)}`}
      </td>
    </tr>
  )
}

export default BootstrapTable