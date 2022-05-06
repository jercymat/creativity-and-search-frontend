// import PropTypes from 'prop-types';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import StandardButton from '../general/button/StandardButton';
import styles from './LoginDialog.module.scss';
import { GlobalContext } from '../../store';

function LoginDialog(props) {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const globalCtx = useContext(GlobalContext);

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    // prevent default form submit effect
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);

    axios.post(config.api.HOST + '/users', {
      action: 'sign_in',
      name: form.id.value,
      password: form.pwd.value
    })
      .then(response => response.data.ret)
      .then(ret => {
        if (ret === 0) {
          globalCtx.updateLoggedIn(true, form.id.value);
          navigate('/');
        }
      });
  }

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
        <Link to='/' className='d-inline-block font-footlink mb-4'>Forgot password?</Link>
        <StandardButton variant='primary' type='submit' className='w-100 mb-3' btnText='Login'/>
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