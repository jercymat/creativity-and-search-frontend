import { Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import LogoContext from './LogoContext';
import styles from './Logo.module.scss';

function LogoNavbar(props) {
  const { densed } = props;

  return (
    <LinkContainer to='/'>
      <Navbar.Brand className={`visible d-flex align-items-center py-0 ${styles.link}`}>
        <LogoContext densed={densed} />
      </Navbar.Brand>
    </LinkContainer>
  );
}

LogoNavbar.defaultProps = {
  densed: false
};

LogoNavbar.propTypes = {
  densed: PropTypes.bool
};

export default LogoNavbar;