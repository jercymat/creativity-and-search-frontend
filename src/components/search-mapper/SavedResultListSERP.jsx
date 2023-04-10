import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './SavedResultList.module.scss';
import { SMPlaceHolder, SMResultSERP, SMThemeSERP } from './serp-side';
import {
  closeTextDialog,
  closeMessageDialog,
  deleteSavedResults,
  loadSavedResults,
  openRenameThemeDialog,
  openEditIdeaDialog,
  openAddThemeDialog,
  openMoveThemeDialog,
  closeThemeDialog,
  loadSavedResultsV2,
  renameTheme,
  editThemeIdea,
  changeTheme,
  createTheme,
  deleteTheme,
} from '../../actions/search';
import { SMTextDialog, SMThemeDialog } from './dialogs';
import { MessageDialog } from '../general/popup';

const MESSAGE = {
  MOVE_LAST_RESULT: 'This is the last saved result in this theme, moving this result from the theme will also delete this theme and its notes.'
}

function SavedResultListSERP(props) {
  const {
    submitting,
    messageDialogShow, textDialogShow, themeDialogShow,
    savedResultsV2, messageContent, textDialogMode, themeDialogMode,
    currentFocusTheme, currentFocusResult,
    loadSavedResults, deleteSavedResults,
    loadSavedResultsV2, createTheme, renameTheme, editThemeIdea, changeTheme, deleteTheme, 
    closeMessageDialog,
    openEditIdeaDialog, openRenameThemeDialog, closeTextDialog,
    openAddThemeDialog, openMoveThemeDialog, closeThemeDialog,
  } = props;
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;
    
    setFetched(true);
    loadSavedResults();
    loadSavedResultsV2();
  }, [fetched, loadSavedResults, loadSavedResultsV2]);

  const onDeleteSaved = (resultID, deleteThemeID) => {
    console.log(`delete result ${resultID}`);
    deleteSavedResults(resultID);

    if (deleteThemeID !== -1) {
      console.log(`delete theme ${deleteThemeID}`);
      deleteTheme(deleteThemeID);
    }
  };

  const onCreateTheme = ({ name, resultID }) => {
    console.log(`new theme: ${name} - result ${resultID}`);
    createTheme(name, resultID)
    closeTextDialog();
  };

  const onRenameTheme = ({ themeID, name }) => {
    console.log(`Rename Theme ${themeID} - ${name}`);
    renameTheme(themeID, name);
    closeTextDialog();
  };

  const onAddThemeIdea = ({ themeID, noteID, content }) => {
    console.log(`Add Theme Idea: theme - ${themeID}, note - ${noteID}, idea: ${content}`);
    editThemeIdea(themeID, noteID, content);
    closeTextDialog();
  };

  const onAddToTheme = ({ fromThemeID, themeID, resultID }) => {
    const isThemed = ![0, -1].includes(savedResultsV2.map(theme => theme.id).indexOf(fromThemeID));
    const isLastResult = isThemed && savedResultsV2.find(el => el.id === fromThemeID).searchResultList.length === 1
    const isConfirmed = isLastResult
      ? window.confirm(MESSAGE.MOVE_LAST_RESULT)
      : true;

    if (isConfirmed) {
      console.log(`${themeDialogMode} result ${resultID} from theme ${fromThemeID} to theme ${themeID}`);
      changeTheme(themeID, resultID);

      if (isLastResult) {
        console.log(`delete theme ${fromThemeID}`);
        deleteTheme(fromThemeID);
      }
    }
    closeThemeDialog();
  };

  const onRemoveFromTheme = resultID => {
    console.log(`Ungroup result ${resultID}`);
    changeTheme(savedResultsV2[0].id, resultID);
  };

  return (
    <div id="im-saved-results" className={styles.wrap}>
      {savedResultsV2.length === 1 && savedResultsV2[0].searchResultList.length === 0 && <SMPlaceHolder />}
      {savedResultsV2.length > 1 && savedResultsV2.slice(1).map(theme =>
        <SMThemeSERP
          key={theme.id}
          theme={theme}
          onRenameTheme={() => openRenameThemeDialog(theme.id)}
          onEditIdea={() => openEditIdeaDialog(theme.id)}
          onDeleteSaved={onDeleteSaved}
          onMoveToTheme={({ resultID, fromThemeID }) => openMoveThemeDialog(fromThemeID, resultID)}
          onRemoveFromTheme={onRemoveFromTheme} />)}
      {savedResultsV2[0].searchResultList.map(save =>
        <SMResultSERP
          key={save.id}
          save={save}
          onDeleteSave={onDeleteSaved}
          onAddToGroup={resultID => openAddThemeDialog(savedResultsV2[0].id, resultID)} />)}
      <MessageDialog
        show={messageDialogShow}
        onClose={closeMessageDialog}
        onConfirm={() => {}}
        {...messageContent} />
      <SMTextDialog
        show={textDialogShow}
        mode={textDialogMode}
        submitting={submitting}
        themes={savedResultsV2}
        currentFocusTheme={currentFocusTheme}
        currentFocusResult={currentFocusResult}
        onEditIdea={onAddThemeIdea}
        onCreateTheme={onCreateTheme}
        onRenameTheme={onRenameTheme}
        onClose={closeTextDialog} />
      <SMThemeDialog
        show={themeDialogShow}
        mode={themeDialogMode}
        submitting={submitting}
        themes={savedResultsV2}
        currentFocusTheme={currentFocusTheme}
        currentFocusResult={currentFocusResult}
        onSubmission={onAddToTheme}
        onClose={closeThemeDialog} />
    </div>
  )
}

