import { useContext } from 'react';
import AppContext from '../store/AppContext';
import styles from './IdeaMap.module.scss';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import LeftIconButton from '../components/general/button/LeftIconButton'
import SavedResultList from '../components/search/SavedResultList';
import IdeaMapCanvas from '../components/ideamap/IdeaMapCanvas';

function IdeaMapPage(props) {
  const context = useContext(AppContext);

  return (
    <div id="im-map-wrap" className={styles.wrap}>
      <div
        className={styles.saved}
        style={{width: `calc(${context.savedAreaWidth}px)`}}>
        <div className="mb-3">
          <LinkContainer to='/search'>
            <LeftIconButton variant='primary' btnText='Search Result' fsIcon={['fas', 'chevron-left']} />
          </LinkContainer>
        </div>
        <SavedResultList saves={context.savedResults} />
      </div>
      <div
        className={styles.canvas}
        style={{ width: `calc(100vw - 1.5rem - ${context.savedAreaWidth}px)` }}>
          <IdeaMapCanvas />
      </div>
    </div>
  )
}

export default IdeaMapPage;