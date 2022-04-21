import PropTypes from 'prop-types';
import LogoContext from './LogoContext';
import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';

function LogoNormal(props) {
  const { densed } = props;

  return (
    <Link to='/' className={`d-flex align-items-center ${styles.link}`}>
      <LogoContext densed={densed} />
    </Link>
  );
}

LogoNormal.defaultProps = {
  densed: false
};

LogoNormal.propTypes = {
  densed: PropTypes.bool
};

export default LogoNormal;