SavedResultListSERP.propTypes = {
  // loading: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  messageDialogShow: PropTypes.bool.isRequired,
  textDialogShow: PropTypes.bool.isRequired,
  themeDialogShow: PropTypes.bool.isRequired,
  savedResultsV2: PropTypes.array.isRequired,
  messageContent: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,
    confirmText: PropTypes.string.isRequired,
  }).isRequired,
  textDialogMode: PropTypes.oneOf(['add-idea', 'edit-idea', 'rename-theme', 'create-theme']).isRequired,
  themeDialogMode: PropTypes.oneOf(['add', 'move']).isRequired,
  currentFocusTheme: PropTypes.number.isRequired,
  currentFocusResult: PropTypes.number.isRequired,
  
  // functions
  loadSavedResults: PropTypes.func.isRequired,
  deleteSavedResults: PropTypes.func.isRequired,
  loadSavedResultsV2: PropTypes.func.isRequired,
  createTheme: PropTypes.func.isRequired,
  renameTheme: PropTypes.func.isRequired,
  editThemeIdea: PropTypes.func.isRequired,
  changeTheme: PropTypes.func.isRequired,
  deleteTheme: PropTypes.func.isRequired,
  // openFormThemeMsgDialog: PropTypes.func.isRequired,
  closeMessageDialog: PropTypes.func.isRequired,
  // openAddIdeaDialog: PropTypes.func.isRequired,
  openEditIdeaDialog: PropTypes.func.isRequired,
  openRenameThemeDialog: PropTypes.func.isRequired,
  closeTextDialog: PropTypes.func.isRequired,
  openAddThemeDialog: PropTypes.func.isRequired,
  openMoveThemeDialog: PropTypes.func.isRequired,
  closeThemeDialog: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  submitting: state.search.submitting,
  messageDialogShow: state.search.messageDialogShow,
  textDialogShow: state.search.textDialogShow,
  textDialogMode: state.search.textDialogMode,
  themeDialogShow: state.search.themeDialogShow,
  themeDialogMode: state.search.themeDialogMode,
  savedResults: state.search.savedResults,
  savedResultsV2: state.search.savedResultsV2,
  messageContent: state.search.messageContent,
  currentFocusTheme: state.search.currentFocusTheme,
  currentFocusResult: state.search.currentFocusResult,
});

const mapDispatchToProps = {
  loadSavedResults,
  deleteSavedResults,
  loadSavedResultsV2,
  renameTheme,
  editThemeIdea,
  createTheme,
  changeTheme,
  deleteTheme,
  closeMessageDialog,
  openEditIdeaDialog,
  openRenameThemeDialog,
  closeTextDialog,
  openAddThemeDialog,
  openMoveThemeDialog,
  closeThemeDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListSERP);