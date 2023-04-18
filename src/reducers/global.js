import {
  GLOBAL_CLOSE_TOAST,
  GLOBAL_LOGIN,
  GLOBAL_LOGIN_FAIL,
  GLOBAL_LOGIN_SUCCESS,
  GLOBAL_LOGOUT,
  GLOBAL_LOGOUT_FAIL,
  GLOBAL_LOGOUT_SUCCESS,
  GLOBAL_SYNC_SM_WIDTH,
} from "../actions/types/global"

const initialState = {
  loading: false,
  isLoggedin: localStorage.getItem('__im_username__') !== null,
  userName: localStorage.getItem('__im_username__') !== null
    ? localStorage.getItem('__im_username__')
    : '',
  savedAreaWidth: 400,
  errorToastShow: false,
  error: "",
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case GLOBAL_LOGIN:
  case GLOBAL_LOGOUT:
    return { ...state, loading: true }

  case GLOBAL_LOGIN_SUCCESS:
    return {
      ...state,
      loading: false,
      isLoggedin: true,
      userName: payload.userName,
    }

  case GLOBAL_LOGOUT_SUCCESS:
    return {
      ...state,
      loading: false,
      isLoggedin: false,
      userName: '',
    }

  case GLOBAL_LOGIN_FAIL:
  case GLOBAL_LOGOUT_FAIL:
    return {
      ...state,
      loading: false,
      errorToastShow: true,
      error: payload.error,
    }

  case GLOBAL_CLOSE_TOAST:
    return { ...state, errorToastShow: false }

  case GLOBAL_SYNC_SM_WIDTH:
    return { ...state, savedAreaWidth: payload.savedAreaWidth }

  default:
    return state
  }
}

export default reducer;