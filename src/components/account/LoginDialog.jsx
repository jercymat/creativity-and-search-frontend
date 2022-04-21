// import PropTypes from 'prop-types';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StandardButton from '../general/button/StandardButton';
import styles from './LoginDialog.module.scss';

function LoginDialog(props) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  }

  return (
    <div id="im-login-dialog" className={styles.wrap}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className={styles.fgroup} controlId='login-id'>
          <Form.Control type='text' placeholder='Account ID' required />
          <Form.Control.Feedback type='invalid'>Please enter your account ID.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className={styles.fgroup} controlId='login-pwd'>
          <Form.Control type='password' placeholder='Password' required />
          <Form.Control.Feedback type='invalid'>Please enter your password.</Form.Control.Feedback>
        </Form.Group>
        <Link to='/' className='d-inline-block font-footlink mb-4'>Forgot password?</Link>
        <StandardButton type='submit' className='w-100 mb-3' btnText='Login'/>
        <span className='d-block text-center font-footnote'>
          New to Idea Mapper?{' '}
          <Link to='/' className='d-inline-block font-footlink'>
            Create an account
          </Link>
        </span>
      </Form>
    </div>
  )
}

LoginDialog.propTypes = {

};

export default LoginDialog;