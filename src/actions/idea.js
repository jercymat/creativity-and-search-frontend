import { IM_UPDATE_GRAPH } from "./types/idea";

export const updateGraph = (graph) => ({
  type: IM_UPDATE_GRAPH,
  payload: { graph }
});