import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaSortUp, FaSortDown } from 'react-icons/fa'

const SortDropdownItem = ({ field, fieldName, descending, active, alpha, reversed, handleSortClick }) => {  
  if ( active ) {
    if ( descending ) {
      return (
        <>
          <Dropdown.Item
            active={active}
            onClick={handleSortClick}
            descending={descending.toString()}
            alpha={alpha.toString()}
            reversed-stat={reversed.toString()}
            item-value={field}
          >
            {fieldName} <FaSortDown />
          </Dropdown.Item>
        </>
      )
    } else {
      return (
        <>
          <Dropdown.Item
            active={active}
            onClick={handleSortClick}
            descending={descending.toString()}
            alpha={alpha.toString()}
            reversed-stat={reversed.toString()}
            item-value={field}
          >
            {fieldName} <FaSortUp />
          </Dropdown.Item>
        </>
      )
    }
  } else {
    return (
      <Dropdown.Item
        active={active}
        onClick={handleSortClick}
        descending={descending.toString()}
        alpha={alpha.toString()}
        reversed-stat={reversed.toString()}
        item-value={field}
      >
        {fieldName}
      </Dropdown.Item>
    )
  }
}

export default SortDropdownItem