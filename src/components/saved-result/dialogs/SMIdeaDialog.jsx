import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { StandardButton } from '../../general/button';

export const SMIdeaDialog = props => {
  const { show, submitting, onSubmission, onClose } = props;
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === false) return;

    const fd = new FormData(form);
    onSubmission({
      themeId: 0,
      idea: fd.get('theme-idea'),
    });
    clearForm();
  }

  const clearForm = () => {
    setValidated(false);
  }

  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>Add Theme Idea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id='add-theme-idea' noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId='text-idea-text'>
            <Form.Control
              as='textarea'
              name='theme-idea'
              rows={3}
              placeholder='Enter your idea...'
              required />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: 'none' }}>
        <StandardButton variant='secondary' btnText='Cancel' onClick={onClose} />
        {/* TODO: change button style to support submission */}
        {/* <StandardButton variant='primary' btnText='Save' type='submit' form='add-theme-idea' /> */}
        <Button variant='primary' type='submit' form='add-theme-idea' disabled={submitting}>
          {
            submitting
              ? <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              : 'Save'
          }
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

SMIdeaDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmission: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};