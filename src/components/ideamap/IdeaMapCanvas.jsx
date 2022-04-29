import { Fragment, useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  getConnectedEdges
} from 'react-flow-renderer';
import IdeaAddingBar from './IdeaAddingBar';
import IdeaModal from './IdeaModal';
import { createNodesAndEdges } from '../test';
import { IdeaMapperEdge } from './canvas/edge';
import { TextIdeaNode, LinkIdeaNode, ImageIdeaNode } from './canvas/node';
import { IdeaMapperConnection } from './canvas/connect';

// idea canvas
const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges();
const nodeTypes = { 
  text: TextIdeaNode,
  link: LinkIdeaNode,
  image: ImageIdeaNode
}
const edgeTypes = { idea_mapper_edge: IdeaMapperEdge }

function IdeaMapCanvas(props) {
  // idea adding modal
  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalEditNode, setModalEditNode] = useState(null);
  const [modalType, setModalType] = useState('text');

  // idea mapper canvas
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, type: 'idea_mapper_edge' }, eds)),
    [setEdges]
  );

  const onNodeDoubleClick = useCallback(
    (e, node) => {
      handleOpenModal('edit', node.type, node)();
    },
    [handleOpenModal]
  )

  const handleAddIdea = useCallback(
    (type, data, color) => {
      const newNode = {
        id: `${Date.now()}`,
        type: type,
        data: { ...data },
        position: {
          // x: (Math.random() - 0.5) * canvas.offsetWidth - 100,
          // y: (Math.random() - 0.5) * canvas.offsetHeight,
          x: -200,
          y: -100
        },
      };
      setNodes((nds) => nds.concat(newNode));

      setModalShow(false);
    }, [setModalShow, setNodes]
  )

  const handleUpdateIdea = useCallback(
    (data) => {
      setNodes(nodes =>
        nodes.map(node => {
          if (node.id === modalEditNode.id) {
            node.data = { ...data };
          }
          return node;
        })
      );
      setModalShow(false);
    }, [modalEditNode, setNodes]
  )

  const handleDeleteIdea = useCallback(
    () => {
      const edgesToRemove = getConnectedEdges([modalEditNode], edges).map(edge => edge.id);
      setNodes(nodes => nodes.filter(node => node.id !== modalEditNode.id));
      setEdges(edges => edges.filter(edge => !edgesToRemove.includes(edge.id)));
      setModalShow(false);
    }, [modalEditNode, edges, setModalShow, setNodes]
  );

  return (
    <Fragment>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={IdeaMapperConnection}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        minZoom='1'
        maxZoom='1'
        fitView>
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

export default IdeaMapCanvas;