import axios from "axios";
import config from "../config";

const BASE_URL = config.api.HOST + '/users';

export const globalUserAPI = data =>
  axios.post(BASE_URL, data, { withCredentials: true })
    .then(response => response.data)
    .catch(e => ({
      status: false,
      error: e.message
    }));