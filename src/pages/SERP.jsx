import PropTypes from 'prop-types';
import config from '../config';
import { RightIconButton } from '../components/general/button';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchResultContext } from '../context';
import { SERPField } from '../components/search';
import styles from './SERP.module.scss';
import { SavedResultListSERP } from '../components/saved-result';
import { useTracking } from 'react-tracking';
import { connect } from 'react-redux';
import { syncSMWidth } from '../actions/global';

function SERPPage(props) {
  const { syncSMWidth } = props;

  // hooks
  const savedArea = useRef(null);
  const resultCtx = useContext(SearchResultContext);
  const [searchParams] = useSearchParams();
  const { Track, trackEvent } = useTracking({ page: 'SERP' });

  const curPage = searchParams.has('page')
    ? parseInt(searchParams.get('page'))
    : 1;

  document.title =
    `${searchParams.get('q').replace('+', ' ')} - ${config.PRODUCT_NAME}`;

  useEffect(() => {
    syncSMWidth(savedArea.current.offsetWidth);
  }, [syncSMWidth]);

  return (
    <Track>
      <div id='im-serp-wrap' className={styles.wrap}>
        <SERPField
          className={styles.result}
          queryParam={searchParams.get('q') }
          curPage={curPage} />
        <div ref={savedArea} className={styles.saved}>
          <div className="d-flex justify-content-end mb-3">
            <LinkContainer to='/map'>
              <RightIconButton
                onClick={() => {
                  trackEvent({ event: 'switchSerpMapper', timestamp: Date.now() });
                  trackEvent({ event: 'enterIdeaMap', timestamp: Date.now() });
                }}
                disabled={resultCtx.savedResults.length === 0}
                variant='primary'
                btnText={config.IDEA_CANVAS_NAME}
                fsIcon={['fas', 'chevron-right']} />
            </LinkContainer>
          </div>
          <SavedResultListSERP />
        </div>
      </div>
    </Track>
  )
}

SERPPage.propTypes = {
  syncSMWidth: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
  syncSMWidth,
};

export default connect(mapStateToProps, mapDispatchToProps)(SERPPage);