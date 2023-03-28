import PropTypes from 'prop-types';
import { Fragment, useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  getConnectedEdges
} from 'react-flow-renderer';
import IdeaAddingBar from './IdeaAddingBar';
import IdeaModal from './IdeaModal';
import { IdeaMapperEdge } from './canvas/edge';
import {
  TextIdeaNode,
  LinkIdeaNode,
  ImageIdeaNode,
  SMResultNode,
  SMNoteNode,
  SMThemeNode,
} from './canvas/node';
import { IdeaMapperConnection } from './canvas/connect';
import { useDebouncedCallback } from 'use-debounce';
import { useTracking } from 'react-tracking';
import { getNodeSpawnPosition } from './canvas/CanvasUtil';
import { connect } from 'react-redux';
import { closeThemeToggleModal, loadGraph, saveGraph, updateGraph } from '../../actions/idea';
import ThemeToggleModal from './ThemeToggleModal';

// idea canvas
// const initialGraph = '{"nodes":[{"id":"node-1","type":"text","data":{"label":"Test Idea 1","color":"r"},"position":{"x":0,"y":0},"width":129,"height":44},{"id":"node-2","type":"text","data":{"label":"Test Idea 2","color":"p"},"position":{"x":200,"y":0},"width":131,"height":44},{"id":"node-3","type":"text","data":{"label":"Test Idea 3","color":"w"},"position":{"x":400,"y":0},"width":132,"height":44},{"id":"node-4","type":"text","data":{"label":"Test Idea 4","color":"w"},"position":{"x":0,"y":100},"width":132,"height":44},{"id":"node-5","type":"text","data":{"label":"Test Idea 5","color":"r"},"position":{"x":200,"y":100},"width":132,"height":44},{"id":"node-6","type":"text","data":{"label":"Test Idea 6","color":"g"},"position":{"x":400,"y":100},"width":132,"height":44},{"id":"node-7","type":"text","data":{"label":"Test Idea 7","color":"p"},"position":{"x":0,"y":200},"width":131,"height":44},{"id":"node-8","type":"text","data":{"label":"Test Idea 8","color":"r"},"position":{"x":200,"y":200},"width":132,"height":44},{"id":"node-9","type":"text","data":{"label":"Test Idea 9","color":"b"},"position":{"x":400,"y":200},"width":132,"height":44},{"id":"node-link-1","type":"link","data":{"link":"https://youtu.be/dQw4w9WgXcQ","color":"p"},"position":{"x":0,"y":300},"width":319,"height":46},{"id":"node-img-1","type":"image","data":{"img_url":"https://cdn.vox-cdn.com/thumbor/9j-s_MPUfWM4bWdZfPqxBxGkvlw=/1400x1050/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg","color":"g"},"position":{"x":0,"y":400},"width":166,"height":166},{"id":"node-img-2","type":"image","data":{"img_url":"https://i.imgur.com/Jvh1OQm.jpeg","color":"g"},"position":{"x":200,"y":400},"width":166,"height":166},{"id":"node-img-3","type":"image","data":{"img_url":"https://i.imgur.com/x62B7BA.png","color":"r"},"position":{"x":400,"y":400},"width":166,"height":166}],"edges":[{"id":"edge-1","source":"node-1","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-2","source":"node-2","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-3","source":"node-3","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-4","source":"node-4","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-6","source":"node-6","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-7","source":"node-7","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-8","source":"node-8","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-9","source":"node-9","target":"node-5","type":"idea_mapper_edge"}]}';
const nodeTypes = { 
  text: TextIdeaNode,
  link: LinkIdeaNode,
  image: ImageIdeaNode,
  sm_theme: SMThemeNode,
  sm_result: SMResultNode,
  sm_note: SMNoteNode,
}
const edgeTypes = { idea_mapper_edge: IdeaMapperEdge }

