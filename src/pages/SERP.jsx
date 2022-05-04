import config from '../config';
import SearchResultList from '../components/search/SearchResultList';
import SearchField from '../components/search/SearchField';
import RightIconButton from '../components/general/button/RightIconButton';
import { LinkContainer } from 'react-router-bootstrap';
import styles from './SERP.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import SavedResultSortableList from '../components/search/SavedResultSortableList';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext, SearchResultContext } from '../store';
import { RingSpinner } from 'react-spinners-kit';

function SERPPage() {
  const savedArea = useRef(null);
  const globalCtx = useContext(GlobalContext);
  const resultCtx = useContext(SearchResultContext);
  const [searchParams] = useSearchParams();

  // whether current search result has been buffered
  const serBuffered = () =>
    searchParams.get('q') === resultCtx.q &&
    resultCtx.searchResults.length !== 0;

  const [fetched, setFetched] = useState(serBuffered);
  const [loading, setLoading] = useState(!fetched);
  const [loadedResults, setLoadedResults] = useState(
    serBuffered ? resultCtx.searchResults : []
  );

  useEffect(() => {
    globalCtx.updateSavedAreaWidth(savedArea.current.offsetWidth);

    if (!fetched) {
      setFetched(true);
      axios.post(config.api.HOST + '/searchresults', {
        action: 'get_searchresult',
        keyword: searchParams.get('q'),
        count: '21',
        offset: '0'
      })
        .then(response => response.data.searchlist.webPages.value)
        .then(values => {
          const newResults = values.map(v => ({
            id: v.id,
            title: v.name,
            url: v.displayUrl,
            desc: v.snippet
          }));
          setLoadedResults(newResults);
          setLoading(false);

          // update current keyword and fetched search result to context
          resultCtx.updateSearchResult(newResults);
          resultCtx.updateQ(searchParams.get('q'));
        });
    }
  }, [globalCtx, fetched, searchParams, resultCtx]);

  return (
    <div id='im-serp-wrap' className={styles.wrap}>
      <div className={styles.result}>
        <SearchField
          id='im-current-search-area'
          className={styles.searchfield}
          placeholder='Your creativity starts here.'
          defaultQuery={searchParams.get('q') }/>
        { loading && <div className={styles.loading}><RingSpinner size={60} color='#1B6B8C'/></div> }
        <SearchResultList results={loadedResults} />
      </div>
      <div ref={savedArea} className={styles.saved}>
        <div className="d-flex justify-content-end mb-3">
          <LinkContainer to='/map'>
            <RightIconButton variant='primary' btnText={config.IDEA_CANVAS_NAME} fsIcon={['fas', 'chevron-right']} />
          </LinkContainer>
        </div>
        <SavedResultSortableList />
      </div>
    </div>
  )
}

export default SERPPage;