import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import { StandardButton } from '../button';

export const MessageDialog = props => {
  const {
    show, title, content,
    cancelText, confirmText,
    onConfirm, onClose,
  } = props;

  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer style={{ borderTop: 'none' }}>
        <StandardButton
          variant='secondary'
          btnText={cancelText === null ? 'Cancel' : cancelText}
          onClick={onClose} />
        <StandardButton
          variant='primary'
          btnText={confirmText === null ? 'OK' : confirmText}
          onClick={onConfirm} />
      </Modal.Footer>
    </Modal>
  )
}

MessageDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};