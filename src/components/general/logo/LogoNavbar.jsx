import { Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import LogoContext from './LogoContext';
import styles from './Logo.module.scss';
import { useTracking } from 'react-tracking';
import { useLocation } from 'react-router-dom';

function LogoNavbar(props) {
  const { densed } = props;
  const location = useLocation();
  const { trackEvent } = useTracking({
    page: location.pathname === '/'
      ? 'home'
      : location.pathname === '/map'
      ? 'ideaMapper'
      : location.pathname === '/search'
      ? 'SERP'
      : ''
  });

  const handleClick = () => {
    if (location.pathname === '/map') trackEvent({ event: 'leaveIdeaMap', timestamp: Date.now() });
    else if (location.pathname === '/search') trackEvent({ event: 'leaveSERP', timestamp: Date.now() });
  }

  return (
    <LinkContainer to='/'>
      <Navbar.Brand
        className={`visible d-flex align-items-center py-0 ${styles.link}`}
        onClick={handleClick}>
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