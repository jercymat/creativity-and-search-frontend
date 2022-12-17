import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import config from '../../config';
import { SearchResultContext } from '../../context';
import { getCurrentTime } from '../../utils';
import { SavedResultPlaceHolder, SavedResultSERP } from './cell';
import styles from './SavedResultList.module.scss';
import { SMTheme } from './themed';

function SavedResultListSERP() {
  const resultCtx = useContext(SearchResultContext);
  const [fetched, setFetched] = useState(false);
  const [isRemoving, setRemoving] = useState(false);

  // load and save result list
  const saveList = useDebouncedCallback(() => {
    const newOrder = resultCtx.savedResults
      .map((ret, i) => [parseInt(ret.id), i+1]);
    
    axios.post(config.api.HOST + '/searchresults', {
      action: 'reorder_searchresult',
      data: newOrder
    }, { withCredentials: true })
      .then(response => response.data.ret)
      .then(ret => {
        if (ret === 0) {
          console.log(`Graph successfully saved to server - ${getCurrentTime()}`);
        }
      });
  }, 1000);

  const loadList = async () => {
    const response = await axios.post(config.api.HOST + '/searchresults', {
      action: 'list_searchresult'
    }, { withCredentials: true });

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
      }, { withCredentials: true })
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
        }} />
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