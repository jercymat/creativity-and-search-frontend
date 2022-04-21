import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import styles from './SearchField.module.scss';
import { Link } from 'react-router-dom';

function SearchField(props) {
  const { id, placeholder, className, style } = props;

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
          className={styles['search-input']}></input>
        <div className={styles['search-button']}>
          <Link to='/search'>
            <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
          </Link>
        </div>
      </div>
    </div>
  )
}

SearchField.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
}

export default SearchField