import { call, put } from "redux-saga/effects";
import {
  SM_SR2_LOAD_FAIL,
  SM_SR2_LOAD_SUCCESS,
  SM_SR_ADD_FAIL,
  SM_SR_ADD_SUCCESS,
  SM_SR_DELETE_FAIL,
  SM_SR_DELETE_SUCCESS,
  SM_SR_LOAD_FAIL,
  SM_SR_LOAD_SUCCESS,
  SM_SR_REORDER_FAIL,
  SM_SR_REORDER_SUCCESS,
} from "../actions/types/search";
import { addSavedResultAPI, deleteSavedResultAPI, loadSavedResultAPI, loadSavedResultV2API, reorderSavedResultAPI } from "../apis/search";
import { getCurrentTime } from "../utils";

export function* smAddSavedResults(action) {
  const { result } = action.payload;
  const data = {
    name: result.title,
    url: result.url,
    snippet: result.desc
  };
  console.log('add result saga');

  try {
    const response = yield call(addSavedResultAPI, data);

    if (response.ret === 0) {
      const newResult = {
        id: response.searchResult_id.toString(),
        ...result
      }
      yield put({ type: SM_SR_ADD_SUCCESS, payload: { newResult } });
    } else {
      yield put({ type: SM_SR_ADD_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_ADD_FAIL, payload: { error: error.toString() } });
  }
}

export function* smLoadSavedResults() {
  console.log('load saved results saga');
  try {
    const response = yield call(loadSavedResultAPI);

    if (response.ret === 0) {
      const savedResults = response.relist.map(saved => ({
        id: saved.id.toString(),
        title: saved.name,
        url: saved.url,
        desc: saved.snippet
      }));

      yield put({ type: SM_SR_LOAD_SUCCESS, payload: { savedResults } });
    } else {
      yield put({ type: SM_SR_LOAD_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_LOAD_FAIL, payload: { error: error.toString() } });
  }
}

export function* smReorderSavedResults(action) {
  const { newOrder } = action.payload;
  console.log('reorder saga')

  try {
    const response = yield call(reorderSavedResultAPI, newOrder);

    if (response.ret === 0) {
      console.log(`Graph successfully saved to server - ${getCurrentTime()}`);
      yield put({ type: SM_SR_REORDER_SUCCESS });
    } else {
      yield put({ type: SM_SR_REORDER_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_REORDER_FAIL, payload: { error: error.toString() } });
  }
}

export function* smDeleteSavedResults(action) {
  const { id } = action.payload;
  console.log('delete saga');

  try {
    const response = yield call(deleteSavedResultAPI, id);

    if (response.ret === 0) {
      yield put({ type: SM_SR_DELETE_SUCCESS, payload: { id } });
    } else {
      yield put({ type: SM_SR_DELETE_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_DELETE_FAIL, payload: { error: error.toString() } });
  }
}

export function* smLoadSavedResultsV2() {
  console.log('load saved reuslts v2 saga2');

  try {
    const response = yield call(loadSavedResultV2API);

    if (response.ret === 0) {
      const savedResults = response.relist
        // filter empty theme (will automatically delete empty theme in production)
        .filter(theme => theme.searchResultList.length !== 0)
        .map(theme => ({
          ...theme,
          searchResultList: theme.searchResultList.map(saved => ({
            id: saved.id,
            title: saved.name,
            url: saved.url,
            desc: saved.snippet
          })),
          note: theme.note.length !== 0
            ? theme.note[0].title
            : '',
        }));

      console.log(savedResults);

      yield put({ type: SM_SR2_LOAD_SUCCESS, payload: { savedResults } });
    } else {
      yield put({ type: SM_SR2_LOAD_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR2_LOAD_FAIL, payload: { error: error.toString() } });
  }
}