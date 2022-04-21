import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import LogoNavbar from "../components/general/logo/LogoNavbar";
import Sortable from "../components/test/Sortable";
import styles from './Test.module.scss';

function TestLayout(props) {
  const [saves, setSaves] = useState([{
    id: '000001',
    title: 'Test Title1',
    url: 'https://test.com',
    desc: 'Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description.'
  },
  {
    id: '000002',
    title: 'Test Title2',
    url: 'https://test.com',
    desc: 'Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description.'
  },
  {
    id: '000003',
    title: 'Test Title3',
    url: 'https://test.com',
    desc: 'Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description.'
  }]);

  function handleDragEnd(event) {
    const { active, over } = event;

    // console.log(active, over);

    if (active.id !== over.id) {
      setSaves((saves) => {
        const oldIndex = saves.findIndex(item => item.id === active.id);
        const newIndex = saves.findIndex(item => item.id === over.id);

        return arrayMove(saves, oldIndex, newIndex);
      });
    }
  }

  return (
    <div>
      <LogoNavbar />
      <div style={{width: '350px'}} className={styles.wrap}>
        <DndContext
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}>
          <SortableContext
            items={saves}
            strategy={verticalListSortingStrategy}>
            {saves.map(save => <Sortable key={save.id} id={save.id} save={save} />)}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default TestLayout;