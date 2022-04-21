import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useContext, useState } from 'react';
import styles from './SavedResultList.module.scss';
import SavedResultSortable from './SavedResultSortable';
import AppContext from '../../store/AppContext';

function SavedResultSortableList() {
  const context = useContext(AppContext);
  const [saves, setSaves] = useState(context.savedResults);

  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSaves((saves) => {
        const oldIndex = saves.findIndex(item => item.id === active.id);
        const newIndex = saves.findIndex(item => item.id === over.id);
        const newSaves = arrayMove(saves, oldIndex, newIndex);

        context.updateSavedResults(newSaves);

        return newSaves;
      });
    }
  }

  return (
    <div id="im-saved-results" className={styles.wrap}>
      <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}>
        <SortableContext
          items={saves}
          strategy={verticalListSortingStrategy}>
            {saves.map(save => <SavedResultSortable key={save.id} id={save.id} save={save} />)}
          </SortableContext>
      </DndContext>
    </div>
  )
}

export default SavedResultSortableList;