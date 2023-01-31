import PropTypes from 'prop-types';
import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { SavedResultPlaceHolder, SavedResultSERP } from './cell';
import styles from './SavedResultList.module.scss';
import { SMResult, SMTheme } from './serp-side';
import {
  closeTextDialog,
  closeMessageDialog,
  deleteSavedResults,
  loadSavedResults,
  openAddIdeaDialog,
  openFormThemeMsgDialog,
  reorderSavedResults,
  updateSavedResults,
  openRenameThemeDialog,
  openEditIdeaDialog,
  openAddThemeDialog,
  openMoveThemeDialog,
  closeThemeDialog,
  loadSavedResultsV2,
} from '../../actions/search';
import { SMIdeaDialog, SMThemeDialog } from './dialogs';
import { MessageDialog } from '../general/popup';
import { Button } from 'react-bootstrap';

function SavedResultListSERP(props) {
  const {
    loading, submitting,
    messageDialogShow, textDialogShow, themeDialogShow,
    savedResults, savedResultsV2, messageContent, textDialogMode, themeDialogMode,
    updateSavedResults, loadSavedResults, reorderSavedResults, deleteSavedResults,
    loadSavedResultsV2,
    openFormThemeMsgDialog, closeMessageDialog,
    openAddIdeaDialog, openEditIdeaDialog, openRenameThemeDialog, closeTextDialog,
    openAddThemeDialog, openMoveThemeDialog, closeThemeDialog,
  } = props;
  const [fetched, setFetched] = useState(false);

  // load and save result list
  const saveReorderedList = useDebouncedCallback(() => {
    const newOrder = savedResults
      .map((ret, i) => [parseInt(ret.id), i+1]);

    reorderSavedResults(newOrder);
  }, 1000);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = savedResults.findIndex(item => item.id === active.id);
      const newIndex = savedResults.findIndex(item => item.id === over.id);
      const newSaves = arrayMove(savedResults, oldIndex, newIndex);

      updateSavedResults(newSaves);
      saveReorderedList();
    }
  }

  const handleRemoveSaved = useCallback((id) => {
    if (!loading) {
      deleteSavedResults(id);
    }
  }, [loading, deleteSavedResults]);

  useEffect(() => {
    if (fetched) return;
    
    setFetched(true);
    loadSavedResults();
    loadSavedResultsV2();
  }, [fetched, loadSavedResults, loadSavedResultsV2]);

  const onAddThemeIdea = ({ themeId, idea }) => {
    console.log(`Add Theme Idea: theme - ${themeId}, idea: ${idea}`);
    closeTextDialog();
  };

  const onAddToTheme = ({ groupId }) => {
    console.log(`${themeDialogMode} to theme ${groupId}`);
    closeThemeDialog();
  };

  return (
    <div id="im-saved-results" className={styles.wrap}>
      {savedResultsV2.length > 1 && savedResultsV2.slice(1).map(theme =>
        <SMTheme
          key={theme.id}
          theme={theme}
          onRenameTheme={openRenameThemeDialog}
          onEditIdea={() => openEditIdeaDialog(theme.id)} />)}
      {savedResultsV2[0].searchResultList.map(save =>
        <SMResult
          key={save.id}
          save={save}
          onDeleteSave={handleRemoveSaved} />)}
      <div>
        <Button variant='light' className='w-100' onClick={() => openAddThemeDialog(-1)}>DEMO - Add to Theme Dialog</Button>
      </div>
      {savedResults.length === 0 && <SavedResultPlaceHolder />}
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
      </DndContext>
      <MessageDialog
        show={messageDialogShow}
        onClose={closeMessageDialog}
        onConfirm={() => {}}
        {...messageContent} />
      <SMIdeaDialog
        show={textDialogShow}
        mode={textDialogMode}
        submitting={submitting}
        onSubmission={onAddThemeIdea}
        onClose={closeTextDialog} />
      <SMThemeDialog
        show={themeDialogShow}
        mode={themeDialogMode}
        submitting={submitting}
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
  textDialogMode: PropTypes.oneOf(['add-idea', 'edit-idea', 'rename-theme']).isRequired,
  themeDialogMode: PropTypes.oneOf(['add', 'move']).isRequired,
  
  // functions
  updateSavedResults: PropTypes.func.isRequired,
  loadSavedResults: PropTypes.func.isRequired,
  reorderSavedResults: PropTypes.func.isRequired,
  deleteSavedResults: PropTypes.func.isRequired,
  loadSavedResultsV2: PropTypes.func.isRequired,
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
});

const mapDispatchToProps = {
  updateSavedResults,
  loadSavedResults,
  reorderSavedResults,
  deleteSavedResults,
  loadSavedResultsV2,
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