import { call, put } from "redux-saga/effects";
import {
  SM_SR_LOAD_FAIL,
  SM_SR_LOAD_SUCCESS,
  SM_SR_REORDER_FAIL,
  SM_SR_REORDER_SUCCESS,
} from "../actions/types/search";
import { loadSavedResultAPI, reorderSavedResultAPI } from "../apis/search";
import { getCurrentTime } from "../utils";

export function* smLoadSavedResults() {
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