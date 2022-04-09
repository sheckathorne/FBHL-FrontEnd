import React from 'react'
import { Row, Col } from 'react-bootstrap'
import StatRowCol from './StatRowCol'

const StatRow = ({ stats, type, statColumns, themeTextClass, aPlayerIsSelelected }) => {
  const headerRow = type === 'total' ?
    <Row>{statColumns.map(stat =>
      <StatRowCol
        key={stat.id}
        value={stat.columnLabel}
        bold={true}
        themeTextClass={themeTextClass}
        aPlayerIsSelelected={aPlayerIsSelelected}
      />)}
    </Row> : null

  return (
    <>
      <Col>
        {headerRow}
        <Row>
          {statColumns.map(stat =>
            <StatRowCol
              key={stat.id}
              value={stats[`${stat.statName}`]}
              bold={false}
              themeTextClass={themeTextClass}
              aPlayerIsSelelected={aPlayerIsSelelected}
            />
          )}
        </Row>
      </Col>
    </>
  )
}

export default StatRow