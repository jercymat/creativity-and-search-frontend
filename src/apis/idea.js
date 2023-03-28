import axios from "axios";
import config from "../config";

const GRAPH_URL = config.api.HOST + '/graphs';

export const loadGraphAPI = () =>
  axios.post(GRAPH_URL, {
    action: 'list_graph'
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const saveGraphAPI = stringGraph =>
  axios.post(GRAPH_URL, {
    action: "modify_graph",
    id: 1,
    newdata: {
      name: "TestGraph",
      xml: stringGraph
    }
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));