import PropTypes from 'prop-types';
import SearchResult from './SearchResult';
import styles from './SearchResultList.module.scss';

function SearchResultList(props) {

  return (
    <div id="im-search-results" className={styles.wrap}>
      {props.results.map(result => (
        <SearchResult key={result.id} result={result} />
      ))}
    </div>
  )
}

SearchResultList.propTypes = {
  results: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired)
}

export default SearchResultList;