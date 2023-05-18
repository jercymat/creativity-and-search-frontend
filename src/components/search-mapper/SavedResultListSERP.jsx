import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './SavedResultList.module.scss';
import { SMPlaceHolder, SMResultSERP, SMThemeSERP } from './serp-side';
import {
  closeTextDialog,
  closeMessageDialog,
  deleteSavedResults,
  openRenameThemeDialog,
  openEditIdeaDialog,
  openAddThemeDialog,
  openMoveThemeDialog,
  closeThemeDialog,
  loadSavedResults,
  renameTheme,
  editThemeIdea,
  changeTheme,
  createTheme,
  deleteTheme,
} from '../../actions/search';
import { SMTextDialog, SMThemeDialog } from './dialogs';
import { MessageDialog } from '../general/popup';
// import { Button } from 'react-bootstrap';
// import { checkoutEventsV2 } from '../../tracker';
import { useTracking } from 'react-tracking';
import { COMP_SM } from '../../tracker/type/component';
import {
  EVENT_SM_CHANGE_THEME,
  EVENT_SM_DELETE,
  EVENT_SM_DELETE_THEME,
  EVENT_SM_THEME_ADD,
  EVENT_SM_THEME_CREATE,
} from '../../tracker/type/event/search-mapper';

const MESSAGE = {
  MOVE_LAST_RESULT: 'This is the last saved result in this IdeaTag, moving this result from the IdeaTag will also delete this IdeaTag and its IdeaNote.'
}

function SavedResultListSERP(props) {
  const {
    submitting,
    messageDialogShow, textDialogShow, themeDialogShow,
    savedResultsV2, messageContent, textDialogMode, themeDialogMode,
    currentFocusTheme, currentFocusResult,
    // statOfQueryID,
    deleteSavedResults,
    loadSavedResults, createTheme, renameTheme, editThemeIdea, changeTheme, deleteTheme, 
    closeMessageDialog,
    openEditIdeaDialog, openRenameThemeDialog, closeTextDialog,
    openAddThemeDialog, openMoveThemeDialog, closeThemeDialog,
  } = props;
  const [fetched, setFetched] = useState(false);
  const { Track, trackEvent } = useTracking({ component: COMP_SM });

  useEffect(() => {
    if (fetched) return;
    
    setFetched(true);
    loadSavedResults();
  }, [fetched, loadSavedResults]);

  const onDeleteSaved = (resultID, deleteThemeID) => {
    console.log(`delete result ${resultID}`);
    deleteSavedResults(resultID);

    if (deleteThemeID !== -1) {
      console.log(`delete theme ${deleteThemeID}`);
      deleteTheme(deleteThemeID);
    }
    trackEvent({ event: EVENT_SM_DELETE, timestamp: Date.now() });
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

  const onAddToTheme = ({ fromThemeID, themeID, resultID, themeName }) => {
    const isThemed = ![0, -1].includes(savedResultsV2.map(theme => theme.id).indexOf(fromThemeID));
    const isLastResult = isThemed && savedResultsV2.find(el => el.id === fromThemeID).searchResultList.length === 1
    const isConfirmed = isLastResult
      ? window.confirm(MESSAGE.MOVE_LAST_RESULT)
      : true;

    if (isConfirmed) {
      console.log(`${themeDialogMode} result ${resultID} from theme ${fromThemeID} to theme ${themeID}`);
      if (themeID === -1) {
        createTheme(themeName, resultID);
        trackEvent({ event: EVENT_SM_THEME_CREATE, timestamp: Date.now() });
        trackEvent({ event: EVENT_SM_THEME_ADD, timestamp: Date.now() });
      } else {
        changeTheme(themeID, resultID);
        trackEvent({ event: EVENT_SM_CHANGE_THEME, timestamp: Date.now() });
      }

      if (isLastResult) {
        console.log(`delete theme ${fromThemeID}`);
        deleteTheme(fromThemeID);
        trackEvent({ event: EVENT_SM_DELETE_THEME, timestamp: Date.now() });
      }
    }
    closeThemeDialog();
  };

  const onRemoveFromTheme = resultID => {
    console.log(`Ungroup result ${resultID}`);
    changeTheme(savedResultsV2[0].id, resultID);
  };

  return (
    <Track>
      <div id="im-saved-results" className={styles.wrap}>
        {/* <Button className='w-100 mb-3' onClick={() => checkoutEventsV2(statOfQueryID)}>[Test] Check Out Events</Button> */}
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
    </Track>
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
  textDialogMode: PropTypes.oneOf(['add-idea', 'edit-idea', 'rename-theme']).isRequired,
  themeDialogMode: PropTypes.oneOf(['add', 'move']).isRequired,
  currentFocusTheme: PropTypes.number.isRequired,
  currentFocusResult: PropTypes.number.isRequired,
  // statOfQueryID: PropTypes.arrayOf(PropTypes.number).isRequired,
  
  // functions
  deleteSavedResults: PropTypes.func.isRequired,
  loadSavedResults: PropTypes.func.isRequired,
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
  savedResultsV2: state.search.savedResultsV2,
  messageContent: state.search.messageContent,
  currentFocusTheme: state.search.currentFocusTheme,
  currentFocusResult: state.search.currentFocusResult,
  // statOfQueryID: state.search.statOfQueryID,
});

const mapDispatchToProps = {
  deleteSavedResults,
  loadSavedResults,
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