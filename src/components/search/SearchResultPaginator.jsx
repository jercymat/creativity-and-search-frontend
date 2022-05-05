import PropTypes from 'prop-types';
import { Pagination } from "react-bootstrap";
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

  return (
    <Pagination className={className}>
      <Pagination.Prev
        href={`${baseUrl}&page=${current - 1}`}
        disabled={current === 1} />
      {getPaginationIndex().map(
        i =>
          <Pagination.Item
            key={i}
            active={current === i}
            href={`${baseUrl}&page=${i}`}>
            {i}
          </Pagination.Item>
      )}
      <Pagination.Next
        href={`${baseUrl}&page=${current + 1}`}
        disabled={current === total} />
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