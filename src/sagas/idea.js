import { call, put, select } from "redux-saga/effects";
import { IM_LOAD_GRAPH, IM_LOAD_GRAPH_FAIL, IM_LOAD_GRAPH_SUCCESS, IM_LOAD_PAGE, IM_LOAD_PAGE_SUCCESS, IM_SAVE_GRAPH, IM_SAVE_GRAPH_FAIL, IM_SAVE_GRAPH_SUCCESS, IM_UPDATE_GRAPH } from "../actions/types/idea";
import { loadGraphAPI, saveGraphAPI } from "../apis/idea";
import { getNodeSpawnPosition } from "../components/idea-mapper/util/canvas";
import { themeColorScheme } from "../components/idea-mapper/util/color-picker";
import { getCurrentTime } from "../utils";
import { smLoadSavedResultsV2 } from "./search";

export function* ideaLoadPage() {
  console.log('[saga] load whole IdeaMapper page');

  // laod SearchMapper results and IdeaMapper graph first
  yield* smLoadSavedResultsV2();
  yield* ideaLoadGraph();

  const sr = yield select(state => state.search.savedResultsV2);
  const graph = yield select(state => state.idea.graph);

  // --- reflect changes of SearchMapper to graph ---
  const reflectedGraph = {}

  // remove theme, sr, and note ideas of deleted theme
  const themeIDs = sr.slice(1).map(theme => theme.id);

  reflectedGraph.nodes = graph.nodes.filter(node => {
    if (node.id.includes('sm-theme')) {
      return themeIDs.includes(node.data.theme_id);
    } else return true;
  });
  reflectedGraph.edges = graph.edges.filter(edge => {
    if (edge.id.includes('sm-edge')) {
      return themeIDs.some(id => edge.id.includes(`sm-edge_sm-theme-${id}`));
    } else return true;
  });

  // remove deleted sr
  const savedResultIDs = sr.slice(1)
    .map(theme => theme.searchResultList)
    .flat()
    .map(sr => sr.id);

  reflectedGraph.nodes = reflectedGraph.nodes.filter(node => {
    if (node.id.includes('result')) {
      return savedResultIDs.includes(node.data.result_id);
    } else return true;
  });

  reflectedGraph.edges = reflectedGraph.edges.filter(edge => {
    if (edge.id.includes('result')) {
      return savedResultIDs.some(id => edge.id.includes(`result-${id}`));
    } else return true;
  })

  // if no themed results, no need to construct toggle list
  if (sr.length <= 1) {
    yield put({ type: IM_LOAD_PAGE_SUCCESS, payload: { themeToggle: [], reflectedGraph } });
    return;
  }

  // construct toggle list
  const smIdeas = graph.nodes.filter(node => node.id.includes('sm-theme'));
  const themeToggle = sr.slice(1).map(theme => ({
    id: theme.id,
    name: theme.name,
    note: theme.note,
    shown: smIdeas.some(idea => idea.id === `sm-theme-${theme.id}`),
    noteShown: smIdeas.some(idea => idea.id === `sm-theme-${theme.id}-note`),
    colorScheme: graph.nodes.find(node => node.id === `sm-theme-${theme.id}`) ? graph.nodes.find(node => node.id === `sm-theme-${theme.id}`).data.colorHex : '#F0F0F0',
    sr: theme.searchResultList.map(result => ({
      id: result.id,
      shown: smIdeas.some(idea => idea.id === `sm-theme-${theme.id}-result-${result.id}`),
    }))
  }));

  // update theme name, theme note
  themeToggle.forEach(theme => {
    if (theme.shown) {
      const themeNodeIndex = reflectedGraph.nodes.findIndex(node => node.id === `sm-theme-${theme.id}`);

      reflectedGraph.nodes[themeNodeIndex] = {
        ...reflectedGraph.nodes[themeNodeIndex],
        data: {
          ...reflectedGraph.nodes[themeNodeIndex].data,
          note_shown: theme.noteShown,
          shown_sr: theme.sr.reduce((total, sr) => (sr.shown ? total + 1 : total), 0),
          title: theme.name,
          total_sr: theme.sr.length,
        },
      };
    }

    if (theme.noteShown) {
      const themeNoteNodeIndex = reflectedGraph.nodes.findIndex(node => node.id === `sm-theme-${theme.id}-note`);
      reflectedGraph.nodes[themeNoteNodeIndex] = {
        ...reflectedGraph.nodes[themeNoteNodeIndex],
        data: {
          ...reflectedGraph.nodes[themeNoteNodeIndex].data,
          label: theme.note,
        },
      };
    }
  });

  yield put({ type: IM_LOAD_PAGE_SUCCESS, payload: { themeToggle, reflectedGraph } });
}

