import PropTypes from 'prop-types';
import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { SavedResultPlaceHolder, SavedResultSERP } from './cell';
import styles from './SavedResultList.module.scss';
import { SMTheme } from './themed';
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
} from '../../actions/search';
import { SMIdeaDialog } from './dialogs';
import { MessageDialog } from '../general/popup';

function SavedResultListSERP(props) {
  const {
    loading, submitting,
    messageDialogShow, textDialogShow, savedResults, messageContent, textDialogMode,
    updateSavedResults, loadSavedResults, reorderSavedResults, deleteSavedResults,
    closeMessageDialog, openAddIdeaDialog, openRenameThemeDialog, closeTextDialog,
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
  }, [fetched, loadSavedResults]);

  const onAddThemeIdea = ({ themeId, idea }) => {
    console.log(`Add Theme Idea: theme - ${themeId}, idea: ${idea}`);
    closeTextDialog();
  }

  return (
    <div id="im-saved-results" className={styles.wrap}>
      {savedResults.length === 0 && <SavedResultPlaceHolder />}
      <SMTheme
        theme={{
          id: '0000',
          title: 'Test Theme 1',
          saves: [
            {
              id: '0001',
              title: 'Test Title 1',
              url: 'https://github.com/jercymat',
              desc: 'We present a class of efficient models called MobileNets for mobile and embedded vision applications. MobileNets are based on a streamlined architecture that uses depth-wise separable convolutions to build light weight deep neural networks. We introduce two simple global hyper-parameters that efficiently trade off between latency and accuracy.'
            },
            {
              id: '0002',
              title: 'Test Title 2',
              url: 'https://github.com/jercymat',
              desc: 'We present a class of efficient models called MobileNets for mobile and embedded vision applications. MobileNets are based on a streamlined architecture that uses depth-wise separable convolutions to build light weight deep neural networks. We introduce two simple global hyper-parameters that efficiently trade off between latency and accuracy.'
            }
          ],
          note: '',
        }}
        onRenameTheme={openRenameThemeDialog}
        onAddIdea={openAddIdeaDialog} />
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
    </div>
  )
}

SavedResultListSERP.propTypes = {
  loading: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  messageDialogShow: PropTypes.bool.isRequired,
  textDialogShow: PropTypes.bool.isRequired,
  savedResults: PropTypes.array.isRequired,
  messageContent: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,
    confirmText: PropTypes.string.isRequired,
  }).isRequired,
  textDialogMode: PropTypes.oneOf(['add-idea', 'edit-idea', 'rename-theme']).isRequired,
  updateSavedResults: PropTypes.func.isRequired,
  loadSavedResults: PropTypes.func.isRequired,
  reorderSavedResults: PropTypes.func.isRequired,
  deleteSavedResults: PropTypes.func.isRequired,
  openFormThemeMsgDialog: PropTypes.func.isRequired,
  closeMessageDialog: PropTypes.func.isRequired,
  openAddIdeaDialog: PropTypes.func.isRequired,
  openRenameThemeDialog: PropTypes.func.isRequired,
  closeTextDialog: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  loading: state.search.loading,
  submitting: state.search.submitting,
  messageDialogShow: state.search.messageDialogShow,
  textDialogShow: state.search.textDialogShow,
  textDialogMode: state.search.textDialogMode,
  savedResults: state.search.savedResults,
  messageContent: state.search.messageContent,
});

const mapDispatchToProps = {
  updateSavedResults,
  loadSavedResults,
  reorderSavedResults,
  deleteSavedResults,
  openFormThemeMsgDialog,
  closeMessageDialog,
  openAddIdeaDialog,
  openRenameThemeDialog,
  closeTextDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListSERP);