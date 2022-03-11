import { Pagination } from 'react-bootstrap'

const generatePaginationItems = (activePage, pageCount, delta, paginationClick) => {
  let items = []
  const extraItemsToRight = 3 - (activePage - delta) > 0 ? 3 - (activePage - delta) : 0 //if active page is one, add two items to the right before adding an elipses, etc.
  const extraItemsToLeft = (activePage + 2 + delta) - pageCount > 0 ? (activePage + 2 + delta) - pageCount : 0 //if active page is last, add two items to the left before addign an elipses, etc.

  let middleEllipses = extraItemsToRight || extraItemsToLeft
  let leftEllipses = !extraItemsToRight && !extraItemsToLeft
  let rightEllipses = !extraItemsToRight && !extraItemsToLeft

  for ( let num = 0; num <= pageCount + 1; num++ ) {
    const standardRow = <Pagination.Item key={num} active={num === activePage} onClick={paginationClick('num',num)} className='flex-fill my-auto'>{num}</Pagination.Item>
    const ellipses = <Pagination.Ellipsis key={num} className='flex-fill my-auto'/>
    const prevButton = <Pagination.Prev key={num} onClick={paginationClick('prev')} className='flex-fill my-auto' />
    const nextButton = <Pagination.Next key={num} onClick={paginationClick('next')} className='flex-fill my-auto' />

    if ( num === 0 ) {
      items.push(prevButton)
    } else if ( num === pageCount + 1 ) {
      items.push(nextButton)
    } else if ( (num > 1 && num < pageCount && num >= activePage - delta - extraItemsToLeft && num <= activePage + delta + extraItemsToRight) || num === 1 || num === pageCount ) {
      items.push(standardRow)
    } else if ( middleEllipses ) {
      items.push(ellipses)
      middleEllipses = !middleEllipses
    } else if ( (leftEllipses && activePage > num) || (rightEllipses && activePage < num) ) {
      if (activePage > num) {
        leftEllipses = !leftEllipses
        if ( activePage - 1 === delta + 2 ) {
          items.push(standardRow)
        } else {
          items.push(ellipses)
        }
      } else {
        rightEllipses = !rightEllipses
        if ( pageCount - activePage === delta + 2 ) {
          items.push(standardRow)
        } else {
          items.push(ellipses)
        }
      }
    }
  }
  return items
}

const obj = { generatePaginationItems }

export default obj