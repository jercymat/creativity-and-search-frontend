import { IM_MODAL_THEME_TOGGLE_CLOSE, IM_MODAL_THEME_TOGGLE_OPEN, IM_UPDATE_GRAPH } from "./types/idea";

export const updateGraph = (graph) => ({
  type: IM_UPDATE_GRAPH,
  payload: { graph }
});

export const openThemeToggleModal = () => ({ type: IM_MODAL_THEME_TOGGLE_OPEN });
export const closeThemeToggleModal = () => ({ type: IM_MODAL_THEME_TOGGLE_CLOSE });