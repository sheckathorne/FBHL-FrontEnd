import React from 'react'
import { Table, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { setSortField } from '../reducers/playerSortReducer'
import { useNavigate } from 'react-router-dom'
import { setPlayersActivePage } from '../reducers/paginationReducer'

const BootstrapTable = ({ columns, data, responsive, striped, hover, bordered, borderless, size, variant, className, sortField, type, handleTableClick, playerType, summaryObj, rankedPlayers }) => { 
  const summaryRow = summaryObj ?
  <SummaryRow summaryObj={summaryObj} columns={columns} sortField={sortField} rankedPlayers={rankedPlayers} />
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

const SummaryRow = ({ summaryObj, columns, sortField, rankedPlayers }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate('')
  
  const itemsPerPage = 6
  const indexOfNextRank = rankedPlayers.findIndex(player => player.rank === summaryObj.nextRank)
  const page = Math.ceil(parseFloat(indexOfNextRank)/parseFloat(itemsPerPage))

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

  const handleSummaryClick = () => {
    dispatch(setSortField(sortField))
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