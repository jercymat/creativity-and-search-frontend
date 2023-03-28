import PropTypes from 'prop-types';
import config from '../config';
import styles from './IdeaMap.module.scss';
import IdeaMapCanvas from '../components/idea-mapper/IdeaMapCanvas';
import { useNavigate } from 'react-router-dom';
import { LeftIconButton } from '../components/general/button';
import { SavedResultListIM } from '../components/search-mapper';
import { useTracking } from 'react-tracking';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { openThemeToggleModal } from '../actions/idea';

function IdeaMapPage(props) {
  const { savedAreaWidth, openThemeToggleModal } = props;
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
          style={{width: `calc(${savedAreaWidth}px)`}}>
          <div className="mb-3">
            <LeftIconButton
              variant='primary'
              btnText={config.IDEA_SAVER_NAME}
              fsIcon={['fas', 'chevron-left']}
              onClick={handleBack} />
          </div>
          <Button
            className='mb-3 w-100'
            variant='secondary'
            onClick={openThemeToggleModal}>Theme Toggle Modal</Button>
          <SavedResultListIM />
        </div>
        <div
          className={styles.canvas}
          style={{ width: `calc(100vw - 1.5rem - ${savedAreaWidth}px)` }}>
            <IdeaMapCanvas />
        </div>
      </div>
    </Track>
  )
}

IdeaMapPage.propTypes = {
  savedAreaWidth: PropTypes.number.isRequired,
  openThemeToggleModal: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  savedAreaWidth: state.global.savedAreaWidth,
});

const mapDispatchToProps = {
  openThemeToggleModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(IdeaMapPage);