import PropTypes from 'prop-types';
import config from '../config';
import { RightIconButton } from '../components/general/button';
import { LinkContainer } from 'react-router-bootstrap';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SERPField } from '../components/search';
import styles from './SERP.module.scss';
import { SavedResultListSERP } from '../components/search-mapper';
import { useTracking } from 'react-tracking';
import { connect } from 'react-redux';
import { syncSMWidth } from '../actions/global';
import { COMP_SERP } from '../tracker/type/component';
import { EVENT_SWITCH_SM_IM } from '../tracker/type/event/general';
import { EVENT_SEARCH_SERP_ENTER, EVENT_SEARCH_SERP_LEAVE } from '../tracker/type/event/search';

function SERPPage(props) {
  const { savedResultsV2, syncSMWidth } = props;

  // hooks
  const savedArea = useRef(null);
  const [searchParams] = useSearchParams();
  const { Track, trackEvent } = useTracking({ component: COMP_SERP });

  const curPage = searchParams.has('page')
    ? parseInt(searchParams.get('page'))
    : 1;

  document.title =
    `${searchParams.get('q').replace('+', ' ')} - ${config.PRODUCT_NAME}`;

  useEffect(() => {
    syncSMWidth(savedArea.current.offsetWidth);
    trackEvent({ event: EVENT_SEARCH_SERP_ENTER, timestamp: Date.now() });

    return () => {
      trackEvent({ event: EVENT_SEARCH_SERP_LEAVE, timestamp: Date.now() });
    }
  }, [syncSMWidth, trackEvent]);

  return (
    <Track>
      <div id='im-serp-wrap' className={styles.wrap}>
        <SERPField
          className={styles.result}
          queryParam={searchParams.get('q') }
          curPage={curPage} />
        <div ref={savedArea} className={styles.saved}>
          <div className="d-flex justify-content-between mb-3">
            <span className="font-logo-main ps-2 d-block">Search Mapper</span>
            <LinkContainer to='/map'>
              <RightIconButton
                onClick={() => {
                  trackEvent({ event: EVENT_SWITCH_SM_IM, timestamp: Date.now() });
                }}
                disabled={savedResultsV2.length === 1 && savedResultsV2[0].searchResultList.length === 0}
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
  savedResultsV2: PropTypes.array.isRequired,
  syncSMWidth: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  savedResultsV2: state.search.savedResultsV2,
});

const mapDispatchToProps = {
  syncSMWidth,
};

export default connect(mapStateToProps, mapDispatchToProps)(SERPPage);