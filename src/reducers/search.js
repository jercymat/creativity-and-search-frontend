import { SM_SET_BUFFERED_SEARCH, SM_UPDATE_SAVED_RESULTS } from "../actions/types/search";

const initialState = {
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
    return { ...state, bufferedSearch: payload.bufferedSearch }

  case SM_UPDATE_SAVED_RESULTS:
    return { ...state, savedResults: payload.savedResults }

  default:
    return state
  }
}

export default reducer;