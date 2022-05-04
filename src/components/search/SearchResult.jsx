import PropTypes from 'prop-types';
import styles from './SearchResult.module.scss';

function SearchResult(props) {
  const { title, url, desc } = props.result;

  return (
    <div className={styles.wrap}>
      <div className={styles['head-wrap']}>
        <a href={url} target='_blank' rel="noreferrer">
          <h2 className={styles.title}>{title}</h2>
        </a>
        <h4 className={styles.url}>{url}</h4>
      </div>
      <p className={styles.desc}>{desc}</p>
    </div>
  )
}

SearchResult.propTypes = {
  result: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
}

export default SearchResult;