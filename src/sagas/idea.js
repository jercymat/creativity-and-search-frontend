import { call, put, select } from "redux-saga/effects";
import { IM_LOAD_GRAPH, IM_LOAD_GRAPH_FAIL, IM_LOAD_GRAPH_SUCCESS, IM_LOAD_PAGE_SUCCESS, IM_SAVE_GRAPH_FAIL, IM_SAVE_GRAPH_SUCCESS } from "../actions/types/idea";
import { loadGraphAPI, saveGraphAPI } from "../apis/idea";
import { getCurrentTime } from "../utils";
import { smLoadSavedResultsV2 } from "./search";

export function* ideaLoadPage() {
  console.log('load whole IdeaMapper page saga');

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
    yield put({ type: IM_LOAD_PAGE_SUCCESS, payload: { themeToggle: [], reflectedGraph: graph } });
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
  console.log('load IdeaMapper graph saga');

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

export function* ideaSaveGraph() {
  console.log('save IdeaMapper graph saga');

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
      yield put({ type: IM_LOAD_GRAPH });
    } else {
      yield put({ type: IM_SAVE_GRAPH_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: IM_SAVE_GRAPH_FAIL, payload: { error: error.toString() } });
  }
} 