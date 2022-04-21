import PropTypes from 'prop-types';
import SavedResult from './SavedResult';
import styles from './SavedResultList.module.scss';

function SavedResultList(props) {
  return (
    <div id='im-saved-results' className={styles.wrap}>
      {props.saves.map(save => (
        <SavedResult key={ save.id } save={save} />
      ))}
    </div>
  )
}

SavedResultList.propTypes = {
  saves: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  })).isRequired
};

export default SavedResultList;