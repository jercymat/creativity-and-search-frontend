import axios from "axios";
import config from "../config";

const BASE_URL = config.api.HOST + '/searchresults';

export const loadSavedResultAPI = () =>
  axios.post(BASE_URL, {
    action: 'list_searchresult'
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const reorderSavedResultAPI = newOrder =>
  axios.post(BASE_URL, {
    action: 'reorder_searchresult',
    data: newOrder
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));