import React from 'react';
import PropTypes from 'prop-types';
import styles from './SMTheme.IM.module.scss';
import { openThemeToggleModal, saveGraph, updateGraph } from '../../../actions/idea';
import SMResultIM from './SMResultIM';
import { connect } from 'react-redux';
import { getNodeSpawnPosition } from '../../idea-mapper/util/canvas';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CircleIconButton } from '../../general/button';

const renderTooltip = text => props => (
  <Tooltip {...props}>{text}</Tooltip>
);

export const SMThemeIM = props => {
  const { graph, theme, toggled, updateGraphAction, saveGraphAction, openThemeToggleModalAction } = props;

  const handleAddTheme = () => {
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
        colorHex: '#F0F0F0',
      },
      position: getNodeSpawnPosition(graph.nodes),
    }

    updateGraphAction({
      nodes: graph.nodes.map(node => ({ ...node, selected: false })).concat(themeNode),
      edges: graph.edges
    });
    saveGraphAction(true);
  }

  const handleToggleTheme = () => {
    openThemeToggleModalAction(theme.id);
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
        className={`${styles.note}${theme.note === '' ? ` ${styles.emptyNote} noselect` : ''}`}>
        {
          theme.note !== ''
            ? `${theme.note}`
            : 'There is no IdeaNote in this IdeaTag'
        }
      </div>
      <div className={styles.actions}>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250 }}
          overlay={renderTooltip(toggled ? 'Edit IdeaTag in IdeaMapper' : 'Add IdeaTag to IdeaMapper')}
        >
          <div className='d-inline-block'>
            <CircleIconButton
              onClick={toggled ? handleToggleTheme : handleAddTheme}
              variant={toggled ? 'light' : 'primary'}
              fsIcon={toggled ? ['fas', 'pen-to-square'] : ['fas', 'plus']} />
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
  updateGraphAction: updateGraph,
  saveGraphAction: saveGraph,
  openThemeToggleModalAction: openThemeToggleModal,
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
  toggled: PropTypes.bool.isRequired,
  openThemeToggleModalAction: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(SMThemeIM);