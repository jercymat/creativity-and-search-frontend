import {
  GLOBAL_ADD_QUERY_ID,
  GLOBAL_CHECK_LOGIN,
  GLOBAL_CLOSE_TOAST,
  GLOBAL_LOGIN,
  GLOBAL_LOGOUT,
  GLOBAL_SYNC_SM_WIDTH,
} from "./types/global";

export const checkLogin = () => ({ type: GLOBAL_CHECK_LOGIN });
export const login = (payload) => ({ type: GLOBAL_LOGIN, payload });
export const logout = () => ({ type: GLOBAL_LOGOUT });

export const closeToast = () => ({ type: GLOBAL_CLOSE_TOAST });
export const syncSMWidth = (width) => ({
  type: GLOBAL_SYNC_SM_WIDTH, payload: { savedAreaWidth: width },
});
export const addQueryID = (id) => ({ type: GLOBAL_ADD_QUERY_ID, payload: { queryId: id } });