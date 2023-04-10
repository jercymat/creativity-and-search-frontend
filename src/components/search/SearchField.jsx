import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import styles from './SearchField.module.scss';
import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTracking } from 'react-tracking';
import { COMP_LANDING, COMP_SERP } from '../../tracker/type/component';
import { EVENT_NEW_SEARCH } from '../../tracker/type/event/search';

function SearchField(props) {
  const { id, placeholder, className, style, defaultQuery } = props;
  const [ query, setQuery ] = useState(defaultQuery !== undefined ? defaultQuery : '');
  const location = useLocation();
  const { trackEvent } = useTracking({
    component: location.pathname === '/'
      ? COMP_LANDING
      : location.pathname === '/search'
        ? COMP_SERP
        : ''
  });
  const searchRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (query !== '') searchRef.current.click();
    }
  }

  return (
    <div
      id={ id }
      className={ className }
      style={ style }>
      <div
        className={ styles['search-form'] }>
        <input
          type='text'
          placeholder={placeholder === undefined ? 'Default Placeholder' : placeholder}
          value={query}
          className={styles['search-input']}
          onChange={(evt) => setQuery(evt.target.value)}
          onKeyDown={handleKeyDown}></input>
        <div className={styles['search-button']}>
          <Link
            className={query === '' ? styles.disabled : null}
            onClick={() => trackEvent({ event: EVENT_NEW_SEARCH, timestamp: Date.now() })}
            to={query !== '' ? `/search?q=${query.replace(' ', '+')}` : '#'}
            ref={searchRef}>
            <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
          </Link>
        </div>
      </div>
    </div>
  );
}

SearchField.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  defaultQuery: PropTypes.string
}

export default SearchField;