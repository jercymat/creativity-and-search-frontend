import { all, takeEvery } from 'redux-saga/effects';
import { GLOBAL_LOGIN, GLOBAL_LOGOUT } from '../actions/types/global';
import { IM_LOAD_GRAPH, IM_LOAD_PAGE, IM_SAVE_GRAPH, IM_UPDATE_TOGGLE } from '../actions/types/idea';
import {
  SM_SR2_CHANGE_THEME,
  SM_SR2_CREATE_THEME,
  SM_SR2_DELETE_THEME,
  SM_SR2_EDIT_THEME_IDEA,
  SM_SR2_LOAD,
  SM_SR2_RENAME_THEME,
  SM_SR_ADD,
  SM_SR_DELETE,
  SM_SR_LOAD,
  SM_SR_REORDER,
} from '../actions/types/search';
import { globalLogin, globalLogout } from './global';
import {
  ideaLoadGraph,
  ideaLoadPage,
  ideaSaveGraph,
  ideaUpdateToggle,
} from './idea';
import {
  smAddSavedResults,
  smChangeTheme,
  smCreateTheme,
  smDeleteSavedResults,
  smDeleteTheme,
  smEditThemeIdea,
  smLoadSavedResults,
  smLoadSavedResultsV2,
  smRenameTheme,
  smReorderSavedResults,
} from './search';

export default function* rootSaga() {
  yield all([
    // global
    takeEvery(GLOBAL_LOGIN, globalLogin),
    takeEvery(GLOBAL_LOGOUT, globalLogout),

    // search
    takeEvery(SM_SR_ADD, smAddSavedResults),
    takeEvery(SM_SR_LOAD, smLoadSavedResults),
    takeEvery(SM_SR_REORDER, smReorderSavedResults),
    takeEvery(SM_SR_DELETE, smDeleteSavedResults),
    takeEvery(SM_SR2_LOAD, smLoadSavedResultsV2),
    takeEvery(SM_SR2_CREATE_THEME, smCreateTheme),
    takeEvery(SM_SR2_RENAME_THEME, smRenameTheme),
    takeEvery(SM_SR2_DELETE_THEME, smDeleteTheme),
    takeEvery(SM_SR2_EDIT_THEME_IDEA, smEditThemeIdea),
    takeEvery(SM_SR2_CHANGE_THEME, smChangeTheme),

    // idea
    takeEvery(IM_LOAD_PAGE, ideaLoadPage),
    takeEvery(IM_LOAD_GRAPH, ideaLoadGraph),
    takeEvery(IM_SAVE_GRAPH, ideaSaveGraph),
    takeEvery(IM_UPDATE_TOGGLE, ideaUpdateToggle),
  ]);
}