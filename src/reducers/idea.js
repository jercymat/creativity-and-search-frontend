import { IM_UPDATE_GRAPH } from "../actions/types/idea";

const initialState = {
  graph: {
    nodes: [],
    edges: []
  },
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case IM_UPDATE_GRAPH:
    return { ...state, graph: payload.graph }

  default:
    return state
  }
}

export default reducer;