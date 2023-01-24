import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import {
  SM_DIALOG_ADD_IDEA_CLOSE,
  SM_DIALOG_ADD_IDEA_OPEN,
  SM_SET_BUFFERED_SEARCH,
  SM_SR_LOAD,
  SM_SR_LOAD_FAIL,
  SM_SR_LOAD_SUCCESS,
  SM_SR_REORDER,
  SM_SR_REORDER_FAIL,
  SM_SR_REORDER_SUCCESS,
  SM_UPDATE_SAVED_RESULTS,
} from "../actions/types/search";

const initialState = {
  loading: false,
  submitting: false,
  bgLoading: false,
  addIdeaDialogShow: false,
  bufferedSearch: {
    results: [],
    q: '',
    page: 1,
    totalCount: 0
  },
  savedResults: [],  
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case SM_SET_BUFFERED_SEARCH:
    return { ...state, bufferedSearch: payload.bufferedSearch };

  case SM_UPDATE_SAVED_RESULTS:
    return { ...state, savedResults: payload.savedResults };

  case SM_SR_LOAD:
    return { ...state, loading: true };

  case SM_SR_REORDER:
    return { ...state, bgLoading: true };

  case SM_SR_LOAD_SUCCESS:
    return { ...state, loading: false, savedResults: payload.savedResults };

  case SM_SR_REORDER_SUCCESS:
    return { ...state, bgLoading: false };

  case SM_SR_LOAD_FAIL:
    return { ...state, loading: false };

  case SM_SR_REORDER_FAIL:
    return { ...state, bgLoading: false };

  // dialog

  case SM_DIALOG_ADD_IDEA_OPEN:
    return { ...state, addIdeaDialogShow: true }

  case SM_DIALOG_ADD_IDEA_CLOSE:
    return { ...state, addIdeaDialogShow: false }

  default:
    return state;
  }
};

export default reducer;