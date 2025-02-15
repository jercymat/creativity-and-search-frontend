import PropTypes from 'prop-types';
import styles from './SERPField.module.scss';
import { useCallback, useEffect, useState } from "react";
import SearchField from "./SearchField";
import axios from "axios";
import config from "../../config";
import SearchResultList from './SearchResultList';
import { SearchResultPaginator } from './general';
import { connect } from 'react-redux';
import { addQueryID, updateBufferedSearch } from '../../actions/search';
import { Spinner } from 'react-bootstrap';

function SERPField(props) {
  const {
    className, queryParam, curPage, bufferedSearch,
    addQueryID, updateBufferedSearch,
  } = props;
  const [isFetching, setFetching] = useState(false);

  // whether current search result has been buffered at local
  const serFetched =
    queryParam === bufferedSearch.q &&
    curPage === bufferedSearch.page &&
    bufferedSearch.results.length !== 0;
  
  const totalPage = bufferedSearch.totalCount !== 0
    ? Math.ceil(bufferedSearch.totalCount / 20)
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

    return [
      {
        results: newResults,
        q: queryParam,
        page: curPage,
        totalCount: response.data.searchlist.webPages.totalEstimatedMatches
      },
      response.data.statOfQueryId
    ]
  }, [curPage, queryParam]);
  
  useEffect(() => {
    if (serFetched) return;
    if (isFetching) return;

    setFetching(true);
    loadResults()
      .then(([search, statOfQueryId]) => {
        updateBufferedSearch(search);
        addQueryID(statOfQueryId);
        setFetching(false);
      });
  }, [isFetching, loadResults, addQueryID, updateBufferedSearch, serFetched]);

  return (
    <div className={className}>
      <SearchField
        id='im-current-search-area'
        className={styles.searchfield}
        placeholder='Your creativity starts here.'
        defaultQuery={queryParam} />
      {isFetching &&
        <div className={styles.loading}>
          <Spinner
            animation="border"
            variant="primary"
            style={{ width: '4rem', height: '4rem' }} />
        </div>}
      {!isFetching &&
        <SearchResultList results={bufferedSearch.results} />}
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
  className: PropTypes.string,
  bufferedSearch: PropTypes.object.isRequired,
  addQueryID: PropTypes.func.isRequired,
  updateBufferedSearch: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  bufferedSearch: state.search.bufferedSearch,
});

const mapDispatchToProps = {
  addQueryID,
  updateBufferedSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(SERPField);