function IdeaMapCanvas(props) {
  const {
    themeToggleModalShow,
    graph,
    closeThemeToggleModal,
    loadGraphAction, saveGraphAction, updateGraphAction,
  } = props;
  const { trackEvent } = useTracking();

  // idea adding modal
  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalEditNode, setModalEditNode] = useState(null);
  const [modalType, setModalType] = useState('text');

  const saveGraphDebounced = useDebouncedCallback(saveGraphAction, 250);

  useEffect(() => {
    loadGraphAction();
  }, [loadGraphAction]);

  const handleOpenModal = useCallback(
    (mode, type, node) => () => {
      setModalMode(mode);
      setModalType(type);

      if (mode === 'edit') {
        setModalEditNode(node);
      }
      setModalShow(true);
    },
    [setModalMode, setModalType, setModalEditNode, setModalShow]
  );

  const handleCloseModal = useCallback(() => setModalShow(false), [setModalShow]);

  const onNodesChange = useCallback(
    (changes) => {
      updateGraphAction({
        nodes: applyNodeChanges(changes, graph.nodes) ,
        edges: graph.edges
      });
      saveGraphDebounced();
    },
    [saveGraphDebounced, updateGraphAction, graph]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      updateGraphAction({
        nodes: graph.nodes,
        edges: applyEdgeChanges(changes, graph.edges)
      });
      saveGraphDebounced();
    },
    [saveGraphDebounced, updateGraphAction, graph]
  );

  const onConnect = useCallback(
    (connection) => {
      updateGraphAction({
        nodes: graph.nodes,
        edges: addEdge({ ...connection, type: 'idea_mapper_edge' }, graph.edges)
      });
      saveGraphDebounced();
    },
    [saveGraphDebounced, updateGraphAction, graph]
  );

  // open idea editing modal after double click on ideas
  const onNodeDoubleClick = useCallback(
    (e, node) => {
      if (['sm_theme', 'sm_result', 'sm_note'].includes(node.type)) return;

      handleOpenModal('edit', node.type, node)();
    },
    [handleOpenModal]
  )

  const handleAddIdea = useCallback(
    (type, data) => {
      const newNode = {
        id: `${Date.now()}`,
        type: type,
        selected: true,
        data: { ...data },
        position: getNodeSpawnPosition(graph.nodes)
      };
      updateGraphAction({
        nodes: graph.nodes.map(node => ({ ...node, selected: false })).concat(newNode),
        edges: graph.edges
      });
      setModalShow(false);
      saveGraphDebounced()
    }, [setModalShow, updateGraphAction, saveGraphDebounced, graph]
  )

  const handleUpdateIdea = useCallback(
    (data) => {
      updateGraphAction({
        nodes: graph.nodes.map(node => {
          if (node.id === modalEditNode.id) {
            node.data = { ...data };
          }
          return node;
        }),
        edges: graph.edges
      });
      setModalShow(false);
      saveGraphDebounced();
    }, [modalEditNode, updateGraphAction, saveGraphDebounced, graph]
  )

  // TODO: delete node through delete key will not trigger this function to clear connected edges
  // disable delete key after theme toggle dialog implemented.
  const handleDeleteIdea = useCallback(
    () => {
      const edgesToRemove = getConnectedEdges([modalEditNode], graph.edges).map(edge => edge.id);
      updateGraphAction({
        nodes: graph.nodes.filter(node => node.id !== modalEditNode.id),
        edges: graph.edges.filter(edge => !edgesToRemove.includes(edge.id))
      });
      setModalShow(false);
      saveGraphDebounced()
    }, [modalEditNode, setModalShow, updateGraphAction, saveGraphDebounced, graph]
  );

  return (
    <Fragment>
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={IdeaMapperConnection}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodesDelete={() => trackEvent({ event: 'ideaDeleted', timestamp: Date.now() })}
        onEdgesDelete={() => trackEvent({ event: 'ideaLineDeleted', timestamp: Date.now() })}
        onNodeDragStop={() => trackEvent({ event: 'ideaMoved', timestamp: Date.now() })}
        minZoom={0.5}
        maxZoom={2}
        fitView
        fitViewOptions={{ maxZoom: 1 }}>
        <Background />
      </ReactFlow>
      <IdeaModal
        mode={modalMode}
        type={modalType}
        onCloseModal={handleCloseModal}
        onAddIdea={handleAddIdea}
        onUpdateIdea={handleUpdateIdea}
        onDeleteIdea={handleDeleteIdea}
        node={modalEditNode}
        show={modalShow}/>
      <ThemeToggleModal
        show={themeToggleModalShow}
        onCloseModal={closeThemeToggleModal}
        onRemoveTheme={() => {}}
        onUpdateToggle={() => {}} />
      <IdeaAddingBar
        onTextIdea={handleOpenModal('add', 'text', null)}
        onLinkIdea={handleOpenModal('add', 'link', null)}
        onImageIdea={handleOpenModal('add', 'image', null)} />
    </Fragment>
  )
}

IdeaMapCanvas.propTypes = {
  themeToggleModalShow: PropTypes.bool.isRequired,
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
  }).isRequired,
  loadGraphAction: PropTypes.func.isRequired,
  saveGraphAction: PropTypes.func.isRequired,
  updateGraphAction: PropTypes.func.isRequired,
  closeThemeToggleModal: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  graph: state.idea.graph,
  themeToggleModalShow: state.idea.themeToggleModalShow,
});

const mapDispatchToProps = {
  loadGraphAction: loadGraph,
  saveGraphAction: saveGraph,
  updateGraphAction: updateGraph,
  closeThemeToggleModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(IdeaMapCanvas);