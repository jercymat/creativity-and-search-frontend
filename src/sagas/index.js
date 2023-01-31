import { all, takeEvery } from 'redux-saga/effects';
import { GLOBAL_LOGIN, GLOBAL_LOGOUT } from '../actions/types/global';
import {
  SM_SR2_LOAD,
  SM_SR2_RENAME_THEME,
  SM_SR_ADD,
  SM_SR_DELETE,
  SM_SR_LOAD,
  SM_SR_REORDER,
} from '../actions/types/search';
import { globalLogin, globalLogout } from './global';
import {
  smAddSavedResults,
  smDeleteSavedResults,
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
    takeEvery(SM_SR2_RENAME_THEME, smRenameTheme),
  ]);
}