import PropTypes from 'prop-types';
import { SearchResultContext } from "../../store";
import SearchField from "./SearchField";
import { RingSpinner } from 'react-spinners-kit';
import SearchResultList from "./SearchResultList";
import SearchResultPaginator from "./SearchResultPaginator";
import styles from './SERPField.module.scss';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";

function SERPField(props) {
  const { className, queryParam, curPage } = props;

  const resultCtx = useContext(SearchResultContext);
  const [isFetching, setFetching] = useState(false);

  // whether current search result has been buffered in context
  const serFetched =
    queryParam === resultCtx.bufferedSearch.q &&
    curPage === resultCtx.bufferedSearch.page &&
    resultCtx.bufferedSearch.results.length !== 0;
  
  const totalPage = resultCtx.bufferedSearch.totalCount !== 0
    ? Math.ceil(resultCtx.bufferedSearch.totalCount / 20)
    : 1;
  
  useEffect(() => {
    if (!serFetched && !isFetching) {
      setFetching(true);

      axios.post(config.api.HOST + '/searchresults', {
        action: 'get_searchresult',
        keyword: queryParam,
        count: '20',
        offset: (20 * (curPage - 1)).toString()
      })
        .then(response => response.data.searchlist.webPages)
        .then(webPages => {
          const newResults = webPages.value.map(v => ({
            id: v.id,
            title: v.name,
            url: v.displayUrl,
            desc: v.snippet
          }));

          // update search data to context
          resultCtx.updateBufferedSearch({
            results: newResults,
            q: queryParam,
            page: curPage,
            totalCount: webPages.totalEstimatedMatches
          });

          setFetching(false);
        });
    }
  }, [isFetching, serFetched, queryParam, curPage, resultCtx]);

  return (
    <div className={className}>
      <SearchField
        id='im-current-search-area'
        className={styles.searchfield}
        placeholder='Your creativity starts here.'
        defaultQuery={queryParam} />
      {isFetching &&
        <div className={styles.loading}>
          <RingSpinner size={60} color='#1B6B8C' />
        </div>}
      {!isFetching &&
        <SearchResultList results={resultCtx.bufferedSearch.results} />}
      <SearchResultPaginator
        baseUrl={`/search?q=${queryParam}`}
        current={curPage}
        total={totalPage}
        className={styles.page} />
    </div>
  )
}

SERPField.propTypes = {
  queryParam: PropTypes.string.isRequired,
  curPage: PropTypes.number.isRequired,
  className: PropTypes.string
}

export default SERPField;