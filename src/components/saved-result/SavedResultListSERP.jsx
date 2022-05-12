import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import config from '../../config';
import { SearchResultContext } from '../../context';
import { SavedResultPlaceHolder, SavedResultSERP } from './cell';
import styles from './SavedResultList.module.scss';

function SavedResultListSERP() {
  const resultCtx = useContext(SearchResultContext);
  const [fetched, setFetched] = useState(false);
  const [isRemoving, setRemoving] = useState(false);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = resultCtx.savedResults.findIndex(item => item.id === active.id);
      const newIndex = resultCtx.savedResults.findIndex(item => item.id === over.id);
      const newSaves = arrayMove(resultCtx.savedResults, oldIndex, newIndex);

      resultCtx.updateSavedResults(newSaves);
    }
  }

  const handleRemoveSaved = useCallback((id) => {
    if (!isRemoving) {
      setRemoving(true);

      axios.post(config.api.HOST + '/searchresults', {
        action: 'delete_searchresult',
        searchResultId: id
      })
        .then(response => response.data)
        .then(data => {
          if (data.ret === 0) {
            const newSaves = resultCtx.savedResults.filter(save => save.id !== id);
            resultCtx.updateSavedResults(newSaves);
            setRemoving(false);
          }
        })
    }
  }, [isRemoving, resultCtx]);

  useEffect(() => {
    if (!fetched) {
      setFetched(true);

      axios.post(config.api.HOST + '/searchresults', {
        action: 'list_searchresult'
      })
        .then(response => response.data.relist)
        .then(list => {
          resultCtx.updateSavedResults(list.map(saved => ({
            id: saved.id.toString(),
            title: saved.name,
            url: saved.url,
            desc: saved.snippet
          })));
        });
    }
  }, [fetched, resultCtx]);

  return (
    <div id="im-saved-results" className={styles.wrap}>
      {resultCtx.savedResults.length === 0 && <SavedResultPlaceHolder />}
      <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}>
        <SortableContext
          items={resultCtx.savedResults}
          strategy={verticalListSortingStrategy}>
            {resultCtx.savedResults.map(save => 
              <SavedResultSERP
                key={save.id}
                id={save.id}
                onDeleteSave={handleRemoveSaved}
                save={save} />)}
          </SortableContext>
      </DndContext>
    </div>
  )
}

export default SavedResultListSERP;