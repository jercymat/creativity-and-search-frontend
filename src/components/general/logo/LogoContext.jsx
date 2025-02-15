import config from '../../../config';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

function LogoContext(props) {
  const { densed } = props;

  return (
    <Fragment>
      { !densed ? (
        <img
          src='https://via.placeholder.com/60/023246/023246.jpg'
          width='42'
          height='42'
          className='d-inline-block me-2'
          style={{ borderRadius: '50%' }}
          alt='Idea Map logo' />
      ) : null}
      <span
        className={`font-logo-${densed ? 'densed' : 'main'}`}
        style={densed ? { lineHeight: '1.2' } : null} >
        {config.PRODUCT_NAME}
      </span>
    </Fragment>
  );
}

LogoContext.defaultProp = {
  densed: false
}

LogoContext.propTypes = {
  densed: PropTypes.bool
};

export default LogoContext;