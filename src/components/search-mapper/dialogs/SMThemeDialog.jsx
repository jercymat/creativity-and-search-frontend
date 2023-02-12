import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Spinner } from 'react-bootstrap';
import { StandardButton } from '../../general/button';
import styles from './SMThemeButton.module.scss';

const TITLES = {
  'add': 'Add to Theme',
  'move': 'Move to Theme',
};

export const SMThemeDialog = props => {
  const { show, mode, submitting, themes, currentFocusTheme, currentFocusResult, onSubmission, onClose } = props;
  const [chosenGroupID, setChosenGroupID] = useState(null);

  const handleSubmit = () => {
    if (chosenGroupID !== null) {
      onSubmission({
        fromThemeID: currentFocusTheme,
        themeID: chosenGroupID,
        resultID: currentFocusResult,
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

  useEffect(() => {
    if (mode === 'move') {
      setChosenGroupID(currentFocusTheme);
    }
  }, [mode, currentFocusTheme]);
  

  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>{TITLES[mode]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles['btn-radios']}>
          <Button
            variant='outline-primary'
            className={-1 === chosenGroupID && styles.active}
            onClick={() => setChosenGroupID(-1)}>
            <h2 className={styles.title}>New Theme</h2>
            <h4 className={styles.sr_count}>Create a new theme for this result</h4>
          </Button>
          <hr />
          {
            themes.slice(1).map(theme => (
              <Button
                key={theme.id}
                variant='outline-primary'
                className={theme.id === chosenGroupID && styles.active}
                onClick={() => setChosenGroupID(theme.id)}>
                <h2 className={styles.title}>{theme.name}</h2>
                <h4 className={styles.sr_count}>{theme.searchResultList.length} Saved Result{theme.searchResultList.length > 1 && 's'}</h4>
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
  themes: PropTypes.array.isRequired,
  currentFocusTheme: PropTypes.number.isRequired,
  currentFocusResult: PropTypes.number.isRequired,
  onSubmission: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};