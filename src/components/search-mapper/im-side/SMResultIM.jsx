import React from 'react';
import PropTypes from 'prop-types';
import styles from './SMResult.IM.module.scss';
import { useTracking } from 'react-tracking';
import { updateGraph } from '../../../actions/idea';
import { getNodeSpawnPosition } from '../../idea-mapper/canvas/CanvasUtil';
import { connect } from 'react-redux';

const SMResultIM = props => {
  const { graph, save, updateGraph } = props;
  const { trackEvent } = useTracking();

  const handleAddIdea = (idea, type) => () => {
    const newNode = {
      id: `${Date.now()}`,
      type: type,
      selected: true,
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
      position: getNodeSpawnPosition(graph.nodes),
    };
    trackEvent({ event: 'ideaAddedFromSaved', timestamp: Date.now() });

    updateGraph({
      nodes: graph.nodes.map(node => ({ ...node, selected: false })).concat(newNode),
      edges: graph.edges
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h2
          className={styles.title}
          onClick={handleAddIdea(save.title, 'text')}>{save.title}</h2>
        <h4
          className={styles.url}
          onClick={handleAddIdea([save.title, save.url], 'link')}>{save.url}</h4>
      </div>
      <p
        className={styles.desc}
        onClick={handleAddIdea(save.desc, 'text')}>{save.desc}</p>
    </div>
  )
}

SMResultIM.propTypes = {
  save: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired,
}

const mapStateToProps = (state) => ({
  graph: state.idea.graph,
});

const mapDispatchToProps = {
  updateGraph,
};

export default connect(mapStateToProps, mapDispatchToProps)(SMResultIM);