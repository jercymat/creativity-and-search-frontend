import SearchResultList from '../components/search/SearchResultList';
import SearchField from '../components/search/SearchField';
import RightIconButton from '../components/general/button/RightIconButton';
import { LinkContainer } from 'react-router-bootstrap';
import styles from './SERP.module.scss';
import { useContext, useEffect, useRef } from 'react';
import AppContext from '../store/AppContext';
import SavedResultSortableList from '../components/search/SavedResultSortableList';

const serpRlt = Array.from({ length: 10 }, (_, k) => ({
  id: `${k + 1}`,
  title: `Test Title ${k + 1}`,
  url: 'https://test.com',
  desc: 'Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description.'
}));

function SERPPage() {
  const savedArea = useRef(null);
  const context = useContext(AppContext);

  useEffect(() => {
    context.updateSavedAreaWidth(savedArea.current.offsetWidth);
  });

  return (
    <div id='im-serp-wrap' className={styles.wrap}>
      <div className={styles.result}>
        <SearchField
          id='im-current-search-area'
          className={styles.searchfield}
          placeholder='Your creativity starts here.'/>
        <SearchResultList results={serpRlt} />
      </div>
      <div ref={savedArea} className={styles.saved}>
        <div className="d-flex justify-content-end mb-3">
          <LinkContainer to='/map'>
            <RightIconButton variant='primary' btnText='Idea Map' fsIcon={['fas', 'chevron-right']} />
          </LinkContainer>
        </div>
        <SavedResultSortableList />
      </div>
    </div>
  )
}

export default SERPPage;