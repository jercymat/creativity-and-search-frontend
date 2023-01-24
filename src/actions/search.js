import {
  SM_SET_BUFFERED_SEARCH,
  SM_SR_LOAD,
  SM_SR_REORDER,
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
export const loadSavedResults = () => ({ type: SM_SR_LOAD });
export const reorderSavedResults = newOrder => ({
  type: SM_SR_REORDER,
  payload: { newOrder }
});