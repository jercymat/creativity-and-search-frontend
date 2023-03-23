import React from 'react';
import PropTypes from 'prop-types';
import styles from './SMTheme.IM.module.scss';
import { useTracking } from 'react-tracking';
import { updateGraph } from '../../../actions/idea';
import SMResultIM from './SMResultIM';
import { connect } from 'react-redux';
import { getNodeSpawnPosition } from '../../idea-mapper/canvas/CanvasUtil';

export const SMThemeIM = props => {
  const { graph, theme, updateGraph } = props;
  const { trackEvent } = useTracking();

  const handleAddNoteAsText = () => {
    if (theme.note === '') return;

    const newNode = {
      id: `${Date.now()}`,
      type: 'text',
      selected: true,
      data: {
        label: theme.note,
        color: 'w'
      },
      position: getNodeSpawnPosition(graph.nodes),
    };
    trackEvent({ event: 'ideaAddedFromSaved', timestamp: Date.now() });

    updateGraph({
      nodes: graph.nodes.map(node => ({ ...node, selected: false })).concat(newNode),
      edges: graph.edges
    });
  }

  return (
    <div className={styles.wrap}>
      <div className={styles['theme-title']}>{theme.name}</div>
      <div className={styles.results}>
        {
          theme.searchResultList.map(s => (
            <SMResultIM
              key={s.id}
              save={s} />
          ))
        }
      </div>
      <hr />
      <div
        className={`${styles.note}${theme.note === '' ? ` ${styles.emptyNote} noselect` : ''}`}
        onClick={handleAddNoteAsText}>
        {
          theme.note !== ''
            ? `${theme.note}`
            : 'There is no idea in this theme'
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  graph: state.idea.graph,
});

const mapDispatchToProps = {
  updateGraph,
};


SMThemeIM.propTypes = {
  theme: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    searchResultList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
      imgUrl: PropTypes.string
    }).isRequired).isRequired,
    note: PropTypes.string.isRequired,
  }).isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(SMThemeIM);