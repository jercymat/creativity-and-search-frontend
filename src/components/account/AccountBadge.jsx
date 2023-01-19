import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from './AccountBadge.module.scss'
import { checkoutEvents } from '../../utils/tracker';
import { connect } from 'react-redux';
import { logout } from '../../actions/global';

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
  const { logout, statOfQueryId } = props;

  const handleLogout = () => {
    // const logoutReq = () => 
    //   axios.post(config.api.HOST + '/users', {
    //     action: 'sign_out'
    //   }, { withCredentials: true })
    //     .then(response => response.data.ret)
    //     .then(ret => {
    //       if (ret === 0) {
    //         globalCtx.updateLoggedIn(false);
    //         navigate('/');
    //       }
    //     });

    checkoutEvents(statOfQueryId)
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
  statOfQueryId: state.global.statOfQueryId,
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountBadge);