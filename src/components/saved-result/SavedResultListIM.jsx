import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { SavedResultIM } from './cell';
import styles from './SavedResultList.module.scss';
import { connect } from 'react-redux';
import { loadSavedResults } from '../../actions/search';

function SavedResultListIM(props) {
  const { savedResults, loadSavedResults } = props;
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;
    if (savedResults.length !== 0) return;

    setFetched(true);
    loadSavedResults();
  }, [fetched, loadSavedResults, savedResults]);

  return (
    <div id='im-saved-results' className={styles.wrap}>
      {savedResults.map(save => (
        <SavedResultIM key={ save.id } save={save} />
      ))}
    </div>
  )
}

SavedResultListIM.propTypes = {
  savedResults: PropTypes.array.isRequired,
  loadSavedResults: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  savedResults: state.search.savedResults,
});

const mapDispatchToProps = {
  loadSavedResults,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListIM);