import React from 'react';
import PropTypes from 'prop-types';
import styles from './SMTheme.IM.module.scss';
import { useTracking } from 'react-tracking';
import { updateGraph } from '../../../actions/idea';
import SMResultIM from './SMResultIM';
import { connect } from 'react-redux';
import { getNodeSpawnPosition } from '../../idea-mapper/canvas/CanvasUtil';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CircleIconButton } from '../../general/button';

const renderTooltip = text => props => (
  <Tooltip {...props}>{text}</Tooltip>
);

export const SMThemeIM = props => {
  const { graph, theme, updateGraph } = props;
  const { trackEvent } = useTracking();

  // const handleAddNoteAsText = () => {
  //   if (theme.note === '') return;

  //   const newNode = {
  //     id: `${Date.now()}`,
  //     type: 'text',
  //     selected: true,
  //     data: {
  //       label: theme.note,
  //       color: 'w'
  //     },
  //     position: getNodeSpawnPosition(graph.nodes),
  //   };
  //   trackEvent({ event: 'ideaAddedFromSaved', timestamp: Date.now() });

  //   updateGraph({
  //     nodes: graph.nodes.map(node => ({ ...node, selected: false })).concat(newNode),
  //     edges: graph.edges
  //   });
  // }

  const handleAddTheme = () => {
    console.log('here');

    // check if theme already being added to the canvas
    if (graph.nodes.find(node => node.id === `sm-theme-${theme.id}`)) return;

    console.log('added a new theme idea')

    const themeNode = {
      id: `sm-theme-${theme.id}`,
      type: 'sm_theme',
      selected: true,
      data: {
        theme_id: theme.id,
        title: theme.name,
        total_sr: theme.searchResultList.length,
        shown_sr: 0,
        note_shown: false,
      },
      position: getNodeSpawnPosition(graph.nodes),
    }

    // test
    // const resultNode = {
    //   id: `sm-result-46`,
    //   type: 'sm_result',
    //   selected: false,
    //   data: {
    //     theme_id: theme.id,
    //     title: "Reduced Basis, Embedded Methods and Parametrized Levelset Geometry",
    //     url: "https://arxiv.org/abs/2301.12401",
    //     desc: "Numerical experiments verify the efficiency of the introduced ``hello world'' problems considering reduced order results in several cases for one, two, three and four dimensional geometrical kind of parametrization. We investigate execution times, and we illustrate transport methods and improvements. A list of important references related to ...",
    //     color: 'w',
    //   },
    //   position: getNodeSpawnPosition(graph.nodes),
    // }

    // const noteNode = {
    //   id: `sm-theme-note-${theme.id}`,
    //   type: 'sm_note',
    //   selected: false,
    //   data: {
    //     theme_id: theme.id,
    //     label: 'New note',
    //     color: 'w',
    //   },
    //   position: getNodeSpawnPosition(graph.nodes),
    // }

    // updateGraph({
    //   nodes: graph.nodes.map(node => ({ ...node, selected: false }))
    //     .concat(themeNode)
    //     .concat(resultNode)
    //     .concat(noteNode),
    //   edges: graph.edges
    // });

    updateGraph({
      nodes: graph.nodes.map(node => ({ ...node, selected: false })).concat(themeNode),
      edges: graph.edges
    });
  }

  return (
    <div className={styles.wrap}>
      <button
        type='button'
        className={styles['theme-title']}>{theme.name}</button>
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
        className={`${styles.note}${theme.note === '' ? ` ${styles.emptyNote} noselect` : ''}`}>
        {
          theme.note !== ''
            ? `${theme.note}`
            : 'There is no idea in this theme'
        }
      </div>
      <div className={styles.actions}>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250 }}
          overlay={renderTooltip('Add to IdeaMapper')}
        >
          <div className={`d-inline-block ${styles.action}`}>
            <CircleIconButton
              onClick={handleAddTheme}
              className={styles.add}
              variant='primary'
              fsIcon={['fas', 'plus']} />
          </div>
        </OverlayTrigger>
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