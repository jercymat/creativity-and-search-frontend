import { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginDialog from '../components/account/LoginDialog';
import { LogoNormal } from '../components/general/logo';
import PropTypes from 'prop-types';
import variables from './Login.module.scss';
import styles from './Login.module.scss';
import { AlertToast } from '../components/general/popup';
import { closeToast } from '../actions/global';

function AccountLayout(props) {
  const { isLoggedin, errorToastShow, error, closeToast } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedin) navigate('/');
  }, [isLoggedin, navigate]);
  

  return (
    <>
      <div
        className="d-flex flex-column align-items-center"
        style={{
          paddingTop: '7.5rem'
        }}>
          <LogoNormal />
        <h1
          className='font-weight-bold mt-3'
          style={{ marginBottom: '5rem' }}>Login to start your journey.</h1>
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
      <AlertToast
        show={errorToastShow}
        variant='danger'
        timeout={2000}
        content={error}
        onClose={closeToast} />
    </>
  )
}

AccountLayout.propTypes = {
  isLoggedin: PropTypes.bool.isRequired,
  errorToastShow: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  closeToast: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedin: state.global.isLoggedin,
  errorToastShow: state.global.errorToastShow,
  error: state.global.error,
});

const mapDispatchToProps = {
  closeToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountLayout);