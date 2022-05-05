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
import { Pagination } from 'react-bootstrap';
import { range } from '../utils';

function SERPPage() {
  // hooks
  const savedArea = useRef(null);
  const globalCtx = useContext(GlobalContext);
  const resultCtx = useContext(SearchResultContext);
  const [searchParams] = useSearchParams();
  const [isFetching, setFetching] = useState(false);

  const curPage = searchParams.has('page')
    ? parseInt(searchParams.get('page'))
    : 1;

  // whether current search result has been buffered in context
  const serFetched =
    searchParams.get('q') === resultCtx.bufferedSearch.q &&
    curPage === resultCtx.bufferedSearch.page &&
    resultCtx.bufferedSearch.results.length !== 0;
  
  const totalPage = resultCtx.bufferedSearch.totalCount !== 0
    ? Math.ceil(resultCtx.bufferedSearch.totalCount/20)
    : 1;

  // generate array for pagination list
  const getPaginationIndex = () => {
    if (totalPage <= 5) return range(1, totalPage + 1)

    var bottom = Math.max(curPage - 2, 1);
    var top = Math.min(curPage + 2, totalPage);

    if (top === totalPage) bottom -= (curPage + 2) - totalPage;
    if (bottom === 1) top += 1 - (curPage - 2);

    return range(bottom, top + 1)
  }

  document.title =
    `${searchParams.get('q').replace('+', ' ')} - ${config.PRODUCT_NAME}`;

  useEffect(() => {
    globalCtx.updateSavedAreaWidth(savedArea.current.offsetWidth);

    if (!serFetched && !isFetching) {
      setFetching(true);

      axios.post(config.api.HOST + '/searchresults', {
        action: 'get_searchresult',
        keyword: searchParams.get('q'),
        count: '20',
        offset: (20 * (curPage - 1)).toString()
      })
        .then(response => response.data.searchlist.webPages)
        .then(webPages => {
          console.log(webPages.value);
          const newResults = webPages.value.map(v => ({
            id: v.id,
            title: v.name,
            url: v.displayUrl,
            desc: v.snippet
          }));

          // update search data to context
          resultCtx.updateBufferedSearch({
            results: newResults,
            q: searchParams.get('q'),
            page: curPage,
            totalCount: webPages.totalEstimatedMatches
          });

          setFetching(false);
        });
    }
  }, [globalCtx, searchParams, resultCtx, serFetched, isFetching, curPage]);

  return (
    <div id='im-serp-wrap' className={styles.wrap}>
      <div className={styles.result}>
        <SearchField
          id='im-current-search-area'
          className={styles.searchfield}
          placeholder='Your creativity starts here.'
          defaultQuery={searchParams.get('q') }/>
        { !serFetched && 
          <div className={styles.loading}>
            <RingSpinner size={60} color='#1B6B8C'/>
          </div> }
        <SearchResultList results={resultCtx.bufferedSearch.results} />
        <Pagination className={styles.page}>
          <Pagination.Prev
            href={`/search?q=${searchParams.get('q')}&page=${curPage - 1}`}
            disabled={curPage === 1} />
          {getPaginationIndex().map(
            i =>
              <Pagination.Item
                key={i}
                active={curPage === i}
                href={`/search?q=${searchParams.get('q')}&page=${i}`}>
                  {i}
              </Pagination.Item>
          ) }
          <Pagination.Next
            href={`/search?q=${searchParams.get('q')}&page=${curPage + 1}`}
            disabled={curPage === totalPage} />
        </Pagination>
      </div>
      <div ref={savedArea} className={styles.saved}>
        <div className="d-flex justify-content-end mb-3">
          <LinkContainer to='/map'>
            <RightIconButton
              variant='primary'
              btnText={config.IDEA_CANVAS_NAME}
              fsIcon={['fas', 'chevron-right']} />
          </LinkContainer>
        </div>
        <SavedResultSortableList />
      </div>
    </div>
  )
}

export default SERPPage;