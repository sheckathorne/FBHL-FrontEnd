import React from 'react'
import { Table, Row, Col } from 'react-bootstrap'

const BootstrapTable = ({ columns, data, responsive, striped, hover, bordered, borderless, size, variant, className, sortField, type, handleTableClick }) => {
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
            <TableBody
              data={data}
              type={type}
              sortField={sortField}
              handleTableClick={handleTableClick}
            />
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

const TableBody = ({ data, type, sortField, handleTableClick }) => {
  return (
    <tbody>
      {data.map((row, i) =>
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
      )}
    </tbody>
  )
}

export default BootstrapTable