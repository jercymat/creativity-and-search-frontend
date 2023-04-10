import { Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import LogoContext from './LogoContext';
import styles from './Logo.module.scss';
import { useTracking } from 'react-tracking';
import { useLocation } from 'react-router-dom';
import { COMP_IM, COMP_LANDING, COMP_SERP } from '../../../tracker/type/component';
import { EVENT_IM_LEAVE } from '../../../tracker/type/event/idea-mapper';
import { EVENT_SEARCH_SERP_LEAVE } from '../../../tracker/type/event/search';

function LogoNavbar(props) {
  const { densed } = props;
  const location = useLocation();
  const { trackEvent } = useTracking({
    component: location.pathname === '/'
      ? COMP_LANDING
      : location.pathname === '/map'
      ? COMP_IM
      : location.pathname === '/search'
      ? COMP_SERP
      : ''
  });

  const handleClick = () => {
    if (location.pathname === '/map') trackEvent({ event: EVENT_IM_LEAVE, timestamp: Date.now() });
    else if (location.pathname === '/search') trackEvent({ event: EVENT_SEARCH_SERP_LEAVE, timestamp: Date.now() });
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