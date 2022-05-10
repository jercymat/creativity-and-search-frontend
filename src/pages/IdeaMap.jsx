import config from '../config';
import { useContext } from 'react';
import styles from './IdeaMap.module.scss';
import SavedResultList from '../components/search/SavedResultList';
import IdeaMapCanvas from '../components/ideamap/IdeaMapCanvas';
import { useNavigate } from 'react-router-dom';
import { GlobalContext, SearchResultContext } from '../store';
import { LeftIconButton } from '../components/general/button';

function IdeaMapPage(props) {
  const globalCtx = useContext(GlobalContext);
  const resultCtx = useContext(SearchResultContext);
  const navigate = useNavigate();

  document.title = `${config.PRODUCT_NAME} ${config.IDEA_CANVAS_NAME}`;

  return (
    <div id="im-map-wrap" className={styles.wrap}>
      <div
        className={styles.saved}
        style={{width: `calc(${globalCtx.savedAreaWidth}px)`}}>
        <div className="mb-3">
          <LeftIconButton
            variant='primary'
            btnText={config.IDEA_SAVER_NAME}
            fsIcon={['fas', 'chevron-left']}
            onClick={() => navigate(-1)} />
        </div>
        <SavedResultList saves={resultCtx.savedResults} />
      </div>
      <div
        className={styles.canvas}
        style={{ width: `calc(100vw - 1.5rem - ${globalCtx.savedAreaWidth}px)` }}>
          <IdeaMapCanvas />
      </div>
    </div>
  )
}

export default IdeaMapPage;