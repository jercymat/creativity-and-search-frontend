import { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import styles from './LoginDialog.module.scss';
import { GlobalContext } from '../../context';
import { StandardButton } from '../general/button';
import axios from 'axios';

function LoginDialog() {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const globalCtx = useContext(GlobalContext);

  const handleLoginError = () => {
    alert('Login Error');
    setValidated(false);
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    // prevent default form submit effect
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);

    if (form.checkValidity() === false) return;

    try {
      const response = await axios.post(config.api.HOST + '/users', {
        action: 'sign_in',
        name: form.id.value,
        password: form.pwd.value
      });

      if (response.data.ret === 0) {
        globalCtx.updateLoggedIn(true, form.id.value);
        navigate('/');
      }

    } catch (e) {
      handleLoginError();
    }
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
          btnText='Login'/>
      </Form>
    </div>
  )
}

export default LoginDialog;