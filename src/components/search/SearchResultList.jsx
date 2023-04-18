import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { connect } from 'react-redux';
import { addSavedResults } from '../../actions/search';
import { SearchResult } from './general';
import styles from './SearchResultList.module.scss';

function SearchResultList(props) {
  const { loading, currentQueryID, results, addSavedResults } = props;

  const handleAddResult = useCallback((result) => {
    if (!loading) {
      addSavedResults(result);
    }
  }, [addSavedResults, loading])

  return (
    <div id="im-search-results" className={styles.wrap}>
      {results.map((result, idx) => (
        <SearchResult
          key={result.id}
          index={idx}
          result={result}
          queryID={currentQueryID}
          onAddSave={handleAddResult} />
      ))}
    </div>
  )
}

SearchResultList.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentQueryID: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired),
  addSavedResults: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  loading: state.search.loading,
  currentQueryID: state.search.currentQueryID, 
});

const mapDispatchToProps = {
  addSavedResults,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);