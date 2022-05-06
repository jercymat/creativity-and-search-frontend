import PropTypes from 'prop-types';
import { Pagination } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { range } from "../../utils";

function SearchResultPaginator(props) {
  const { baseUrl, current, total, className } = props;

  // generate array for pagination list
  const getPaginationIndex = () => {
    if (total <= 5) return range(1, total + 1)

    var bottom = Math.max(current - 2, 1);
    var top = Math.min(current + 2, total);

    if (top === total) bottom -= (current + 2) - total;
    if (bottom === 1) top += 1 - (current - 2);

    return range(bottom, top + 1)
  }

  const handleScrollTop = () => window.scrollTo(0, 0);

  return (
    <Pagination className={className}>
      <LinkContainer to={`${baseUrl}&page=${current - 1}`}>
        <Pagination.Prev
          onClick={handleScrollTop}
          disabled={current === 1} />
      </LinkContainer>
      {getPaginationIndex().map(
        i =>
          <LinkContainer
            to={`${baseUrl}&page=${i}`}
            key={i}>
            <Pagination.Item
              onClick={handleScrollTop}
              active={current === i}>
              {i}
            </Pagination.Item>
          </LinkContainer>
      )}
      <LinkContainer to={`${baseUrl}&page=${current + 1}`}>
        <Pagination.Next
          onClick={handleScrollTop}
          disabled={current === total} />
      </LinkContainer>
    </Pagination>
  )
}

SearchResultPaginator.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  className: PropTypes.string
}

export default SearchResultPaginator;