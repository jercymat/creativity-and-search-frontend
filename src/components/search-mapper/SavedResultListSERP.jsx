import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { SavedResultPlaceHolder } from './cell';
import styles from './SavedResultList.module.scss';
import { SMResult, SMTheme } from './serp-side';
import {
  closeTextDialog,
  closeMessageDialog,
  deleteSavedResults,
  loadSavedResults,
  openAddIdeaDialog,
  openFormThemeMsgDialog,
  // reorderSavedResults,
  // updateSavedResults,
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
} from '../../actions/search';
import { SMTextDialog, SMThemeDialog } from './dialogs';
import { MessageDialog } from '../general/popup';
// import { DndContext } from '@dnd-kit/core';
// import { restrictToParentElement } from '@dnd-kit/modifiers';
// import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { useDebouncedCallback } from 'use-debounce';
// import { SavedResultSERP } from './cell';

function SavedResultListSERP(props) {
  const {
    loading, submitting,
    messageDialogShow, textDialogShow, themeDialogShow,
    savedResults, savedResultsV2, messageContent, textDialogMode, themeDialogMode,
    currentFocusTheme, currentFocusResult,
    // updateSavedResults, reorderSavedResults,
    loadSavedResults, deleteSavedResults,
    loadSavedResultsV2, createTheme, renameTheme, editThemeIdea, changeTheme,
    openFormThemeMsgDialog, closeMessageDialog,
    openAddIdeaDialog, openEditIdeaDialog, openRenameThemeDialog, closeTextDialog,
    openAddThemeDialog, openMoveThemeDialog, closeThemeDialog,
  } = props;
  const [fetched, setFetched] = useState(false);

  // load and save result list
  // const saveReorderedList = useDebouncedCallback(() => {
  //   const newOrder = savedResults
  //     .map((ret, i) => [parseInt(ret.id), i+1]);

  //   reorderSavedResults(newOrder);
  // }, 1000);

  // const handleDragEnd = (event) => {
  //   const { active, over } = event;
    
  //   if (active.id !== over.id) {
  //     const oldIndex = savedResults.findIndex(item => item.id === active.id);
  //     const newIndex = savedResults.findIndex(item => item.id === over.id);
  //     const newSaves = arrayMove(savedResults, oldIndex, newIndex);

  //     updateSavedResults(newSaves);
  //     saveReorderedList();
  //   }
  // }

  useEffect(() => {
    if (fetched) return;
    
    setFetched(true);
    loadSavedResults();
    loadSavedResultsV2();
  }, [fetched, loadSavedResults, loadSavedResultsV2]);

  const onDeleteSaved = resultID => {
    console.log(`delete result ${resultID}`);
    deleteSavedResults(resultID);
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

  const onAddToTheme = ({ themeID, resultID }) => {
    console.log(`${themeDialogMode} result ${resultID} to theme ${themeID}`);
    changeTheme(themeID, resultID);
    closeThemeDialog();
  };

  const onRemoveFromTheme = resultID => {
    console.log(`Ungroup result ${resultID}`);
    changeTheme(savedResultsV2[0].id, resultID);
  };

  return (
    <div id="im-saved-results" className={styles.wrap}>
      {savedResultsV2.length === 1 && savedResultsV2[0].searchResultList.length === 0 && <SavedResultPlaceHolder />}
      {savedResultsV2.length > 1 && savedResultsV2.slice(1).map(theme =>
        <SMTheme
          key={theme.id}
          theme={theme}
          onRenameTheme={() => openRenameThemeDialog(theme.id)}
          onEditIdea={() => openEditIdeaDialog(theme.id)}
          onDeleteSaved={onDeleteSaved}
          onMoveToTheme={({ resultID, fromThemeID }) => openMoveThemeDialog(fromThemeID, resultID)}
          onRemoveFromTheme={onRemoveFromTheme} />)}
      {savedResultsV2[0].searchResultList.map(save =>
        <SMResult
          key={save.id}
          save={save}
          onDeleteSave={onDeleteSaved}
          onAddToGroup={resultID => openAddThemeDialog(resultID)} />)}
      {/* <hr />
      <div className="text-center">
        <h2>Original SearchMapper</h2>
      </div>
      <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}>
        <SortableContext
          items={savedResults}
          strategy={verticalListSortingStrategy}>
            {savedResults.map(save => 
              <SavedResultSERP
                key={save.id}
                id={save.id}
                onDeleteSave={handleRemoveSaved}
                save={save} />)}
          </SortableContext>
      </DndContext> */}
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
  loading: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  messageDialogShow: PropTypes.bool.isRequired,
  textDialogShow: PropTypes.bool.isRequired,
  themeDialogShow: PropTypes.bool.isRequired,
  savedResults: PropTypes.array.isRequired,
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
  // updateSavedResults: PropTypes.func.isRequired,
  // reorderSavedResults: PropTypes.func.isRequired,
  loadSavedResults: PropTypes.func.isRequired,
  deleteSavedResults: PropTypes.func.isRequired,
  loadSavedResultsV2: PropTypes.func.isRequired,
  createTheme: PropTypes.func.isRequired,
  renameTheme: PropTypes.func.isRequired,
  editThemeIdea: PropTypes.func.isRequired,
  changeTheme: PropTypes.func.isRequired,
  openFormThemeMsgDialog: PropTypes.func.isRequired,
  closeMessageDialog: PropTypes.func.isRequired,
  openAddIdeaDialog: PropTypes.func.isRequired,
  openEditIdeaDialog: PropTypes.func.isRequired,
  openRenameThemeDialog: PropTypes.func.isRequired,
  closeTextDialog: PropTypes.func.isRequired,
  openAddThemeDialog: PropTypes.func.isRequired,
  openMoveThemeDialog: PropTypes.func.isRequired,
  closeThemeDialog: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  loading: state.search.loading,
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
  // updateSavedResults,
  // reorderSavedResults,
  loadSavedResults,
  deleteSavedResults,
  loadSavedResultsV2,
  renameTheme,
  editThemeIdea,
  createTheme,
  changeTheme,
  openFormThemeMsgDialog,
  closeMessageDialog,
  openAddIdeaDialog,
  openEditIdeaDialog,
  openRenameThemeDialog,
  closeTextDialog,
  openAddThemeDialog,
  openMoveThemeDialog,
  closeThemeDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListSERP);