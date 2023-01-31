import axios from "axios";
import config from "../config";

const SEARCH_URL = config.api.HOST + '/searchresults';
const THEME_URL = config.api.HOST + '/groups';

export const addSavedResultAPI = data =>
  axios.post(SEARCH_URL, {
    action: 'add_searchresult',
    data
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const loadSavedResultAPI = () =>
  axios.post(SEARCH_URL, {
    action: 'list_searchresult'
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const reorderSavedResultAPI = newOrder =>
  axios.post(SEARCH_URL, {
    action: 'reorder_searchresult',
    data: newOrder
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const deleteSavedResultAPI = id =>
  axios.post(SEARCH_URL, {
    action: 'delete_searchresult',
    searchResultId: id
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const loadSavedResultV2API = () =>
  axios.post(THEME_URL, {
    action: "list_group",
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const renameThemeAPI = data =>
  axios.post(THEME_URL, {
    action: "modify_group",
    groupId: data.themeID,
    name: data.name,
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));