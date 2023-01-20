import { useState } from 'react';
import { Form } from 'react-bootstrap';
import styles from './LoginDialog.module.scss';
import { StandardButton } from '../general/button';
import { connect } from 'react-redux';
import { login } from '../../actions/global';
import PropTypes from 'prop-types';

function LoginDialog(props) {
  const { loading, login } = props;
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    // prevent default form submit effect
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);

    if (form.checkValidity() === false) return;

    login({
      name: form.id.value,
      password: form.pwd.value
    });
  };

  return (
    <div id="im-login-dialog" className={styles.wrap}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className={styles.fgroup} controlId='login-id'>
          <Form.Control type='text' name='id' placeholder='Account ID' required />
          <Form.Control.Feedback type='invalid'>Please enter your account ID.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className={styles.fgroup} controlId='login-pwd'>
          <Form.Control type='password' name='pwd' placeholder='Password' required />
          <Form.Control.Feedback type='invalid'>Please enter your password.</Form.Control.Feedback>
        </Form.Group>
        <StandardButton
          variant='primary'
          type='submit'
          className='w-100 mt-4'
          btnText='Login'
          loading={loading}
          disabled={loading}/>
      </Form>
    </div>
  )
}

LoginDialog.propTypes = {
  loading: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  loading: state.global.loading,
});

const mapDispatchToProps = {
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog)