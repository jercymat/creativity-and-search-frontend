import {
  IM_LOAD_GRAPH,
  IM_LOAD_GRAPH_FAIL,
  IM_LOAD_GRAPH_SUCCESS,
  IM_LOAD_PAGE,
  IM_LOAD_PAGE_FAIL,
  IM_LOAD_PAGE_SUCCESS,
  IM_MODAL_THEME_TOGGLE_CLOSE,
  IM_MODAL_THEME_TOGGLE_OPEN,
  IM_SAVE_GRAPH,
  IM_SAVE_GRAPH_FAIL,
  IM_SAVE_GRAPH_SUCCESS,
  IM_UPDATE_GRAPH,
} from "../actions/types/idea";

const initialState = {
  loading: false,
  themeToggleModalShow: false,
  graph: {
    nodes: [],
    edges: []
  },
  cachedGraph: {
    nodes: [],
    edges: []
  },
  themeToggle: [],
  focusedThemeID: -1,
}

// const toggle = [
//   {
//     id: 0,
//     shown: false,
//     noteShown: false,
//     colorScheme: '#F0F0F0'
//     sr: [
//       {
//         id: 1,
//         shown: false
//       },
//       {
//         id: 2,
//         shown: false
//       },
//     ]
//   }
// ]

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case IM_LOAD_PAGE:
  case IM_LOAD_GRAPH:
  case IM_SAVE_GRAPH:
    return { ...state, loading: true }

  case IM_LOAD_PAGE_SUCCESS:
    return {
      ...state,
      graph: payload.reflectedGraph,
      cachedGraph: payload.reflectedGraph,
      themeToggle: payload.themeToggle,
    }

  case IM_LOAD_GRAPH_SUCCESS:
    return {
      ...state,
      loading: false,
      graph: payload.graph,
      cachedGraph: payload.graph,
    }

  case IM_LOAD_PAGE_FAIL:
  case IM_LOAD_GRAPH_FAIL:
  case IM_SAVE_GRAPH_SUCCESS:
  case IM_SAVE_GRAPH_FAIL:
    return { ...state, loading: false }

  case IM_UPDATE_GRAPH:
    return { ...state, graph: payload.graph }

  case IM_MODAL_THEME_TOGGLE_OPEN:
    return {
      ...state,
      themeToggleModalShow: true,
      focusedThemeID: payload.themeID,
    }

  case IM_MODAL_THEME_TOGGLE_CLOSE:
    return { ...state, themeToggleModalShow: false }

  default:
    return state
  }
}

export default reducer;