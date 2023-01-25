import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { connect } from 'react-redux';
import { addSavedResults } from '../../actions/search';
import { SearchResult } from './general';
import styles from './SearchResultList.module.scss';

function SearchResultList(props) {
  const { loading, results, addSavedResults } = props;

  const handleAddResult = useCallback((result) => {
    if (!loading) {
      addSavedResults(result);
    }
  }, [addSavedResults, loading])

  return (
    <div id="im-search-results" className={styles.wrap}>
      {results.map(result => (
        <SearchResult
          key={result.id}
          result={result}
          onAddSave={handleAddResult} />
      ))}
    </div>
  )
}

SearchResultList.propTypes = {
  loading: PropTypes.bool.isRequired,
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
});

const mapDispatchToProps = {
  addSavedResults,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);