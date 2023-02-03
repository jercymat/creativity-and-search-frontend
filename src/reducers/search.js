import {
  SM_MSG_DIALOG_CLOSE,
  SM_MSG_DIALOG_FORM_THEME_OPEN,
  SM_SET_BUFFERED_SEARCH,
  SM_SR2_EDIT_THEME_IDEA,
  SM_SR2_EDIT_THEME_IDEA_FAIL,
  SM_SR2_EDIT_THEME_IDEA_SUCCESS,
  SM_SR2_LOAD,
  SM_SR2_LOAD_FAIL,
  SM_SR2_LOAD_SUCCESS,
  SM_SR2_RENAME_THEME,
  SM_SR2_RENAME_THEME_FAIL,
  SM_SR2_RENAME_THEME_SUCCESS,
  SM_SR_ADD,
  SM_SR_ADD_FAIL,
  SM_SR_ADD_SUCCESS,
  SM_SR_DELETE,
  SM_SR_DELETE_FAIL,
  SM_SR_DELETE_SUCCESS,
  SM_SR_LOAD,
  SM_SR_LOAD_FAIL,
  SM_SR_LOAD_SUCCESS,
  SM_SR_REORDER,
  SM_SR_REORDER_FAIL,
  SM_SR_REORDER_SUCCESS,
  SM_THEME_DIALOG_ADD_OPEN,
  SM_THEME_DIALOG_CLOSE,
  SM_THEME_DIALOG_MOVE_OPEN,
  SM_TXT_DIALOG_ADD_IDEA_OPEN,
  SM_TXT_DIALOG_CLOSE,
  SM_TXT_DIALOG_EDIT_IDEA_OPEN,
  SM_TXT_DIALOG_RENAME_THEME_OPEN,
  SM_UPDATE_SAVED_RESULTS,
} from "../actions/types/search";

const initialState = {
  loading: false,
  submitting: false,
  bgLoading: false,

  // focus
  currentFocusTheme: -1,
  currentFocusResult: -1,

  // dialogs
  messageDialogShow: false,
  messageContent: {
    title: '',
    content: '',
    cancelText: '',
    confirmText: '',
  },
  textDialogShow: false,
  textDialogMode: 'add-idea',
  themeDialogShow: false,
  themeDialogMode: 'add',

  // other data
  bufferedSearch: {
    results: [],
    q: '',
    page: 1,
    totalCount: 0
  },
  savedResults: [],
  savedResultsV2: [{
    id: -1,
    searchResultList: [],
  }],
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case SM_SET_BUFFERED_SEARCH:
    return { ...state, bufferedSearch: payload.bufferedSearch };

  case SM_UPDATE_SAVED_RESULTS:
    return { ...state, savedResults: payload.savedResults };

  case SM_SR_ADD:
  case SM_SR_LOAD:
  case SM_SR_DELETE:
  case SM_SR2_LOAD:
  case SM_SR2_RENAME_THEME:
  case SM_SR2_EDIT_THEME_IDEA:
    return { ...state, loading: true };

  case SM_SR_REORDER:
    return { ...state, bgLoading: true };

  case SM_SR_ADD_SUCCESS:
    return {
      ...state,
      loading: false,
      savedResults: [...state.savedResults, payload.newResult]
    };

  case SM_SR_LOAD_SUCCESS:
    return { ...state, loading: false, savedResults: payload.savedResults };

  case SM_SR_DELETE_SUCCESS:
    return {
      ...state,
      loading: false,
      savedResults: state.savedResults.filter(save => save.id !== payload.id)
    };

  case SM_SR_REORDER_SUCCESS:
    return { ...state, bgLoading: false };

  case SM_SR2_LOAD_SUCCESS:
    return { ...state, loading: false, savedResultsV2: payload.savedResults };

  case SM_SR2_RENAME_THEME_SUCCESS:
  case SM_SR2_EDIT_THEME_IDEA_SUCCESS:
    return { ...state, loading: false };

  case SM_SR_ADD_FAIL:
  case SM_SR_LOAD_FAIL:
  case SM_SR_DELETE_FAIL:
  case SM_SR2_LOAD_FAIL:
  case SM_SR2_RENAME_THEME_FAIL:
  case SM_SR2_EDIT_THEME_IDEA_FAIL:
    return { ...state, loading: false };

  case SM_SR_REORDER_FAIL:
    return { ...state, bgLoading: false };

  // dialog
  case SM_MSG_DIALOG_FORM_THEME_OPEN:
    return {
      ...state,
      messageDialogShow: true,
      messageContent: {
        title: 'Forming a Theme',
        content: 'Saved Results can be adding notes after forming a theme.',
        cancelText: 'Cancel',
        confirmText: 'Form a Theme',
      }
    };

  case SM_MSG_DIALOG_CLOSE:
    return { ...state, messageDialogShow: false };

  case SM_TXT_DIALOG_ADD_IDEA_OPEN:
    return {
      ...state,
      textDialogShow: true,
      textDialogMode: 'add-idea',
    };

  case SM_TXT_DIALOG_EDIT_IDEA_OPEN:
    return {
      ...state,
      textDialogShow: true,
      textDialogMode: 'edit-idea',
      currentFocusTheme: payload.themeID,
    };

  case SM_TXT_DIALOG_RENAME_THEME_OPEN:
    return {
      ...state,
      textDialogShow: true,
      textDialogMode: 'rename-theme',
      currentFocusTheme: payload.themeID,
    };

  case SM_TXT_DIALOG_CLOSE:
    return { ...state, textDialogShow: false };

  case SM_THEME_DIALOG_ADD_OPEN:
    return {
      ...state,
      themeDialogShow: true,
      themeDialogMode: 'add',
      currentFocusResult: payload.resultID,
    };

  case SM_THEME_DIALOG_MOVE_OPEN:
    return {
      ...state,
      themeDialogShow: true,
      themeDialogMode: 'move',
      currentFocusResult: payload.resultID,
      currentFocusTheme: payload.fromThemeID,
    };

  case SM_THEME_DIALOG_CLOSE:
    return { ...state, themeDialogShow: false };

  default:
    return state;
  }
};

export default reducer;