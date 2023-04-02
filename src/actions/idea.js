import {
  IM_LOAD_GRAPH,
  IM_LOAD_PAGE,
  IM_MODAL_THEME_TOGGLE_CLOSE,
  IM_MODAL_THEME_TOGGLE_OPEN,
  IM_SAVE_GRAPH,
  IM_UPDATE_GRAPH,
} from "./types/idea";

// overall page
export const loadPage = () => ({ type: IM_LOAD_PAGE });

// grpah save/load
export const loadGraph = () => ({ type: IM_LOAD_GRAPH });
export const saveGraph = () => ({ type: IM_SAVE_GRAPH });

export const updateGraph = (graph) => ({
  type: IM_UPDATE_GRAPH,
  payload: { graph }
});

export const openThemeToggleModal = () => ({ type: IM_MODAL_THEME_TOGGLE_OPEN });
export const closeThemeToggleModal = () => ({ type: IM_MODAL_THEME_TOGGLE_CLOSE });