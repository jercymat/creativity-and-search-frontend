import PropTypes from 'prop-types';
import styles from './SavedResultList.module.scss';
import { connect } from 'react-redux';
import { SMResultIM, SMThemeIM } from './im-side';

function SavedResultListIM(props) {
  const { savedResultsV2 } = props;

  return (
    <div id='im-saved-results' className={styles.wrap}>
      {savedResultsV2.length > 1 && savedResultsV2.slice(1).map(theme =>
        <SMThemeIM
          key={theme.id}
          theme={theme} />)}
      {savedResultsV2[0].searchResultList.map(save =>
        <SMResultIM
          key={save.id}
          save={save} />)}
    </div>
  )
}

SavedResultListIM.propTypes = {
  savedResultsV2: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  savedResultsV2: state.search.savedResultsV2,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListIM);