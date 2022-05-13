import PropTypes from 'prop-types';
import { SearchResultContext } from "../../context";
import { RingSpinner } from 'react-spinners-kit';
import styles from './SERPField.module.scss';
import { useCallback, useContext, useEffect, useState } from "react";
import SearchField from "./SearchField";
import axios from "axios";
import config from "../../config";
import SearchResultList from './SearchResultList';
import { SearchResultPaginator } from './general';

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
  
  // load search results
  const loadResults = useCallback(async () => {
    const response = await axios.post(config.api.HOST + '/searchresults', {
      action: 'get_searchresult',
      keyword: queryParam,
      count: '20',
      offset: (20 * (curPage - 1)).toString()
    }, { withCredentials: true });

    const newResults = response.data.searchlist.webPages.value.map(v => ({
      id: v.id,
      title: v.name,
      url: v.displayUrl,
      desc: v.snippet
    }));

    return {
      results: newResults,
      q: queryParam,
      page: curPage,
      totalCount: response.data.searchlist.webPages.totalEstimatedMatches
    };
  }, [curPage, queryParam]);
  
  useEffect(() => {
    if (serFetched) return;
    if (isFetching) return;

    setFetching(true);
    loadResults()
      .then(search => {
        // update search data to context
        resultCtx.updateBufferedSearch(search);
        setFetching(false);
      });
  }, [isFetching, loadResults, resultCtx, serFetched]);

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