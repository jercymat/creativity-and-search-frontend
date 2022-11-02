import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useTracking } from 'react-tracking';
import { SearchResultContext } from '../../../context';
import styles from './SavedResult.module.scss';

function SavedResultIM(props) {
  const resultCtx = useContext(SearchResultContext);
  const { trackEvent } = useTracking();

  const handleAddIdea = (idea, type) => () => {
    const newNode = {
      id: `${Date.now()}`,
      type: type,
      data: type === 'text'
        ? {
          label: idea,
          color: 'w'
        }
        : type === 'link'
          ? {
            title: idea[0],
            link: idea[1],
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
    trackEvent({ event: 'ideaAddedFromSaved', timestamp: Date.now() });

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
            onClick={handleAddIdea([props.save.title, props.save.url], 'link')}>
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