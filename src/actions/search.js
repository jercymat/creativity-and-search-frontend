import {
  SM_MSG_DIALOG_CLOSE,
  SM_MSG_DIALOG_FORM_THEME_OPEN,
  SM_SET_BUFFERED_SEARCH,
  SM_SR_ADD,
  SM_SR_DELETE,
  SM_SR_LOAD,
  SM_SR_REORDER,
  SM_TXT_DIALOG_ADD_IDEA_OPEN,
  SM_TXT_DIALOG_CLOSE,
  SM_TXT_DIALOG_RENAME_THEME_OPEN,
  SM_UPDATE_SAVED_RESULTS,
} from "./types/search";

export const updateBufferedSearch = (search) => ({
  type: SM_SET_BUFFERED_SEARCH,
  payload: { bufferedSearch: search }
});
export const updateSavedResults = (results) => ({
  type: SM_UPDATE_SAVED_RESULTS,
  payload: { savedResults: results }
});
export const addSavedResults = result => ({ type: SM_SR_ADD, payload: { result } });
export const loadSavedResults = () => ({ type: SM_SR_LOAD });
export const reorderSavedResults = newOrder => ({
  type: SM_SR_REORDER,
  payload: { newOrder }
});
export const deleteSavedResults = id => ({ type: SM_SR_DELETE, payload: { id } });

// dialog
export const openFormThemeMsgDialog = () => ({ type: SM_MSG_DIALOG_FORM_THEME_OPEN });
export const closeMessageDialog = () => ({ type: SM_MSG_DIALOG_CLOSE });
export const openAddIdeaDialog = () => ({ type: SM_TXT_DIALOG_ADD_IDEA_OPEN });
export const openRenameThemeDialog = () => ({ type: SM_TXT_DIALOG_RENAME_THEME_OPEN });
export const closeTextDialog = () => ({ type: SM_TXT_DIALOG_CLOSE });