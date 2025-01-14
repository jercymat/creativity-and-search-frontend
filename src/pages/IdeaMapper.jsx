import PropTypes from 'prop-types';
import config from '../config';
import styles from './IdeaMapper.module.scss';
import { useNavigate } from 'react-router-dom';
import { useTracking } from 'react-tracking';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { closeThemeToggleModal, loadPage } from '../actions/idea';
import { COMP_IM } from '../tracker/type/component';
import { EVENT_SWITCH_SM_IM } from '../tracker/type/event/general';
import { EVENT_IM_ENTER, EVENT_IM_LEAVE } from '../tracker/type/event/idea-mapper';
import { LeftIconButton } from '../components/general/button';
import { SavedResultListIM } from '../components/search-mapper';
import { ThemeToggleModal } from '../components/idea-mapper/modals';
import { IdeaMapCanvas } from '../components/idea-mapper';

function IdeaMapperPage(props) {
  const {
    savedAreaWidth, themeToggleModalShow,
    loadPageAction, closeThemeToggleModalAction,
  } = props;
  const navigate = useNavigate();
  const { Track, trackEvent } = useTracking({ component: COMP_IM });

  document.title = `${config.PRODUCT_NAME} ${config.IDEA_CANVAS_NAME}`;

  const handleBack = () => {
    navigate(-1);
    trackEvent({ event: EVENT_SWITCH_SM_IM, timestamp: Date.now() });
  }

  useEffect(() => {
    loadPageAction();
    trackEvent({ event: EVENT_IM_ENTER, timestamp: Date.now() });

    return () => {
      trackEvent({ event: EVENT_IM_LEAVE, timestamp: Date.now() });
    }
  }, [loadPageAction, trackEvent]);
  

  return (
    <Track>
      <div id="im-map-wrap" className={styles.wrap}>
        <div
          className={styles.saved}
          style={{width: `calc(${savedAreaWidth}px)`}}>
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
          style={{ width: `calc(100vw - 1.5rem - ${savedAreaWidth}px)` }}>
            <IdeaMapCanvas />
        </div>
        <ThemeToggleModal
          show={themeToggleModalShow}
          onCloseModal={closeThemeToggleModalAction} />
      </div>
    </Track>
  )
}

IdeaMapperPage.propTypes = {
  savedAreaWidth: PropTypes.number.isRequired,
  themeToggleModalShow: PropTypes.bool.isRequired,
  loadPageAction: PropTypes.func.isRequired,
  closeThemeToggleModalAction: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  savedAreaWidth: state.global.savedAreaWidth,
  themeToggleModalShow: state.idea.themeToggleModalShow,
});

const mapDispatchToProps = {
  loadPageAction: loadPage,
  closeThemeToggleModalAction: closeThemeToggleModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(IdeaMapperPage);