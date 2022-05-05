import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useContext } from 'react';
import { SearchResultContext } from '../../store';
import styles from './SavedResultList.module.scss';
import SavedResultSortable from './SavedResultSortable';

function SavedResultSortableList() {
  const resultCtx = useContext(SearchResultContext);

  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = resultCtx.savedResults.findIndex(item => item.id === active.id);
      const newIndex = resultCtx.savedResults.findIndex(item => item.id === over.id);
      const newSaves = arrayMove(resultCtx.savedResults, oldIndex, newIndex);

      resultCtx.updateSavedResults(newSaves);
    }
  }

  return (
    <div id="im-saved-results" className={styles.wrap}>
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