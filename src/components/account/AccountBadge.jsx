import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from './AccountBadge.module.scss'
import { checkoutEvents } from '../../utils/tracker';
import { connect } from 'react-redux';
import { logout } from '../../actions/global';
import { useTracking } from 'react-tracking';
import { COMP_IM, COMP_SERP } from '../../tracker/type/component';
import { useLocation } from 'react-router-dom';
import { EVENT_IM_LEAVE } from '../../tracker/type/event/idea-mapper';
import { EVENT_SEARCH_SERP_LEAVE } from '../../tracker/type/event/search';
import { EVENT_LOGOUT } from '../../tracker/type/event/general';

const AccountBadgeToggle = React.forwardRef(({ onClick, userName, userImage }, ref) => (
  <div
    className={styles.wrap}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}>
    <div className={styles.name}>
      {userName}
    </div>
    <div>
      <img src={userImage} alt="user-thumbnail" width="48" height="48" />
    </div>
  </div>
));

function AccountBadge(props) {
  const { logout, statOfQueryID } = props;
  const location = useLocation();
  const { trackEvent } = useTracking({
    component: location.pathname === '/map'
        ? COMP_IM
        : location.pathname === '/search'
          ? COMP_SERP
          : ''
  });

  const handleLogout = () => {
    trackEvent({
      event: location.pathname === '/map'
        ? EVENT_IM_LEAVE
        : location.pathname === '/search'
          ? EVENT_SEARCH_SERP_LEAVE
          : '',
      timestamp: Date.now() });
    trackEvent({ event: EVENT_LOGOUT, timestamp: Date.now() });
    console.log(window.loggedEvents);
    checkoutEvents(statOfQueryID)
      .then(values => values.map(v => v.status))
      .then(statuses => {
        console.log('logging data requests', statuses.toString());
        // logoutReq();
        logout();
      })
      .catch(error => {
        console.log(error);
        // logoutReq();
        logout();
      });
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        as={AccountBadgeToggle}
        {...props}>1</Dropdown.Toggle>

      <Dropdown.Menu align='end'>
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

AccountBadge.propTypes = {
  userName: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  statOfQueryID: state.search.statOfQueryID,
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountBadge);