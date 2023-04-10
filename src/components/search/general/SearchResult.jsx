import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useTracking } from 'react-tracking';
import { CircleIconButton } from '../../general/button';
import styles from './SearchResult.module.scss';
import { EVENT_SEARCH_RESULT_CLICKED } from '../../../tracker/type/event/search';

function SearchResult(props) {
  const { title, url, desc } = props.result;
  const { onAddSave } = props;
  const { trackEvent } = useTracking();

  const titleRef = useRef(null);
  const urlRef = useRef(null);
  const descRef = useRef(null);

  const handleAddResult = () => {
    const result = {
      title: titleRef.current.innerText,
      url: urlRef.current.innerText,
      desc: descRef.current.innerText
    };

    onAddSave(result);
  };

  return (
    <div className={styles.wrap}>
      <CircleIconButton
        onClick={handleAddResult}
        className={styles.add}
        variant='primary'
        fsIcon={['fas', 'plus']} />
      <div className={styles.content}>
        <div className={styles.head_wrap}>
          <a 
            href={url} target='_blank' rel="noreferrer"
            onClick={() => trackEvent({ event: EVENT_SEARCH_RESULT_CLICKED, timestamp: Date.now() })}>
            <h2 className={styles.title} ref={titleRef}>{title}</h2>
          </a>
          <h4 className={styles.url} ref={urlRef}>{url}</h4>
        </div>
        <p className={styles.desc} ref={descRef}>{desc}</p>
      </div>
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
  }).isRequired,
  onAddSave: PropTypes.func.isRequired,
}

export default SearchResult;