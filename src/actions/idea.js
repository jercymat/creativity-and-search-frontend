import {
  IM_LOAD_GRAPH,
  IM_LOAD_PAGE,
  IM_MODAL_THEME_TOGGLE_CLOSE,
  IM_MODAL_THEME_TOGGLE_OPEN,
  IM_SAVE_GRAPH,
  IM_UPDATE_GRAPH,
  IM_UPDATE_TOGGLE,
} from "./types/idea";

// overall page
export const loadPage = () => ({ type: IM_LOAD_PAGE });

// grpah save/load
export const loadGraph = () => ({ type: IM_LOAD_GRAPH });
export const saveGraph = searchMapperChanges => ({ type: IM_SAVE_GRAPH, payload: { searchMapperChanges } });

// graph local manipulation
export const updateToggle = (themeID, newToggle) => ({ type: IM_UPDATE_TOGGLE, payload: { themeID, newToggle } });

export const updateGraph = (graph) => ({
  type: IM_UPDATE_GRAPH,
  payload: { graph }
});

export const openThemeToggleModal = themeID => ({ type: IM_MODAL_THEME_TOGGLE_OPEN, payload: { themeID } });
export const closeThemeToggleModal = () => ({ type: IM_MODAL_THEME_TOGGLE_CLOSE });