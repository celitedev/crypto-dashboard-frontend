// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, SUCCEDED, FAILED } from 'utils/constants';
import type { Action, State } from 'types/common';
import { getToken } from 'containers/App/selectors';
import { logout, requestUserBalance } from 'containers/App/sagas';
// ------------------------------------
// Constants
// ------------------------------------
const POPULAR_CURRENCIES = 'Crypto/HomePage/POPULAR_CURRENCIES';
const MAKE_TRANSACTION = 'Crypto/HomePage/MAKE_TRANSACTION';
const TRANSACTION = 'Crypto/HomePage/TRANSACTION';
// ------------------------------------
// Actions
// ------------------------------------
export const requestPopularCurrencies = () => ({
  type: POPULAR_CURRENCIES + REQUESTED,
});
const popularCurrenciesRequestSuccess = (data: Object) => ({
  type: POPULAR_CURRENCIES + SUCCEDED,
  payload: data,
});
const popularCurrenciesRequestFailed = () => ({
  type: POPULAR_CURRENCIES + FAILED,
});

export const requestTransaction = (data: Object) => ({
  type: TRANSACTION + REQUESTED,
  payload: data,
});

const transactionRequestSuccess = (data: Object) => ({
  type: TRANSACTION + SUCCEDED,
  payload: data,
});

const transactionRequestFailed = error => ({
  type: TRANSACTION + FAILED,
  payload: error,
});

export const makeTransaction = (data: Object) => ({
  type: MAKE_TRANSACTION + REQUESTED,
  payload: data,
});

const transactionMakeRequestSuccess = () => ({
  type: MAKE_TRANSACTION + SUCCEDED,
});

const transactionMakeRequestFailed = error => ({
  type: MAKE_TRANSACTION + FAILED,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  currencies: {
    data: {},
    isLoading: false,
  },
  transactions: {
    data: {},
    isLoading: false,
  },
  isLoading: false,
  error: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case POPULAR_CURRENCIES + REQUESTED:
      return state.setIn(['currencies', 'isLoading'], true);

    case POPULAR_CURRENCIES + SUCCEDED:
      return state
        .setIn(['currencies', 'isLoading'], false)
        .setIn(['currencies', 'data'], fromJS(payload.object));

    case POPULAR_CURRENCIES + FAILED:
      return state.setIn(['currencies', 'isLoading'], false);

    case MAKE_TRANSACTION + REQUESTED:
      return state.set('isLoading', true).set('error', '');

    case MAKE_TRANSACTION + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case MAKE_TRANSACTION + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case TRANSACTION + REQUESTED:
      return state.setIn(['transactions', 'isLoading'], true);

    case TRANSACTION + SUCCEDED:
      return state
        .setIn(['transactions', 'isLoading'], false)
        .setIn(['transactions', 'data'], fromJS(payload));

    case TRANSACTION + FAILED:
      return state.setIn(['transactions', 'isLoading'], false);

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

function* PopularCurrenciesRequest() {
  try {
    const response = yield call(request, {
      url: 'https://apidev.centralix.io/currencies/get/?page=1&length=7',
      headers: {
        Authorization: 'Token 609bc42affe9c9a493d63e38ee65ca8d1e7ab45c',
      },
    });
    if (response.status === 200) {
      yield put(popularCurrenciesRequestSuccess(response.data));
    } else {
      yield put(popularCurrenciesRequestFailed(JSON.stringify(response.data)));
    }
  } catch (error) {
    yield put(popularCurrenciesRequestFailed());
  }
}

function* TransactionMakeRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/make-transaction/`,
      headers: { Authorization: `JWT ${token}` },
      data: payload,
    });
    if (response.status === 201) {
      yield put(transactionMakeRequestSuccess(response.data));
      yield put(requestUserBalance());
    } else if (response.status === 401) {
      yield put(logout());
    } else {
      yield put(transactionMakeRequestFailed(JSON.stringify(response.data)));
    }
  } catch (error) {
    yield put(transactionMakeRequestFailed(error));
  }
}

function* TransactionRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/transactions/`,
      headers: { Authorization: `JWT ${token}` },
    });
    if (response.status === 200) {
      yield put(transactionRequestSuccess(response.data));
    } else if (response.status === 401) {
      yield put(logout());
    } else {
      yield put(transactionRequestFailed(JSON.stringify(response.data)));
    }
  } catch (error) {
    yield put(transactionRequestFailed(error));
  }
}

export default function*(): Saga<void> {
  yield [
    takeLatest(POPULAR_CURRENCIES + REQUESTED, PopularCurrenciesRequest),
    takeLatest(MAKE_TRANSACTION + REQUESTED, TransactionMakeRequest),
    takeLatest(TRANSACTION + REQUESTED, TransactionRequest),
  ];
}
