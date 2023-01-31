import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { StandardButton } from '../../general/button';

const TITLES = {
  'add-idea': 'Add Theme Idea',
  'edit-idea': 'Edit Theme Idea',
  'rename-theme': 'Rename Theme'
};

const PLACEHOLDERS = {
  'add-idea': 'Enter your idea...',
  'edit-idea': 'Enter your idea...',
  'rename-theme': 'Enter the theme name...'
}

export const SMIdeaDialog = props => {
  const { show, mode, submitting, themes, currentFocusTheme, onRenameTheme, onEditIdea, onClose } = props;
  const [validated, setValidated] = useState(false);
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === false) return;

    const fd = new FormData(form);

    if (mode === 'rename-theme') {
      onRenameTheme({
        themeID: currentFocusTheme,
        name: fd.get('theme-idea'),
      });
    } else if (mode === 'edit-idea') {
      onEditIdea({
        themeID: currentFocusTheme,
        idea: fd.get('theme-idea'),
      });
    }
    clearForm();
  }

  const clearForm = () => {
    setValidated(false);
  }

  useEffect(() => {
    if (mode === 'rename-theme') {
      const currentTheme = themes.find(theme => theme.id === currentFocusTheme);
      if (currentTheme !== undefined) setText(currentTheme.name);
    }
  }, [currentFocusTheme, themes, mode]);
  

  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>{`${TITLES[mode]} - ${currentFocusTheme}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id='add-theme-idea' noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId='text-idea-text'>
            <Form.Control
              key={text}
              as='textarea'
              name='theme-idea'
              defaultValue={text}
              rows={3}
              placeholder={PLACEHOLDERS[mode]}
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
  mode: PropTypes.oneOf(['add-idea', 'edit-idea', 'rename-theme']).isRequired,
  submitting: PropTypes.bool.isRequired,
  themes: PropTypes.array.isRequired,
  currentFocusTheme: PropTypes.number.isRequired,
  onRenameTheme: PropTypes.func.isRequired,
  onEditIdea: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};