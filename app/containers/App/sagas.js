// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS } from 'immutable';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { cloneDeep } from 'lodash';
import request from 'utils/request';
import deepReplace from 'utils/deepReplaceToString';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'utils/constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const REGISTER = 'Crypto/App/REGISTER';
const LOGIN = 'Crypto/App/LOGIN';
const LOGOUT = 'Crypto/App/LOGOUT';
const RESEND_TOKEN = 'Crypto/App/RESEND_TOKEN';
const USER = 'Crypto/App/USER';
const USER_DATA_UPDATE = 'Crypto/App/UPDATE_USER_DATA';

const SET_META_JSON = 'Crypto/App/SET_META_JSON';

// ------------------------------------
// Actions
// ------------------------------------
export const requestRegister = (payload: Object) => ({
  type: REGISTER + REQUESTED,
  payload,
});
const registerRequestSuccess = (payload: Object) => {
  return {
    type: REGISTER + SUCCEDED,
    payload,
  };
};
const registerRequestFailed = error => ({
  type: REGISTER + FAILED,
  payload: error,
});
const registerRequestError = error => ({
  type: REGISTER + ERROR,
  payload: error,
});

export const resendToken = (payload: Object) => ({
  type: RESEND_TOKEN + REQUESTED,
  payload,
});
const resendTokenSuccess = (payload: Object) => ({
  type: RESEND_TOKEN + SUCCEDED,
  payload,
});
const resendTokenFailed = error => ({
  type: RESEND_TOKEN + FAILED,
  payload: error,
});
const resendTokenError = error => ({
  type: RESEND_TOKEN + ERROR,
  payload: error,
});

export const requestUserDataUpdate = (payload: Object) => ({
  type: USER_DATA_UPDATE + REQUESTED,
  payload,
});

const userDataUpdateSuccess = (payload: Object) => {
  return {
    type: USER_DATA_UPDATE + SUCCEDED,
    payload,
  };
};
const userDataUpdateFailed = error => ({
  type: USER_DATA_UPDATE + FAILED,
  payload: error,
});
const userDataUpdateError = error => ({
  type: USER_DATA_UPDATE + ERROR,
  payload: error,
});

export const requestLogin = (payload: Object) => ({
  type: LOGIN + REQUESTED,
  payload,
});
export const loginRequestSuccess = (payload: Object) => ({
  type: LOGIN + SUCCEDED,
  payload,
});
const loginRequestFailed = error => ({
  type: LOGIN + FAILED,
  payload: error,
});
const loginRequestError = error => ({
  type: LOGIN + ERROR,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const requestUser = () => ({
  type: USER + REQUESTED,
});
export const userRequestSuccess = (payload: Object) => ({
  type: USER + SUCCEDED,
  payload,
});
const userRequestFailed = error => ({
  type: USER + FAILED,
  payload: error,
});
const userRequestError = error => ({
  type: USER + ERROR,
  payload: error,
});

export const setMetaJson = (path: string, value: ?Object) => ({
  type: SET_META_JSON,
  payload: value,
  meta: {
    path,
  },
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  user: fromJS(storage.get('user')),
  token: storage.get('token'),
  isLoading: false,
  error: '',
  isResending: false,
  resendError: '',
  isConfirming: false,
  confirmError: '',
  uploadedPhoto: '',
  isUploading: false,
  metaJson: {},
});

let newState = {};

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case REGISTER + REQUESTED:
      return state.set('isLoading', true).set('error', null);

    case REGISTER + SUCCEDED:
      storage.set('user', payload.user);
      storage.set('token', payload.token);
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload.user))
        .set('token', payload.token)
        .set('error', '');

    case REGISTER + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case REGISTER + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case RESEND_TOKEN + REQUESTED:
      return state.set('isResending', true).set('resendError', null);

    case RESEND_TOKEN + SUCCEDED:
      return state.set('isResending', false).set('resendError', '');

    case RESEND_TOKEN + FAILED:
      return state.set('isResending', false).set('resendError', payload);

    case RESEND_TOKEN + ERROR:
      return state.set('isResending', false).set(
        'resendError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case USER_DATA_UPDATE + REQUESTED:
      return state.set('isLoading', true).set('error', null);

    case USER_DATA_UPDATE + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case USER_DATA_UPDATE + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case USER_DATA_UPDATE + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case LOGIN + REQUESTED:
      return state.set('isLoading', true);

    case LOGIN + SUCCEDED:
      storage.set('token', payload.token);
      storage.set('user', payload.user);
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload.user))
        .set('token', payload.token)
        .set('error', '');

    case LOGIN + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case LOGIN + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case LOGOUT:
      storage.remove('token');
      storage.remove('user');
      return state.set('user', null).set('token', null);

    case USER + REQUESTED:
      return state.set('isLoading', true);

    case USER + SUCCEDED:
      storage.set('user', payload);
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload))
        .set('error', '');

    case USER + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case USER + ERROR:
      return state.set('isLoading', false);

    case SET_META_JSON:
      if (meta.path)
        return state.setIn(['metaJson', ...meta.path], fromJS(payload));
      return state.set('metaJson', fromJS(payload));

    case LOCATION_CHANGE:
      return state.set('metaJson', fromJS({})).set('error', '');

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------

// ------------------------------------
// Sagas
// ------------------------------------
function* UpdateUserDataRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/users/me`,
      data: {
        ...payload,
        knownConditions: deepReplace(payload.knownConditions),
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(userDataUpdateSuccess(response.data));
      yield put(requestUser());
    } else if (response.status === 403 || response.status === 401) {
      yield put(logout());
    } else {
      yield put(userDataUpdateFailed(response.data.message));
    }
  } catch (error) {
    yield put(userDataUpdateError(error));
  }
}

function* RegisterRequest({ payload }) {
  const data = cloneDeep(payload);
  data.password2 = payload.password1;
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/rest-auth/registration/`,
      data,
    });
    if (response.status === 201) {
      yield put(registerRequestSuccess(response.data));
    } else {
      yield put(registerRequestFailed(JSON.stringify(response.data)));
    }
  } catch (error) {
    yield put(registerRequestError(error));
  }
}

function* ResendTokenRequest({ payload }) {
  try {
    const data = {
      email: payload,
    };
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/resend-token`,
      data,
    });
    if (response.status === 200) {
      yield put(resendTokenSuccess(response.data));
    } else {
      yield put(resendTokenFailed(response.data.message));
    }
  } catch (error) {
    yield put(resendTokenError(error));
  }
}

function* LoginRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/rest-auth/login/`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(loginRequestSuccess(response.data));
    } else {
      yield put(loginRequestFailed(JSON.stringify(response.data)));
    }
  } catch (error) {
    yield put(loginRequestError(error));
  }
}

function* UserRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      url: `${API_URL}/users/me?populate=pointWallet`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(userRequestSuccess(response.data));
    } else {
      yield put(userRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(userRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield [
    takeLatest(USER_DATA_UPDATE + REQUESTED, UpdateUserDataRequest),
    takeLatest(REGISTER + REQUESTED, RegisterRequest),
    takeLatest(RESEND_TOKEN + REQUESTED, ResendTokenRequest),
    takeLatest(USER + REQUESTED, UserRequest),
    takeLatest(LOGIN + REQUESTED, LoginRequest),
  ];
}
