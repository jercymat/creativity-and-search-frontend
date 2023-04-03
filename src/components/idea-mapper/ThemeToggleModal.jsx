import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal } from 'react-bootstrap';
import { IconButton, StandardButton } from '../general/button';
import styles from './ThemeToggleModal.module.scss';
import { connect } from 'react-redux';
import { updateToggle } from '../../actions/idea';

const ThemeToggleModal = props => {
  const {
    show, focusedThemeID, themeToggles, savedResults,
    onCloseModal, updateToggleAction,
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    event.stopPropagation();

    const newToggle = {
      ...themeToggle,
      sr: themeToggle.sr.map(result => ({
        ...result,
        shown: event.currentTarget[`theme-sr-${result.id}`].checked,
      })),
      noteShown: event.currentTarget['theme-note'].checked,
    }

    updateToggleAction(newToggle.id, newToggle);
    onCloseModal();
  }

  const handleRemoveTheme = () => {
    const newToggle = {
      ...themeToggle,
      shown: false,
      noteShown: false,
      sr: themeToggle.sr.map(result => ({ ...result, shown: false }))
    }
    
    updateToggleAction(newToggle.id, newToggle);
    onCloseModal();
  }

  const themeToggle = useMemo(() => themeToggles.find(theme => theme.id === focusedThemeID)
    ? themeToggles.find(theme => theme.id === focusedThemeID)
    : {
      id: -1,
      name: "",
      note: "",
      shown: false,
      noteShown: false,
      sr: [{ id: -1, shown: false }],
    }, [focusedThemeID, themeToggles]);

  const theme = useMemo(() => savedResults.find(theme => theme.id === focusedThemeID)
    ? savedResults.find(theme => theme.id === focusedThemeID)
    : {
      id: -1,
      name: "",
      userid_id: -1,
      searchResultList: [{ id: -1, title: "", url: "", desc: "" }],
      note: "",
      noteID: -1,
    }, [focusedThemeID, savedResults]);

  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>{theme.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <p>Now you have add this theme to the canvas,<br />toggle some Saved Results and Notes to show them in the canvas.</p>
        <hr /> */}
        <Form id='theme-toggle' noValidate onSubmit={handleSubmit}>
          { theme.searchResultList.map((result, idx) =>
            <Form.Group key={result.id} className={`mb-3 ${styles.form_check}`} controlId={`theme-sr-${result.id}`}>
              <Form.Switch
                name={`theme-sr-${result.id}`}
                defaultChecked={themeToggle.sr[idx].shown}
                label={result.title} />
            </Form.Group>) }
          <hr />
          <Form.Group
            className={styles.form_multiline_check}
            controlId='theme-note'>
            <Form.Switch>
              <Form.Switch.Input name='theme-note' defaultChecked={themeToggle.noteShown} />
              <Form.Switch.Label>
                <div className={styles.label_title}>Theme Idea</div>
                <div className={styles.label_subtitle}>{theme.note}</div>
              </Form.Switch.Label>
            </Form.Switch>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: 'none' }}>
        <IconButton
          variant='danger'
          className='me-auto'
          fsIcon={['fas', 'trash-can']}
          onClick={handleRemoveTheme} />
        <StandardButton variant='secondary' btnText='Cancel' onClick={onCloseModal} />
        <StandardButton variant='primary' btnText='Save' type='submit' form='theme-toggle' />
      </Modal.Footer>
    </Modal>
  )
}

ThemeToggleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  focusedThemeID: PropTypes.number.isRequired,
  themeToggles: PropTypes.array.isRequired,
  savedResults: PropTypes.array.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  updateToggleAction: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  focusedThemeID: state.idea.focusedThemeID,
  themeToggles: state.idea.themeToggle,
  savedResults: state.search.savedResultsV2,
});

const mapDispatchToProps = {
  updateToggleAction: updateToggle,
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeToggleModal);