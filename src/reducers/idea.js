import { IM_MODAL_THEME_TOGGLE_CLOSE, IM_MODAL_THEME_TOGGLE_OPEN, IM_UPDATE_GRAPH } from "../actions/types/idea";

const initialState = {
  themeToggleModalShow: false,
  graph: {
    nodes: [],
    edges: []
  },
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case IM_UPDATE_GRAPH:
    return { ...state, graph: payload.graph }

  case IM_MODAL_THEME_TOGGLE_OPEN:
    return { ...state, themeToggleModalShow: true }

  case IM_MODAL_THEME_TOGGLE_CLOSE:
    return { ...state, themeToggleModalShow: false }

  default:
    return state
  }
}

export default reducer;