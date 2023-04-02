import PropTypes from 'prop-types';
import styles from './SavedResultList.module.scss';
import { connect } from 'react-redux';
import { SMResultIM, SMThemeIM } from './im-side';

function SavedResultListIM(props) {
  const { savedResults, themeToggles } = props;

  return (
    <div id='im-saved-results' className={styles.wrap}>
      {savedResults.length > 1 && savedResults.slice(1).map(theme =>
        <SMThemeIM
          key={theme.id}
          theme={theme}
          toggled={
            themeToggles.find(t => t.id === theme.id)
              ? themeToggles.find(t => t.id === theme.id).shown
              : false
          } />)}
      {savedResults[0].searchResultList.map(save =>
        <SMResultIM
          key={save.id}
          save={save} />)}
    </div>
  )
}

SavedResultListIM.propTypes = {
  savedResults: PropTypes.array.isRequired,
  themeToggles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    shown: PropTypes.bool.isRequired,
    noteShown: PropTypes.bool.isRequired,
    sr: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      shown: PropTypes.bool.isRequired,
    })).isRequired
  })).isRequired,
}

const mapStateToProps = (state) => ({
  savedResults: state.search.savedResultsV2,
  themeToggles: state.idea.themeToggle,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListIM);