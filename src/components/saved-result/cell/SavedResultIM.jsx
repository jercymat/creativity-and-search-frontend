import PropTypes from 'prop-types';
import { useContext } from 'react';
import { SearchResultContext } from '../../../context';
import styles from './SavedResult.module.scss';

function SavedResultIM(props) {
  const resultCtx = useContext(SearchResultContext);

  const handleAddIdea = (idea, type) => () => {
    const newNode = {
      id: `${Date.now()}`,
      type: type,
      data: type === 'text'
        ? {
          label: idea,
          color: 'w'
        }
        : {
          link: idea,
          color: 'w'
        },
      position: {
        x: -200,
        y: -100
      },
    };
    resultCtx.updateGraph({
      nodes: resultCtx.graph.nodes.concat(newNode),
      edges: resultCtx.graph.edges
    });
  };

  return (
    <div
      className={`${styles.wrap} ${styles.im}`}
      key={props.save.id}>
        <div className={styles.head}>
          <h2
            className={styles.title}
            onClick={handleAddIdea(props.save.title, 'text')}>
              {props.save.title}
          </h2>
          <h4
            className={styles.url}
            onClick={handleAddIdea(props.save.url, 'link')}>
              {props.save.url}
          </h4>
        </div>
      <p
        className={styles.desc}
        onClick={handleAddIdea(props.save.desc, 'text')}>
          {props.save.desc}
      </p>
    </div>
  )
}

SavedResultIM.propTypes = {
  save: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
};

export default SavedResultIM;