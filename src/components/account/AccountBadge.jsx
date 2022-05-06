import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from './AccountBadge.module.scss'
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../store';

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
  const globalCtx = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    globalCtx.updateLoggedIn(false);
    navigate('/');
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

export default AccountBadge;