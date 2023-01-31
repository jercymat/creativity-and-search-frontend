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
import { TextIdeaNode, LinkIdeaNode, ImageIdeaNode } from './canvas/node';
import { IdeaMapperConnection } from './canvas/connect';
import { useDebouncedCallback } from 'use-debounce';
import axios from 'axios';
import config from '../../config';
import { getCurrentTime } from '../../utils';
import { useTracking } from 'react-tracking';
import { getNodeSpawnPosition } from './canvas/CanvasUtil';
import { connect } from 'react-redux';
import { updateGraph } from '../../actions/idea';

// idea canvas
// const initialGraph = '{"nodes":[{"id":"node-1","type":"text","data":{"label":"Test Idea 1","color":"r"},"position":{"x":0,"y":0},"width":129,"height":44},{"id":"node-2","type":"text","data":{"label":"Test Idea 2","color":"p"},"position":{"x":200,"y":0},"width":131,"height":44},{"id":"node-3","type":"text","data":{"label":"Test Idea 3","color":"w"},"position":{"x":400,"y":0},"width":132,"height":44},{"id":"node-4","type":"text","data":{"label":"Test Idea 4","color":"w"},"position":{"x":0,"y":100},"width":132,"height":44},{"id":"node-5","type":"text","data":{"label":"Test Idea 5","color":"r"},"position":{"x":200,"y":100},"width":132,"height":44},{"id":"node-6","type":"text","data":{"label":"Test Idea 6","color":"g"},"position":{"x":400,"y":100},"width":132,"height":44},{"id":"node-7","type":"text","data":{"label":"Test Idea 7","color":"p"},"position":{"x":0,"y":200},"width":131,"height":44},{"id":"node-8","type":"text","data":{"label":"Test Idea 8","color":"r"},"position":{"x":200,"y":200},"width":132,"height":44},{"id":"node-9","type":"text","data":{"label":"Test Idea 9","color":"b"},"position":{"x":400,"y":200},"width":132,"height":44},{"id":"node-link-1","type":"link","data":{"link":"https://youtu.be/dQw4w9WgXcQ","color":"p"},"position":{"x":0,"y":300},"width":319,"height":46},{"id":"node-img-1","type":"image","data":{"img_url":"https://cdn.vox-cdn.com/thumbor/9j-s_MPUfWM4bWdZfPqxBxGkvlw=/1400x1050/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg","color":"g"},"position":{"x":0,"y":400},"width":166,"height":166},{"id":"node-img-2","type":"image","data":{"img_url":"https://i.imgur.com/Jvh1OQm.jpeg","color":"g"},"position":{"x":200,"y":400},"width":166,"height":166},{"id":"node-img-3","type":"image","data":{"img_url":"https://i.imgur.com/x62B7BA.png","color":"r"},"position":{"x":400,"y":400},"width":166,"height":166}],"edges":[{"id":"edge-1","source":"node-1","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-2","source":"node-2","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-3","source":"node-3","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-4","source":"node-4","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-6","source":"node-6","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-7","source":"node-7","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-8","source":"node-8","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-9","source":"node-9","target":"node-5","type":"idea_mapper_edge"}]}';
const nodeTypes = { 
  text: TextIdeaNode,
  link: LinkIdeaNode,
  image: ImageIdeaNode
}
const edgeTypes = { idea_mapper_edge: IdeaMapperEdge }

function IdeaMapCanvas(props) {
  const { graph, updateGraph } = props;
  const { trackEvent } = useTracking();

  // idea adding modal
  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalEditNode, setModalEditNode] = useState(null);
  const [modalType, setModalType] = useState('text');

  // idea mapper canvas
  const [fetched, setFetched] = useState(false);
  const [lastGraph, setLastGraph] = useState("");
  
  const saveGraphUtil = () => {
    const stringGraph = JSON.stringify(graph)

    // compare to last graph, if different then save to server
    if (lastGraph === stringGraph) return;

    axios.post(config.api.HOST + '/graphs', {
      action: "modify_graph",
      id: 1,
      newdata: {
        name: "TestGraph",
        xml: stringGraph
      }
    }, { withCredentials: true })
      .then(response => response.data.ret)
      .then(ret => {
        if (ret === 0) {
          console.log(`Graph successfully saved to server - ${getCurrentTime()}`);
          setLastGraph(stringGraph);
        }
      })
  }
  
  // load and save graph
  const saveGraph = useDebouncedCallback(saveGraphUtil, 250);

  const loadGraph = async () => {
    const response = await axios.post(config.api.HOST + '/graphs', {
      action: 'list_graph'
    }, { withCredentials: true });
    var stringGraph = response.data.relist[0].xml;
    console.log(`Graph successfully retrieved from server - ${getCurrentTime()}`);
    stringGraph = stringGraph === ''
      ? '{"nodes":[],"edges":[]}'
      : stringGraph;
    setLastGraph(stringGraph)
    return JSON.parse(stringGraph);
  }

  useEffect(() => {
    if (!fetched) {
      setFetched(true);
      loadGraph()
        .then(g => updateGraph(g));
    }

    return (() => {
      saveGraph();
    })
  }, [fetched, updateGraph, saveGraph]);

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
      updateGraph({
        nodes: applyNodeChanges(changes, graph.nodes) ,
        edges: graph.edges
      });
      saveGraph();
    },
    [saveGraph, updateGraph, graph]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      updateGraph({
        nodes: graph.nodes,
        edges: applyEdgeChanges(changes, graph.edges)
      });
      saveGraph();
    },
    [saveGraph, updateGraph, graph]
  );

  const onConnect = useCallback(
    (connection) => {
      updateGraph({
        nodes: graph.nodes,
        edges: addEdge({ ...connection, type: 'idea_mapper_edge' }, graph.edges)
      });
      saveGraph();
    },
    [saveGraph, updateGraph, graph]
  );

  // open idea editing modal after double click on ideas
  const onNodeDoubleClick = useCallback(
    (e, node) => {
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
      updateGraph({
        nodes: graph.nodes.map(node => ({ ...node, selected: false })).concat(newNode),
        edges: graph.edges
      });

      setModalShow(false);
    }, [setModalShow, updateGraph, graph]
  )

  const handleUpdateIdea = useCallback(
    (data) => {
      updateGraph({
        nodes: graph.nodes.map(node => {
          if (node.id === modalEditNode.id) {
            node.data = { ...data };
          }
          return node;
        }),
        edges: graph.edges
      });
      setModalShow(false);
    }, [modalEditNode, updateGraph, graph]
  )

  const handleDeleteIdea = useCallback(
    () => {
      const edgesToRemove = getConnectedEdges([modalEditNode], graph.edges).map(edge => edge.id);
      updateGraph({
        nodes: graph.nodes.filter(node => node.id !== modalEditNode.id),
        edges: graph.edges.filter(edge => !edgesToRemove.includes(edge.id))
      });
      setModalShow(false);
    }, [modalEditNode, setModalShow, updateGraph, graph]
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
      <IdeaAddingBar
        onTextIdea={handleOpenModal('add', 'text', null)}
        onLinkIdea={handleOpenModal('add', 'link', null)}
        onImageIdea={handleOpenModal('add', 'image', null)} />
    </Fragment>
  )
}

IdeaMapCanvas.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(IdeaMapCanvas);