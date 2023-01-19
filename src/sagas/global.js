import { call, put } from "redux-saga/effects";
import {
  GLOBAL_LOGIN_FAIL,
  GLOBAL_LOGIN_SUCCESS,
  GLOBAL_LOGOUT_FAIL,
  GLOBAL_LOGOUT_SUCCESS,
} from "../actions/types/global";
import { globalUserAPI } from "../apis/global";

export function* globalLogin(action) {
  const { name, password } = action.payload;
  const body = {
    action: 'sign_in',
    name,
    password,
  };

  console.log('login');

  try {
    const response =  yield call(globalUserAPI, body);

    console.log(response);

    if (response.ret === 0) {
      localStorage.setItem('__im_username__', name);
      yield put({ type: GLOBAL_LOGIN_SUCCESS, payload: { userName: name } });
    } else {
      yield put({ type: GLOBAL_LOGIN_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: GLOBAL_LOGIN_FAIL, payload: { error: error.toString() } });
  }
}

export function* globalLogout() {
  const body = {
    action: 'sign_out',
  };

  console.log('logout');

  try {
    const response = yield call(globalUserAPI, body);

    if (response.ret === 0) {
      localStorage.removeItem('__im_username__');
      yield put({ type: GLOBAL_LOGOUT_SUCCESS });
    } else {
      yield put({ type: GLOBAL_LOGOUT_FAIL, payload: { error: response.error } });
    }
  } catch (error) {
    yield put({ type: GLOBAL_LOGOUT_FAIL, payload: { error: error.toString() } });
  }
}