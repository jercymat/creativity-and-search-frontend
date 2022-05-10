import PropTypes from 'prop-types';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import StandardButton from '../general/button/StandardButton';
import styles from './LoginDialog.module.scss';
import { GlobalContext } from '../../store';

function LoginDialog(props) {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const globalCtx = useContext(GlobalContext);
  const { mode } = props;

  const formFeedBack = {
    id: {
      login: 'Please enter your account ID.',
      register: 'Please choose an account ID.'
    },
    pwd: {
      login: 'Please enter your password.',
      register: 'Please choose a valid password.'
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    // prevent default form submit effect
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);

    if (form.checkValidity() === false) return;

    if (mode === 'login') {
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
    } else {
      axios.post(config.api.HOST + '/users', {
        action: 'create_account',
        name: form.id.value,
        password: form.pwd.value
      })
        .then(response => response.data.ret)
        .then(ret => {
          if (ret === 0) {
            // create account succeed, login to that account
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
        });
    }
  };

  const handleSwitchMode = () => {
    if (mode === 'login') navigate('/register');
    else navigate('/login');
  };

  return (
    <div id="im-login-dialog" className={styles.wrap}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className={styles.fgroup} controlId='login-id'>
          <Form.Control type='text' name='id' placeholder='Account ID' required />
          <Form.Control.Feedback type='invalid'>{ formFeedBack.id[mode] }</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className={styles.fgroup} controlId='login-pwd'>
          <Form.Control type='password' name='pwd' placeholder='Password' required />
          <Form.Control.Feedback type='invalid'>{formFeedBack.pwd[mode]}</Form.Control.Feedback>
        </Form.Group>
        <StandardButton
          variant='primary'
          type='submit'
          className='w-100 mt-4 mb-3'
          btnText={mode === 'login' ? 'Login' : 'Create an Account'}/>
        <span className='d-block text-center font-footnote'>
          {mode === 'login' ? 'New to Idea Mapper?' : 'Already have an account?'}
          <Button
            className={styles.linkbtn}
            onClick={handleSwitchMode}
            variant='link'>{mode !== 'login' ? 'Login' : 'Create an Account'}</Button>
        </span>
      </Form>
    </div>
  )
}

LoginDialog.propTypes = {
  mode: PropTypes.string.isRequired
};

export default LoginDialog;