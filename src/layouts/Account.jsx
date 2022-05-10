import PropTypes from 'prop-types';
import { Fragment } from 'react';
import LoginDialog from '../components/account/LoginDialog';
import LogoNormal from '../components/general/logo/LogoNormal';
import variables from './Login.module.scss';
import styles from './Login.module.scss';

function AccountLayout(props) {
  const { mode } = props;
  const title = {
    login: 'Login to start your journey.',
    register: 'Register to access the wonderful search experience.'
  }

  return (
    <Fragment>
      <div
        className="d-flex flex-column align-items-center"
        style={{
          paddingTop: '7.5rem'
        }}>
          <LogoNormal />
        <h1
          className='font-weight-bold mt-3'
          style={{marginBottom: '5rem'}}>{title[mode]}</h1>
        <LoginDialog mode={mode} />
      </div>
      <svg
        style={{
          position: 'absolute',
          left: '0',
          top: '388px',
          zIndex: '-1'
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1438 134">
          <path
            d="M1438 1442H0V31.001S438.105 0 719 .001c280.896 0 719 31 719 31V1442z"
            fill={variables['color-secondary']} />
      </svg>
      <div className={styles.curveAfter} />
    </Fragment>
  )
}

AccountLayout.propTypes = {
  mode: PropTypes.string.isRequired
};

export default AccountLayout;