import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { StandardButton } from '../../general/button';

const TITLES = {
  'add-idea': 'Add Theme Idea',
  'edit-idea': 'Edit Theme Idea',
  'create-theme': 'Create a New Theme',
  'rename-theme': 'Rename Theme',
};

const PLACEHOLDERS = {
  'add-idea': 'Enter your idea...',
  'edit-idea': 'Enter your idea...',
  'create-theme': 'Enter the theme name...',
  'rename-theme': 'Enter the theme name...',
}

export const SMTextDialog = props => {
  const {
    show, mode, submitting, themes, currentFocusTheme, currentFocusResult,
    onCreateTheme, onRenameTheme, onEditIdea, onClose
  } = props;
  const [validated, setValidated] = useState(false);
  const [text, setText] = useState('');
  const [noteID, setNoteID] = useState(-1);

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
    } else if (mode === 'create-theme') {
      onCreateTheme({
        name: fd.get('theme-idea'),
        resultID: currentFocusResult,
      });
    } else if (mode === 'edit-idea') {
      onEditIdea({
        themeID: currentFocusTheme,
        noteID,
        content: fd.get('theme-idea'),
      });
    }
    clearForm();
  }

  const clearForm = () => {
    setValidated(false);
  }

  useEffect(() => {
    const currentTheme = themes.find(theme => theme.id === currentFocusTheme);
    if (currentTheme === undefined) return;

    if (mode === 'rename-theme') {
      setText(currentTheme.name);
    } else if (mode === 'edit-idea') {
      setText(currentTheme.note);
      setNoteID(currentTheme.noteID);
    } else if (mode === 'create-theme') {
      setText('');
    }
  }, [currentFocusTheme, themes, mode]);
  

  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>{TITLES[mode]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id='add-theme-idea' noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId='text-idea-text'>
            <Form.Control
              key={text}
              as={['rename-theme', 'create-theme'].includes(mode) ? 'input' : 'textarea'}
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

SMTextDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['add-idea', 'edit-idea', 'rename-theme', 'create-theme']).isRequired,
  submitting: PropTypes.bool.isRequired,
  themes: PropTypes.array.isRequired,
  currentFocusTheme: PropTypes.number.isRequired,
  currentFocusResult: PropTypes.number.isRequired,
  onCreateTheme: PropTypes.func.isRequired,
  onRenameTheme: PropTypes.func.isRequired,
  onEditIdea: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};