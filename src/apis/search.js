import axios from "axios";
import config from "../config";

const SEARCH_URL = config.api.HOST + '/searchresults';
const THEME_URL = config.api.HOST + '/groups';
const NOTE_URL = config.api.HOST + '/notes';

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

export const editThemeIdeaAPI = data =>
  axios.post(NOTE_URL, {
    action: "modify_note",
    noteId: data.noteID,
    groupId: data.themeID,
    title: data.content,
    content: '',
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const addThemeIdeaAPI = data =>
  axios.post(NOTE_URL, {
    action: "add_note",
    groupId: data.themeID,
    title: data.content,
    content: '',
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const changeThemeAPI = data =>
  axios.post(SEARCH_URL, {
    action: "change_group",
    searchResultId: data.resultID,
    groupId: data.themeID,
    content: '',
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const createThemeAPI = data =>
  axios.post(THEME_URL, {
    action: "add_group",
    name: data.name,
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));

export const deleteThemeAPI = data =>
  axios.post(THEME_URL, {
    action: "delete_group",
    groupId: data.themeID,
  }, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));