import config from '../../../config';
import { PropTypes } from 'prop-types';

function LogoLarge(props) {
    const { id, className, style } = props;

  return (
    <div
      id={ id }
      className={`text-center${className === undefined ? '' : ' ' + className}`}
      style={ style }>
      <img
        src='https://via.placeholder.com/120/023246/023246.jpg'
        width='120'
        height='120'
        className='mb-2 mx-auto'
        style={{ borderRadius: '50%' }}
        alt='Idea Map logo' />
      <span className="font-logo-main d-block">{config.PRODUCT_NAME}</span>
    </div>
  );
}

LogoLarge.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
}

export default LogoLarge;