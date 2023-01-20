import PropTypes from 'prop-types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '../../config';
import { SavedResultIM } from './cell';
import styles from './SavedResultList.module.scss';
import { connect } from 'react-redux';
import { updateSavedResults } from '../../actions/search';

function SavedResultListIM(props) {
  const { savedResults, updateSavedResults } = props;
  // const resultCtx = useContext(SearchResultContext);
  const [fetched, setFetched] = useState(false);
  
  // load result list
  const loadList = async () => {
    const response = await axios.post(config.api.HOST + '/searchresults', {
      action: 'list_searchresult'
    }, { withCredentials: true });

    return response.data.relist.map(saved => ({
      id: saved.id.toString(),
      title: saved.name,
      url: saved.url,
      desc: saved.snippet
    }));
  }

  useEffect(() => {
    if (fetched) return;
    if (savedResults.length !== 0) return;

    setFetched(true);
    loadList()
      .then(list => updateSavedResults(list));
  }, [fetched, savedResults, updateSavedResults]);

  return (
    <div id='im-saved-results' className={styles.wrap}>
      {savedResults.map(save => (
        <SavedResultIM key={ save.id } save={save} />
      ))}
    </div>
  )
}

SavedResultListIM.propTypes = {
  savedResults: PropTypes.array.isRequired,
  updateSavedResults: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  savedResults: state.search.savedResults,
});

const mapDispatchToProps = {
  updateSavedResults,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListIM);