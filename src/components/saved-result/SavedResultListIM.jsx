import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import config from '../../config';
import { SearchResultContext } from '../../context';
import { SavedResultIM } from './cell';
import styles from './SavedResultList.module.scss';

function SavedResultListIM() {
  const resultCtx = useContext(SearchResultContext);
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
    if (resultCtx.savedResults.length !== 0) return;

    setFetched(true);
    loadList()
      .then(list => resultCtx.updateSavedResults(list));
  }, [fetched, resultCtx]);

  return (
    <div id='im-saved-results' className={styles.wrap}>
      {resultCtx.savedResults.map(save => (
        <SavedResultIM key={ save.id } save={save} />
      ))}
    </div>
  )
}

export default SavedResultListIM;