export function* ideaLoadGraph() {
  console.log('[saga] load IdeaMapper graph');

  try {
    const response = yield call(loadGraphAPI);

    if (response.ret === 0) {
      const stringGraph = response.relist[0].xml === ''
        ? '{"nodes":[],"edges":[]}'
        : response.relist[0].xml;
      console.log(`Graph successfully retrieved from server - ${getCurrentTime()}`);
      yield put({ type: IM_LOAD_GRAPH_SUCCESS, payload: { graph: JSON.parse(stringGraph) } });
    } else {
      yield put({ type: IM_LOAD_GRAPH_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: IM_LOAD_GRAPH_FAIL, payload: { error: error.toString() } });
  } 
}

export function* ideaSaveGraph(action) {
  const { searchMapperChanges } = action.payload;
  console.log(`[saga] save IdeaMapper graph with search mapper changes: ${searchMapperChanges}`);

  const { graph, cachedGraph } = yield select(state => state.idea);
  const stringGraph = JSON.stringify(graph);
  const stringCachedGraph = JSON.stringify(cachedGraph);

  // compare to cached graph, if the same then stop saving to server
  if (stringGraph === stringCachedGraph) {
    yield put({ type: IM_SAVE_GRAPH_SUCCESS });
    return;
  }

  try {
    const response = yield call(saveGraphAPI, stringGraph);

    if (response.ret === 0) {
      console.log(`Graph successfully saved to server - ${getCurrentTime()}`);
      yield put({ type: IM_SAVE_GRAPH_SUCCESS });

      if (searchMapperChanges) {
        yield put({ type: IM_LOAD_PAGE });
      } else yield put({ type: IM_LOAD_GRAPH });
    } else {
      yield put({ type: IM_SAVE_GRAPH_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: IM_SAVE_GRAPH_FAIL, payload: { error: error.toString() } });
  }
}

export function* ideaUpdateToggle(action) {
  const { themeID, newToggle } = action.payload;
  console.log('[saga] update toggle');

  const sr = yield select(state => state.search.savedResultsV2);
  const oldGraph = yield select(state => state.idea.graph);
  const toggles = yield select(state => state.idea.themeToggle);

  const theme = sr.find(theme => theme.id === themeID);
  const oldToggle = toggles.find(theme => theme.id === themeID);
  const newGraph = { nodes: [ ...oldGraph.nodes ], edges: [ ...oldGraph.edges ] };

  // if theme deleted, delete all nodes and edges
  if (!newToggle.shown) {
    newGraph.nodes = newGraph.nodes.filter(node => !node.id.includes(`sm-theme-${theme.id}`));
    newGraph.edges = newGraph.edges.filter(edge => !edge.id.includes(`sm-edge_sm-theme-${theme.id}`));

    // push to server and trigger load whole page
    yield put({ type: IM_UPDATE_GRAPH, payload: { graph: newGraph } });
    yield put({ type: IM_SAVE_GRAPH, payload: { searchMapperChanges: true } });
    return;
  }

  // deal with saved results
  newToggle.sr.forEach((sr, idx) => {
    if (sr.shown === oldToggle.sr[idx].shown) return;

    // create/remove nodes and edges for the toggled result
    const result = theme.searchResultList.find(r => r.id === sr.id);
    if (sr.shown) {
      newGraph.nodes.push({
        id: `sm-theme-${theme.id}-result-${result.id}`,
        type: 'sm_result',
        selected: false,
        data: {
          theme_id: theme.id,
          result_id: result.id,
          title: result.title,
          url: result.url,
          desc: result.desc,
          colorHex: themeColorScheme[newToggle.colorScheme],
        },
        position: getNodeSpawnPosition(newGraph.nodes),
      });

      newGraph.edges.push({
        id: `sm-edge_sm-theme-${theme.id}_sm-theme-${theme.id}-result-${result.id}`,
        source: `sm-theme-${theme.id}`,
        sourceHandle: null,
        target: `sm-theme-${theme.id}-result-${result.id}`,
        targetHandle: null,
        type: "idea_mapper_edge",
      });
    } else {
      newGraph.nodes = newGraph.nodes.filter(node => node.id !== `sm-theme-${theme.id}-result-${result.id}`);
      newGraph.edges = newGraph.edges.filter(edge => edge.id !== `sm-edge_sm-theme-${theme.id}_sm-theme-${theme.id}-result-${result.id}`);
    }
  });

  // deal with note
  if (newToggle.noteShown !== oldToggle.noteShown) {

    // create/remove nodes and edges for the toggled note
    if (newToggle.noteShown) {
      newGraph.nodes.push({
        id: `sm-theme-${theme.id}-note`,
        type: 'sm_note',
        selected: false,
        data: {
          theme_id: theme.id,
          label: theme.note,
          colorHex: themeColorScheme[newToggle.colorScheme],
        },
        position: getNodeSpawnPosition(newGraph.nodes),
      });

      newGraph.edges.push({
        id: `sm-edge_sm-theme-${theme.id}_sm-theme-${theme.id}-note`,
        source: `sm-theme-${theme.id}`,
        sourceHandle: null,
        target: `sm-theme-${theme.id}-note`,
        targetHandle: null,
        type: "idea_mapper_edge",
      });
    } else {
      newGraph.nodes = newGraph.nodes.filter(node => node.id !== `sm-theme-${theme.id}-note`);
      newGraph.edges = newGraph.edges.filter(edge => edge.id !== `sm-edge_sm-theme-${theme.id}_sm-theme-${theme.id}-note`);
    }
  }

  // update theme color scheme
  if (newToggle.colorScheme !== oldToggle.colorScheme) {
    // update theme nodes
    const themeNode = newGraph.nodes.find(node => node.id === `sm-theme-${theme.id}`);
    newGraph.nodes = newGraph.nodes
      .filter(node => node.id !== `sm-theme-${theme.id}`)
      .concat({
        ...themeNode,
        data: {
          ...themeNode.data,
          colorHex: newToggle.colorScheme,
        },
      });

    // update sr nodes
    const resultNodes = newGraph.nodes.filter(node => node.id.includes(`sm-theme-${theme.id}-result-`));
    newGraph.nodes = newGraph.nodes
      .filter(node => !node.id.includes(`sm-theme-${theme.id}-result-`))
      .concat(resultNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          colorHex: themeColorScheme[newToggle.colorScheme],
        }
      })));

    // update note nodes
    const noteNode = newGraph.nodes.find(node => node.id === `sm-theme-${theme.id}-note`);
    if (noteNode) {
      newGraph.nodes = newGraph.nodes
        .filter(node => node.id !== `sm-theme-${theme.id}-note`)
        .concat({
          ...noteNode,
          data: {
            ...noteNode.data,
            colorHex: themeColorScheme[newToggle.colorScheme],
          }
        });
    }
  }

  // push to server and trigger load whole page
  yield put({ type: IM_UPDATE_GRAPH, payload: { graph: newGraph } });
  yield put({ type: IM_SAVE_GRAPH, payload: { searchMapperChanges: true } });
}