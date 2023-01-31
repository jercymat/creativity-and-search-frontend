import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Spinner, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { StandardButton } from '../../general/button';
import styles from './SMThemeButton.module.scss';

const TITLES = {
  'add': 'Add to Theme',
  'move': 'Move to Theme',
};

const MOCK_THEMES = [
  {
    id: 1,
    name: 'Search Mapper Group 1',
    sr_count: 2
  },
  {
    id: 2,
    name: 'Search Mapper Group 2',
    sr_count: 4
  }
]

export const SMThemeDialog = props => {
  const { show, mode, submitting, onSubmission, onClose } = props;
  const [chosenGroupID, setChosenGroupID] = useState(null);

  const handleSubmit = () => {
    if (chosenGroupID !== null) {
      onSubmission({
        groupId: chosenGroupID,
      });
      clearForm();
    }
  };

  const handleCancel = () => {
    onClose();
    clearForm();
  }

  const clearForm = () => {
    setChosenGroupID(null);
  }

  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>{TITLES[mode]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles['btn-radios']}>
          {
            MOCK_THEMES.map(theme => (
              <Button
                key={theme.id}
                variant='outline-primary'
                className={theme.id === chosenGroupID && styles.active}
                onClick={() => setChosenGroupID(theme.id)}>
                <h2 className={styles.title}>{theme.name}</h2>
                <h4 className={styles.sr_count}>{theme.sr_count} Saved Results</h4>
              </Button>
            ))
          }
        </div>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: 'none' }}>
        <StandardButton variant='secondary' btnText='Cancel' onClick={handleCancel} />
        {/* TODO: change button style to support submission */}
        {/* <StandardButton variant='primary' btnText='Save' type='submit' form='add-theme-idea' /> */}
        <Button
          variant='primary'
          disabled={submitting || chosenGroupID === null}
          onClick={handleSubmit}>
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

SMThemeDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['add', 'move']).isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmission: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};