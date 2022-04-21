import { Fragment } from 'react';
import LoginDialog from '../components/account/LoginDialog';
import LogoNormal from '../components/general/logo/LogoNormal';
import variables from './Login.module.scss';
import styles from './Login.module.scss';

function LoginLayout(props) {

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
          style={{marginBottom: '5rem'}}>Login to start your journey.</h1>
        <LoginDialog />
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

export default LoginLayout;