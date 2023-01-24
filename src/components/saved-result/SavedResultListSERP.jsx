import PropTypes from 'prop-types';
import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import config from '../../config';
import { SavedResultPlaceHolder, SavedResultSERP } from './cell';
import styles from './SavedResultList.module.scss';
import { SMTheme } from './themed';
import {
  closeAddIdeaDialog,
  loadSavedResults,
  openAddIdeaDialog,
  reorderSavedResults,
  updateSavedResults,
} from '../../actions/search';
import { SMIdeaDialog } from './dialogs';

function SavedResultListSERP(props) {
  const {
    submitting, addIdeaDialogShow, savedResults,
    updateSavedResults, loadSavedResults, reorderSavedResults,
    openAddIdeaDialog, closeAddIdeaDialog,
  } = props;
  const [fetched, setFetched] = useState(false);
  const [isRemoving, setRemoving] = useState(false);

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
    if (!isRemoving) {
      setRemoving(true);

      axios.post(config.api.HOST + '/searchresults', {
        action: 'delete_searchresult',
        searchResultId: id
      }, { withCredentials: true })
        .then(response => response.data)
        .then(data => {
          if (data.ret === 0) {
            const newSaves = savedResults.filter(save => save.id !== id);
            updateSavedResults(newSaves);
            setRemoving(false);
          }
        })
    }
  }, [isRemoving, savedResults, updateSavedResults]);

  useEffect(() => {
    if (fetched) return;
    
    setFetched(true);
    loadSavedResults();
  }, [fetched, loadSavedResults]);

  const onAddThemeIdea = ({ themeId, idea }) => {
    console.log(`Add Theme Idea: theme - ${themeId}, idea: ${idea}`);
    closeAddIdeaDialog();
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
      <SMIdeaDialog
        show={addIdeaDialogShow}
        submitting={submitting}
        onSubmission={onAddThemeIdea}
        onClose={closeAddIdeaDialog} />
    </div>
  )
}

SavedResultListSERP.propTypes = {
  submitting: PropTypes.bool.isRequired,
  addIdeaDialogShow: PropTypes.bool.isRequired,
  savedResults: PropTypes.array.isRequired,
  updateSavedResults: PropTypes.func.isRequired,
  loadSavedResults: PropTypes.func.isRequired,
  reorderSavedResults: PropTypes.func.isRequired,
  openAddIdeaDialog: PropTypes.func.isRequired,
  closeAddIdeaDialog: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  submitting: state.search.submitting,
  savedResults: state.search.savedResults,
  addIdeaDialogShow: state.search.addIdeaDialogShow,
});

const mapDispatchToProps = {
  updateSavedResults,
  loadSavedResults,
  reorderSavedResults,
  openAddIdeaDialog,
  closeAddIdeaDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListSERP);