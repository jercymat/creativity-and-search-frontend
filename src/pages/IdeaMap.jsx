import config from '../config';
import { useContext } from 'react';
import styles from './IdeaMap.module.scss';
import IdeaMapCanvas from '../components/ideamap/IdeaMapCanvas';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context';
import { LeftIconButton } from '../components/general/button';
import { SavedResultListIM } from '../components/saved-result';
import { useTracking } from 'react-tracking';

function IdeaMapPage(props) {
  const globalCtx = useContext(GlobalContext);
  const navigate = useNavigate();
  const { Track, trackEvent } = useTracking({ page: 'ideaMapper' });

  document.title = `${config.PRODUCT_NAME} ${config.IDEA_CANVAS_NAME}`;

  const handleBack = () => {
    navigate(-1);
    trackEvent({ event: 'switchSerpMapper', timestamp: Date.now() });
    trackEvent({ event: 'leaveIdeaMap', timestamp: Date.now() });
  }

  return (
    <Track>
      <div id="im-map-wrap" className={styles.wrap}>
        <div
          className={styles.saved}
          style={{width: `calc(${globalCtx.savedAreaWidth}px)`}}>
          <div className="mb-3">
            <LeftIconButton
              variant='primary'
              btnText={config.IDEA_SAVER_NAME}
              fsIcon={['fas', 'chevron-left']}
              onClick={handleBack} />
          </div>
          <SavedResultListIM />
        </div>
        <div
          className={styles.canvas}
          style={{ width: `calc(100vw - 1.5rem - ${globalCtx.savedAreaWidth}px)` }}>
            <IdeaMapCanvas />
        </div>
      </div>
    </Track>
  )
}

export default IdeaMapPage;