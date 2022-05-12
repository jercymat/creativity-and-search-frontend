import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import config from '../../config';
import { SearchResultContext } from '../../context';
import { SavedResultPlaceHolder, SavedResultSERP } from './cell';
import styles from './SavedResultList.module.scss';

function SavedResultListSERP() {
  const resultCtx = useContext(SearchResultContext);
  const [fetched, setFetched] = useState(false);
  const [isRemoving, setRemoving] = useState(false);

  // load and save result list
  const saveList = useDebouncedCallback(() => {
    console.log(resultCtx.savedResults.map(ret => parseInt(ret.id)));
  }, 1000);

  const loadList = async () => {
    const response = await axios.post(config.api.HOST + '/searchresults', {
      action: 'list_searchresult'
    });

    return response.data.relist.map(saved => ({
      id: saved.id.toString(),
      title: saved.name,
      url: saved.url,
      desc: saved.snippet
    }));
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = resultCtx.savedResults.findIndex(item => item.id === active.id);
      const newIndex = resultCtx.savedResults.findIndex(item => item.id === over.id);
      const newSaves = arrayMove(resultCtx.savedResults, oldIndex, newIndex);

      resultCtx.updateSavedResults(newSaves);
      saveList();
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
    if (fetched) return;
    
    setFetched(true);
    loadList()
      .then(list => resultCtx.updateSavedResults(list));
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