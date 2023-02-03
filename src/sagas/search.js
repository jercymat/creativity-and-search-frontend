import { all, call, put } from "redux-saga/effects";
import {
  SM_SR2_ADD_TO_THEME_FAIL,
  SM_SR2_ADD_TO_THEME_SUCCESS,
  SM_SR2_EDIT_THEME_IDEA_FAIL,
  SM_SR2_EDIT_THEME_IDEA_SUCCESS,
  SM_SR2_LOAD,
  SM_SR2_LOAD_FAIL,
  SM_SR2_LOAD_SUCCESS,
  SM_SR2_RENAME_THEME_FAIL,
  SM_SR2_RENAME_THEME_SUCCESS,
  SM_SR_ADD_FAIL,
  SM_SR_ADD_SUCCESS,
  SM_SR_DELETE_FAIL,
  SM_SR_DELETE_SUCCESS,
  SM_SR_LOAD_FAIL,
  SM_SR_LOAD_SUCCESS,
  SM_SR_REORDER_FAIL,
  SM_SR_REORDER_SUCCESS,
} from "../actions/types/search";
import { addSavedResultAPI, addThemeIdeaAPI, addToThemeAPI, deleteSavedResultAPI, editThemeIdeaAPI, loadSavedResultAPI, loadSavedResultV2API, renameThemeAPI, reorderSavedResultAPI } from "../apis/search";
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
      yield all([
        put({ type: SM_SR_ADD_SUCCESS, payload: { newResult } }),
        put({ type: SM_SR2_LOAD }),
      ]);
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
      yield all([
        put({ type: SM_SR_DELETE_SUCCESS, payload: { id } }),
        put({ type: SM_SR2_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR_DELETE_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_DELETE_FAIL, payload: { error: error.toString() } });
  }
}

export function* smLoadSavedResultsV2() {
  console.log('load saved reuslts v2 saga');

  try {
    const response = yield call(loadSavedResultV2API);

    if (response.ret === 0) {
      const sr = response.relist
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
          noteID: theme.note.length !== 0
            ? theme.note[0].id
            : -1,
        }));
      const savedResults = [ sr[0] ].concat(
        sr
          .splice(1)
          // filter empty theme (will automatically delete empty theme in production)
          .filter(theme => theme.searchResultList.length !== 0)
      );
      
      yield put({ type: SM_SR2_LOAD_SUCCESS, payload: { savedResults } });
    } else {
      yield put({ type: SM_SR2_LOAD_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR2_LOAD_FAIL, payload: { error: error.toString() } });
  }
}

export function* smRenameTheme(action) {
  const data = action.payload;
  console.log('rename theme saga');

  try {
    const response = yield call(renameThemeAPI, data);

    if (response.ret === 0) {
      yield all([
        put({ type: SM_SR2_RENAME_THEME_SUCCESS }),
        put({ type: SM_SR2_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR2_RENAME_THEME_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR2_RENAME_THEME_FAIL, payload: { error: error.toString() } });
  }
}

export function* smEditThemeIdea(action) {
  const data = action.payload;
  console.log('edit theme idea saga');

  try {
    const response = data.noteID !== -1
      ? yield call(editThemeIdeaAPI, data)
      : yield call(addThemeIdeaAPI, data);

    if (response.ret === 0) {
      yield all([
        put({ type: SM_SR2_EDIT_THEME_IDEA_SUCCESS }),
        put({ type: SM_SR2_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR2_EDIT_THEME_IDEA_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR2_EDIT_THEME_IDEA_FAIL, payload: { error: error.toString() } });
  }
}

export function* smAddToTheme(action) {
  const data = action.payload;
  console.log('add to theme saga');

  try {
    const response = yield call(addToThemeAPI, data);
    
    if (response.ret === 0) {
      yield all([
        put({ type: SM_SR2_ADD_TO_THEME_SUCCESS }),
        put({ type: SM_SR2_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR2_ADD_TO_THEME_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR2_ADD_TO_THEME_FAIL, payload: { error: error.toString() } });
  }
}