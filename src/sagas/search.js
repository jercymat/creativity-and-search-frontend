import { all, call, put } from "redux-saga/effects";
import {
  SM_SR_CHANGE_THEME,
  SM_SR_CHANGE_THEME_FAIL,
  SM_SR_CHANGE_THEME_SUCCESS,
  SM_SR_CREATE_THEME_FAIL,
  SM_SR_DELETE_THEME_FAIL,
  SM_SR_DELETE_THEME_SUCCESS,
  SM_SR_EDIT_THEME_IDEA_FAIL,
  SM_SR_EDIT_THEME_IDEA_SUCCESS,
  SM_SR_LOAD,
  SM_SR_LOAD_FAIL,
  SM_SR_LOAD_SUCCESS,
  SM_SR_RENAME_THEME_FAIL,
  SM_SR_RENAME_THEME_SUCCESS,
  SM_SR_ADD_FAIL,
  SM_SR_ADD_SUCCESS,
  SM_SR_DELETE_FAIL,
  SM_SR_DELETE_SUCCESS,
  SM_TXT_DIALOG_CREATE_THEME_OPEN,
} from "../actions/types/search";
import {
  addSavedResultAPI,
  addThemeIdeaAPI,
  changeThemeAPI,
  createThemeAPI,
  deleteSavedResultAPI,
  deleteThemeAPI,
  editThemeIdeaAPI,
  loadSavedResultV2API,
  renameThemeAPI,
} from "../apis/search";

export function* smAddSavedResults(action) {
  const { result } = action.payload;
  const data = {
    name: result.title,
    url: result.url,
    snippet: result.desc
  };
  console.log('[saga] add result');

  try {
    const response = yield call(addSavedResultAPI, data);

    if (response.ret === 0) {
      const newResult = {
        id: response.searchResult_id.toString(),
        ...result
      }
      yield all([
        put({ type: SM_SR_ADD_SUCCESS, payload: { newResult } }),
        put({ type: SM_SR_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR_ADD_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_ADD_FAIL, payload: { error: error.toString() } });
  }
}

export function* smDeleteSavedResults(action) {
  const { id } = action.payload;
  console.log('[saga] delete saved results');

  try {
    const response = yield call(deleteSavedResultAPI, id);

    if (response.ret === 0) {
      yield all([
        put({ type: SM_SR_DELETE_SUCCESS, payload: { id } }),
        put({ type: SM_SR_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR_DELETE_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_DELETE_FAIL, payload: { error: error.toString() } });
  }
}

export function* smLoadSavedResults() {
  console.log('[saga] load saved reuslts');

  try {
    const response = yield call(loadSavedResultV2API);

    if (response.ret === 0) {
      const sr = response.relist
        .sort((a, b) => a.id - b.id)
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
      
      yield put({ type: SM_SR_LOAD_SUCCESS, payload: { savedResults } });
    } else {
      yield put({ type: SM_SR_LOAD_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_LOAD_FAIL, payload: { error: error.toString() } });
  }
}

export function* smRenameTheme(action) {
  const data = action.payload;
  console.log('[saga] rename search mapper theme');

  try {
    const response = yield call(renameThemeAPI, data);

    if (response.ret === 0) {
      yield all([
        put({ type: SM_SR_RENAME_THEME_SUCCESS }),
        put({ type: SM_SR_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR_RENAME_THEME_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_RENAME_THEME_FAIL, payload: { error: error.toString() } });
  }
}

export function* smEditThemeIdea(action) {
  const data = action.payload;
  console.log('[saga] edit search mapper theme idea');

  try {
    const response = data.noteID !== -1
      ? yield call(editThemeIdeaAPI, data)
      : yield call(addThemeIdeaAPI, data);

    if (response.ret === 0) {
      yield all([
        put({ type: SM_SR_EDIT_THEME_IDEA_SUCCESS }),
        put({ type: SM_SR_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR_EDIT_THEME_IDEA_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_EDIT_THEME_IDEA_FAIL, payload: { error: error.toString() } });
  }
}

export function* smChangeTheme(action) {
  const data = action.payload;
  console.log('[saga] add to search mapper theme');

  if (data.themeID === -1) {
    yield put({ type: SM_TXT_DIALOG_CREATE_THEME_OPEN });
    return;
  }

  try {
    const response = yield call(changeThemeAPI, data);
    
    if (response.ret === 0) {
      yield all([
        put({ type: SM_SR_CHANGE_THEME_SUCCESS }),
        put({ type: SM_SR_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR_CHANGE_THEME_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_CHANGE_THEME_FAIL, payload: { error: error.toString() } });
  }
}

export function* smCreateTheme(action) {
  console.log('[saga] create search mapper theme');
  const { name, resultID } = action.payload;

  try {
    const response = yield call(createThemeAPI, { name });

    if (response.ret === 0) {
      yield all([
        put({
          type: SM_SR_CHANGE_THEME, payload: {
            themeID: response.groupid,
            resultID,
          }
        }),
      ]);
    } else {
      yield put({ type: SM_SR_CREATE_THEME_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_CREATE_THEME_FAIL, payload: { error: error.toString() } });
  }
}

export function* smDeleteTheme(action) {
  console.log('[saga] delete search mapper theme');
  const { themeID } = action.payload;

  try {
    const response = yield call(deleteThemeAPI, { themeID });

    if (response.ret === 0) {
      yield all([
        put({ type: SM_SR_DELETE_THEME_SUCCESS }),
        put({ type: SM_SR_LOAD }),
      ]);
    } else {
      yield put({ type: SM_SR_DELETE_THEME_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: SM_SR_DELETE_THEME_FAIL, payload: { error: error.toString() } });
  }
}