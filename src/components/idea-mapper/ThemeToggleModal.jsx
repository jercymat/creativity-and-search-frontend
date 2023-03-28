import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal } from 'react-bootstrap';
import { IconButton, StandardButton } from '../general/button';
import styles from './ThemeToggleModal.module.scss';

const ThemeToggleModal = props => {
  const { show, onCloseModal, onRemoveTheme, onUpdateToggle } = props;

  const handleSubmit = event => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    // TODO: fill with actual function call
    onUpdateToggle();
  }

  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>SearchMapper Theme A</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id='theme-toggle' noValidate onSubmit={handleSubmit}>
          <Form.Group className={`mb-3 ${styles.form_check}`} controlId='theme-sr-1'>
            <Form.Check
              type='switch'
              name='theme-sr-1'
              label='Search Title A1' />
          </Form.Group>
          <Form.Group className={`mb-3 ${styles.form_check}`} controlId='theme-sr-2'>
            <Form.Check
              type='switch'
              name='theme-sr-2'
              label='Search Title A2' />
          </Form.Group>
          <Form.Group className={styles.form_check} controlId='theme-sr-3'>
            <Form.Check
              type='switch'
              name='theme-sr-3'
              label='Search Title A3' />
          </Form.Group>
          <hr />
          <Form.Group
            className={styles.form_multiline_check}
            controlId='theme-note'>
            <Form.Check type='checkbox'>
              <Form.Check.Input type='checkbox' />
              <Form.Check.Label>
                <div className={styles.label_title}>Theme Idea</div>
                <div className={styles.label_subtitle}>Some sort of SearchMapper notes</div>
              </Form.Check.Label>
            </Form.Check>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: 'none' }}>
        <IconButton
          variant='danger'
          className='me-auto'
          fsIcon={['fas', 'trash-can']}
          onClick={onRemoveTheme} />
        <StandardButton variant='secondary' btnText='Cancel' onClick={onCloseModal} />
        <StandardButton variant='primary' btnText='Save' type='submit' form='add-idea' />
      </Modal.Footer>
    </Modal>
  )
}

ThemeToggleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onRemoveTheme: PropTypes.func.isRequired,
  onUpdateToggle: PropTypes.func.isRequired,
}

export default ThemeToggleModal