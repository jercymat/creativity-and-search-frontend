import PropTypes from 'prop-types';
import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import config from '../../config';
import { getCurrentTime } from '../../utils';
import { SavedResultPlaceHolder, SavedResultSERP } from './cell';
import styles from './SavedResultList.module.scss';
import { SMTheme } from './themed';
import { updateSavedResults } from '../../actions/search';

function SavedResultListSERP(props) {
  const { savedResults, updateSavedResults } = props;
  const [fetched, setFetched] = useState(false);
  const [isRemoving, setRemoving] = useState(false);

  // load and save result list
  const saveList = useDebouncedCallback(() => {
    const newOrder = savedResults
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
      const oldIndex = savedResults.findIndex(item => item.id === active.id);
      const newIndex = savedResults.findIndex(item => item.id === over.id);
      const newSaves = arrayMove(savedResults, oldIndex, newIndex);

      updateSavedResults(newSaves);
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
    loadList()
      .then(list => updateSavedResults(list));
  }, [fetched, updateSavedResults]);

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
        }} />
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
    </div>
  )
}

SavedResultListSERP.propTypes = {
  savedResults: PropTypes.array.isRequired,
  updateSavedResults: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  savedResults: state.search.savedResults,
});

const mapDispatchToProps = {
  updateSavedResults,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedResultListSERP);