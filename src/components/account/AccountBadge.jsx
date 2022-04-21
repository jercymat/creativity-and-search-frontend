import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './AccountBadge.module.scss'

class AccountBadge extends Component {
  render() {
    const { userName, userImage } = this.props;

    return (
      <div className={styles['account-badge-wrap']}>
        <div className={styles['account-badge']}>
          <div className={styles['account-name']}>
            {userName}
          </div>
          <div>
            <img src={ userImage } alt="user-thumbnail" width="48" height="48" />
          </div>
        </div>
      </div>
    );
  }
}

AccountBadge.propTypes = {
  userName: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired
}

export default AccountBadge;