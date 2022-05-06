import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import config from '../../config';
import { SearchResultContext } from '../../store';
import styles from './SavedResultList.module.scss';
import SavedResultPlaceHolder from './SavedResultPlaceHolder';
import SavedResultSortable from './SavedResultSortable';

function SavedResultSortableList() {
  const resultCtx = useContext(SearchResultContext);
  const [isFetching, setFetching] = useState(false);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = resultCtx.savedResults.findIndex(item => item.id === active.id);
      const newIndex = resultCtx.savedResults.findIndex(item => item.id === over.id);
      const newSaves = arrayMove(resultCtx.savedResults, oldIndex, newIndex);

      resultCtx.updateSavedResults(newSaves);
    }
  }

  useEffect(() => {
    if (!isFetching) {
      setFetching(true);

      axios.post(config.api.HOST + '/searchresults', {
        action: 'list_searchresult'
      })
        .then(response => response.data.relist)
        .then(list => {
          resultCtx.updateSavedResults(list.map(saved => ({
            id: saved.id,
            title: saved.name,
            url: saved.url,
            desc: saved.snippet
          })));
        });
    }
  }, [isFetching, resultCtx]);

  return (
    <div id="im-saved-results" className={styles.wrap}>
      {resultCtx.savedResults.length === 0 && <SavedResultPlaceHolder />}
      <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}>
        <SortableContext
          items={resultCtx.savedResults}
          strategy={verticalListSortingStrategy}>
            {resultCtx.savedResults.map(save => <SavedResultSortable key={save.id} id={save.id} save={save} />)}
          </SortableContext>
      </DndContext>
    </div>
  )
}

export default SavedResultSortableList;