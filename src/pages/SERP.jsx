import config from '../config';
import RightIconButton from '../components/general/button/RightIconButton';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useRef } from 'react';
import SavedResultSortableList from '../components/search/SavedResultSortableList';
import { useSearchParams } from 'react-router-dom';
import { GlobalContext, SearchResultContext } from '../store';
import SERPField from '../components/search/SERPField';
import styles from './SERP.module.scss';

function SERPPage() {
  // hooks
  const savedArea = useRef(null);
  const globalCtx = useContext(GlobalContext);
  const resultCtx = useContext(SearchResultContext);
  const [searchParams] = useSearchParams();

  const curPage = searchParams.has('page')
    ? parseInt(searchParams.get('page'))
    : 1;

  document.title =
    `${searchParams.get('q').replace('+', ' ')} - ${config.PRODUCT_NAME}`;

  useEffect(() => {
    globalCtx.updateSavedAreaWidth(savedArea.current.offsetWidth);
  }, [globalCtx]);

  return (
    <div id='im-serp-wrap' className={styles.wrap}>
      <SERPField
        className={styles.result}
        queryParam={searchParams.get('q') }
        curPage={curPage} />
      <div ref={savedArea} className={styles.saved}>
        <div className="d-flex justify-content-end mb-3">
          <LinkContainer to='/map'>
            <RightIconButton
              disabled={resultCtx.savedResults.length === 0}
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