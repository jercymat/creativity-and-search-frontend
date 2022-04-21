import PropTypes from 'prop-types';
import styles from './SavedResult.module.scss';

function SavedResult(props) {
  return (
    <div
      className={styles.wrap}
      key={props.save.id}>
        <div className={styles.head}>
          <h2 className={styles.title}>{props.save.title}</h2>
          <h4 className={styles.url}>{props.save.url}</h4>
        </div>
      <p className={styles.desc}>{props.save.desc}</p>
    </div>
  )
}

SavedResult.propTypes = {
  save: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
};

export default SavedResult;