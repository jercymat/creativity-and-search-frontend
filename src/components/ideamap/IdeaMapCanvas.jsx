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

// idea canvas
// const initialGraph = '{"nodes":[{"id":"node-1","type":"text","data":{"label":"Test Idea 1","color":"r"},"position":{"x":0,"y":0},"width":129,"height":44},{"id":"node-2","type":"text","data":{"label":"Test Idea 2","color":"p"},"position":{"x":200,"y":0},"width":131,"height":44},{"id":"node-3","type":"text","data":{"label":"Test Idea 3","color":"w"},"position":{"x":400,"y":0},"width":132,"height":44},{"id":"node-4","type":"text","data":{"label":"Test Idea 4","color":"w"},"position":{"x":0,"y":100},"width":132,"height":44},{"id":"node-5","type":"text","data":{"label":"Test Idea 5","color":"r"},"position":{"x":200,"y":100},"width":132,"height":44},{"id":"node-6","type":"text","data":{"label":"Test Idea 6","color":"g"},"position":{"x":400,"y":100},"width":132,"height":44},{"id":"node-7","type":"text","data":{"label":"Test Idea 7","color":"p"},"position":{"x":0,"y":200},"width":131,"height":44},{"id":"node-8","type":"text","data":{"label":"Test Idea 8","color":"r"},"position":{"x":200,"y":200},"width":132,"height":44},{"id":"node-9","type":"text","data":{"label":"Test Idea 9","color":"b"},"position":{"x":400,"y":200},"width":132,"height":44},{"id":"node-link-1","type":"link","data":{"link":"https://youtu.be/dQw4w9WgXcQ","color":"p"},"position":{"x":0,"y":300},"width":319,"height":46},{"id":"node-img-1","type":"image","data":{"img_url":"https://cdn.vox-cdn.com/thumbor/9j-s_MPUfWM4bWdZfPqxBxGkvlw=/1400x1050/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg","color":"g"},"position":{"x":0,"y":400},"width":166,"height":166},{"id":"node-img-2","type":"image","data":{"img_url":"https://i.imgur.com/Jvh1OQm.jpeg","color":"g"},"position":{"x":200,"y":400},"width":166,"height":166},{"id":"node-img-3","type":"image","data":{"img_url":"https://i.imgur.com/x62B7BA.png","color":"r"},"position":{"x":400,"y":400},"width":166,"height":166}],"edges":[{"id":"edge-1","source":"node-1","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-2","source":"node-2","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-3","source":"node-3","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-4","source":"node-4","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-6","source":"node-6","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-7","source":"node-7","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-8","source":"node-8","target":"node-5","type":"idea_mapper_edge"},{"id":"edge-9","source":"node-9","target":"node-5","type":"idea_mapper_edge"}]}';
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
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // load and save graph
  const saveGraph = useDebouncedCallback(() => {
    const rawGraph = { nodes: nodes, edges: edges };
    const stringGraph = JSON.stringify(rawGraph)
    window.localStorage.clear('graph');

    axios.post(config.api.HOST + '/graphs', {
      action: "modify_graph",
      id: 1,
      newdata: {
        name: "TestGraph",
        xml: stringGraph
      }
    })
      .then(response => response.data.ret)
      .then(ret => {
        if (ret === 0) {
          console.log(`Graph successfully saved to server - ${getCurrentTime()}`);
        }
      })
  }, 2000);

  const loadGraph = () => {
    return axios.post(config.api.HOST + '/graphs', {
      action: 'list_graph'
    })
      .then(response => response.data.relist)
      .then(list => {
        var stringGraph = list[0].xml;
        if (stringGraph === '') stringGraph = '{"nodes":[],"edges":[]}';
        console.log(`Graph successfully retrieved from server - ${getCurrentTime()}`);
        return JSON.parse(stringGraph);
      });
  }

  useEffect(() => {
    loadGraph()
      .then(graph => {
        setNodes(graph.nodes);
        setEdges(graph.edges);
      })
  }, []);

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
      saveGraph();
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [setNodes, saveGraph]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      saveGraph();
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges, saveGraph]
  );

  const onConnect = useCallback(
    (connection) => {
      saveGraph();
      setEdges((eds) => addEdge({ ...connection, type: 'idea_mapper_edge' }, eds));
    },
    [setEdges, saveGraph]
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
        data: { ...data },
        position: {
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