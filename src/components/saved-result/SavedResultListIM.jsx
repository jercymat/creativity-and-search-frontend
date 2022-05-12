import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import config from '../../config';
import { SearchResultContext } from '../../context';
import { SavedResult } from './cell';
import styles from './SavedResultList.module.scss';

function SavedResultListIM() {
  const resultCtx = useContext(SearchResultContext);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched) {
      setFetched(true);

      axios.post(config.api.HOST + '/searchresults', {
        action: 'list_searchresult'
      })
        .then(response => response.data.relist)
        .then(list => {
          resultCtx.updateSavedResults(list.map(saved => ({
            id: saved.id.toString(),
            title: saved.name,
            url: saved.url,
            desc: saved.snippet
          })));
        });
    }
  }, [fetched, resultCtx]);

  return (
    <div id='im-saved-results' className={styles.wrap}>
      {resultCtx.savedResults.map(save => (
        <SavedResult key={ save.id } save={save} />
      ))}
    </div>
  )
}

export default SavedResultListIM;