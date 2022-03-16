import React from 'react'
import { Table, Row, Col } from 'react-bootstrap'

const BootstrapTable = ({ columns, data, responsive, striped, hover, bordered, borderless, size, variant, className, sortField, type, handleTableClick, summaryObj }) => {
  const summaryRow = summaryObj ?
  <SummaryRow summaryObj={summaryObj} />
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

const TableRows = ({ data, type, sortField, handleTableClick }) => {
  return (
    data.map((row, i) =>
      <tr key={i} className='pointer-cursor table-row' onClick={type === 'players' ? handleTableClick.players(sortField, row.rowUrl) : handleTableClick.league(row.rowUrl)}>
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

const SummaryRow = ({ summaryObj }) => {
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

  return (
    <tr className='pointer-cursor table-row'>
      <td colSpan={5} className='text-center'> 
        {`${summaryObj.additionalPlayers} more players ranked ${ordinal_suffix_of(summaryObj.nextRank)}`}
      </td>
    </tr>
  )
}

export default BootstrapTable