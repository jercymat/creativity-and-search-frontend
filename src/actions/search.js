import {
  SM_MSG_DIALOG_CLOSE,
  SM_MSG_DIALOG_FORM_THEME_OPEN,
  SM_SET_BUFFERED_SEARCH,
  SM_SR_CHANGE_THEME,
  SM_SR_EDIT_THEME_IDEA,
  SM_SR_LOAD,
  SM_SR_RENAME_THEME,
  SM_SR_ADD,
  SM_SR_DELETE,
  SM_THEME_DIALOG_ADD_OPEN,
  SM_THEME_DIALOG_CLOSE,
  SM_THEME_DIALOG_MOVE_OPEN,
  SM_TXT_DIALOG_ADD_IDEA_OPEN,
  SM_TXT_DIALOG_CREATE_THEME_OPEN,
  SM_TXT_DIALOG_CLOSE,
  SM_TXT_DIALOG_EDIT_IDEA_OPEN,
  SM_TXT_DIALOG_RENAME_THEME_OPEN,
  SM_SR_CREATE_THEME,
  SM_MSG_DIALOG_DELETE_THEME_OPEN,
  SM_SR_DELETE_THEME,
} from "./types/search";


// search engine
export const updateBufferedSearch = (search) => ({
  type: SM_SET_BUFFERED_SEARCH,
  payload: { bufferedSearch: search }
});

// search mapper
export const loadSavedResults = () => ({ type: SM_SR_LOAD });
export const addSavedResults = result => ({ type: SM_SR_ADD, payload: { result } });
export const deleteSavedResults = id => ({ type: SM_SR_DELETE, payload: { id } });
export const renameTheme = (themeID, name) => ({ type: SM_SR_RENAME_THEME, payload: { themeID, name } });
export const editThemeIdea = (themeID, noteID, content) => ({ type: SM_SR_EDIT_THEME_IDEA, payload: { themeID, noteID, content } });
export const createTheme = (name, resultID) => ({ type: SM_SR_CREATE_THEME, payload: { name, resultID } });
export const changeTheme = (themeID, resultID) => ({ type: SM_SR_CHANGE_THEME, payload: { themeID, resultID } });
export const deleteTheme = themeID => ({ type: SM_SR_DELETE_THEME, payload: { themeID } });

// dialogs
export const openFormThemeMsgDialog = () => ({ type: SM_MSG_DIALOG_FORM_THEME_OPEN });
export const openDeleteThemeMsgDialog = () => ({ type: SM_MSG_DIALOG_DELETE_THEME_OPEN });
export const closeMessageDialog = () => ({ type: SM_MSG_DIALOG_CLOSE });
export const openAddIdeaDialog = () => ({ type: SM_TXT_DIALOG_ADD_IDEA_OPEN });
export const openEditIdeaDialog = themeID => ({ type: SM_TXT_DIALOG_EDIT_IDEA_OPEN, payload: { themeID } });
export const openCreateThemeDialog = () => ({ type: SM_TXT_DIALOG_CREATE_THEME_OPEN });
export const openRenameThemeDialog = themeID => ({ type: SM_TXT_DIALOG_RENAME_THEME_OPEN, payload: { themeID } });
export const closeTextDialog = () => ({ type: SM_TXT_DIALOG_CLOSE });
export const openAddThemeDialog = (fromThemeID, resultID) => ({ type: SM_THEME_DIALOG_ADD_OPEN, payload: { resultID, fromThemeID } });
export const openMoveThemeDialog = (fromThemeID, resultID) => ({ type: SM_THEME_DIALOG_MOVE_OPEN, payload: { resultID, fromThemeID } });
export const closeThemeDialog = () => ({ type: SM_THEME_DIALOG_CLOSE });