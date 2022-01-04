import { fork, all, delay, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, 
    LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
    SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE } from '../reducers/user';

function logInAPI(data) {
    return axios.post('/api/login', data)
}
function* logIn(action) {
    try{
        console.log('saga login', action.data)
        // const result = yield call(logInAPI, action.data);
        yield delay(1000);
        yield put({
            type : LOG_IN_SUCCESS,
            data : action.data,
            // data : result.data
        })
    }catch(err) {
        yield put({
            type: LOG_IN_FAILURE,
            error : err.response.data
        })
    }
}

function logOutAPI() {
    return axios.post('/api/logout')
}
function* logOut() {
    try{
        // const result = yield call(logOutAPI);
        yield delay(1000);
        yield put({
            type : LOG_OUT_SUCCESS,
            // data : result.data
        })
    }catch(err) {
        yield put({
            type: LOG_OUT_FAILURE,
            error : err.response.data
        })
    }
}

function signUpAPI() {
    return axios.post('/api/signup')
}
function* signUp() {
    try{
        yield delay(1000);
        yield put({
            type : SIGN_UP_SUCCESS,
            data,
        })
    }catch(err) {
        yield put({
            type : SIGN_UP_FAILURE,
            error : err.response.data
        })
    }
}

function* watchLogIn() {
    yield takeLatest(LOG_IN_REQUEST, logIn); // Login action까지 wait
}

function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUp),
    ])
}