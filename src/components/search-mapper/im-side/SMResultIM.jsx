import React from 'react';
import PropTypes from 'prop-types';
import styles from './SMResult.IM.module.scss';
import { updateGraph } from '../../../actions/idea';
// import { getNodeSpawnPosition } from '../../idea-mapper/canvas/CanvasUtil';
import { connect } from 'react-redux';
// import { EVENT_IM_IDEA_ADD_FROM_CONTEXT } from '../../../tracker/type/event/idea-mapper';

const SMResultIM = props => {
  // const { graph, save, updateGraph } = props;
  const { save } = props;

  // const handleAddIdea = (idea, type) => () => {
  //   const newNode = {
  //     id: `${Date.now()}`,
  //     type: type,
  //     selected: true,
  //     data: type === 'text'
  //       ? {
  //         label: idea,
  //         color: 'w'
  //       }
  //       : type === 'link'
  //         ? {
  //           title: idea[0],
  //           link: idea[1],
  //           color: 'w'
  //         }
  //         : {
  //           link: idea,
  //           color: 'w'
  //         },
  //     position: getNodeSpawnPosition(graph.nodes),
  //   };
  //   trackEvent({ event: EVENT_IM_IDEA_ADD_FROM_CONTEXT, timestamp: Date.now() });

  //   updateGraph({
  //     nodes: graph.nodes.map(node => ({ ...node, selected: false })).concat(newNode),
  //     edges: graph.edges
  //   });
  // };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <a href={save.url} target='_blank' rel="noreferrer">
        <h2 className={styles.title}>{save.title}</h2>
        </a>
        <h4 className={styles.url}>{save.url}</h4>
      </div>
      <p className={styles.desc}>{save.desc}</p>
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
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
  }).isRequired,
  updateGraph: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  graph: state.idea.graph,
});

const mapDispatchToProps = {
  updateGraph,
};

export default connect(mapStateToProps, mapDispatchToProps)(SMResultIM);