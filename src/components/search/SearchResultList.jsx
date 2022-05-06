import axios from 'axios';
import PropTypes from 'prop-types';
import { useCallback, useContext, useState } from 'react';
import config from '../../config';
import { SearchResultContext } from '../../store';
import SearchResult from './SearchResult';
import styles from './SearchResultList.module.scss';

function SearchResultList(props) {
  const resultCtx = useContext(SearchResultContext);
  const [isAdding, setAdding] = useState(false);

  const handleAddResult = useCallback((result) => {
    if (!isAdding) {
      setAdding(true);

      axios.post(config.api.HOST + '/searchresults', {
        action: 'add_searchresult',
        data: {
          name: result.title,
          url: result.url,
          snippet: result.desc
        }
      })
        .then(response => response.data)
        .then(data => {
          if (data.ret === 0) {
            const newResults = [...resultCtx.savedResults];
            newResults.push({
              id: data.searchResult_id.toString(),
              ...result
            });
            resultCtx.updateSavedResults(newResults);
            setAdding(false);
          }
        });
    }
  }, [isAdding, resultCtx])

  return (
    <div id="im-search-results" className={styles.wrap}>
      {props.results.map(result => (
        <SearchResult
          key={result.id}
          result={result}
          onAddSave={handleAddResult} />
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