import { call, put, select } from "redux-saga/effects";
import { IM_LOAD_GRAPH, IM_LOAD_GRAPH_FAIL, IM_LOAD_GRAPH_SUCCESS, IM_SAVE_GRAPH_FAIL, IM_SAVE_GRAPH_SUCCESS } from "../actions/types/idea";
import { loadGraphAPI, saveGraphAPI } from "../apis/idea";
import { getCurrentTime } from "../utils";

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