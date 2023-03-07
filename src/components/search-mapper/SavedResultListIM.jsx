import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styles from './SavedResultList.module.scss';
import { connect } from 'react-redux';
import { loadSavedResultsV2 } from '../../actions/search';
import { SMResultIM, SMThemeIM } from './im-side';

function SavedResultListIM(props) {
  const { savedResultsV2, loadSavedResultsV2 } = props;
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;

    setFetched(true);
    loadSavedResultsV2();
  }, [fetched, loadSavedResultsV2]);

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
  loadSavedResultsV2: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  savedResultsV2: state.search.savedResultsV2,
});

const mapDispatchToProps = {
  loadSavedResultsV2,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListIM);