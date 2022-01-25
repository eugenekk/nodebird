import { fork, all, delay, put, takeLatest, call } from "redux-saga/effects";
import axios from "axios";
import { LOAD_MY_INFO_REQUEST, LOAD_MY_INFO_SUCCESS, LOAD_MY_INFO_FAILURE, 
    LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, 
    LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
    SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
    FOLLOW_REQUEST, FOLLOW_SUCCESS, FOLLOW_FAILURE,
    UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS, UNFOLLOW_FAILURE, 
    CHANGE_NICKNAME_REQUEST, CHANGE_NICKNAME_SUCCESS, CHANGE_NICKNAME_FAILURE, LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWERS_FAILURE, LOAD_FOLLOWINGS_FAILURE, REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE, } from '../reducers/user';

function loadMyInfoAPI() {
    return axios.get('/user')
}
function* loadMyInfo(action) {
    try{
        const result = yield call(loadMyInfoAPI, action.data);
        yield put({
            type : LOAD_MY_INFO_SUCCESS,
            data : result.data, //서버로 부터 받아온 데이터
        })
    }catch(err) {
        yield put({
            type: LOAD_MY_INFO_FAILURE,
            error : err.response.data
        })
    }
}

function logInAPI(data) {
    return axios.post('/user/login', data)
}
function* logIn(action) {
    try{
        const result = yield call(logInAPI, action.data);
        yield put({
            type : LOG_IN_SUCCESS,
            data : result.data, //서버로 부터 받아온 데이터
        })
    }catch(err) {
        yield put({
            type: LOG_IN_FAILURE,
            error : err.response.data
        })
    }
}

function logOutAPI() {
    return axios.post('/user/logout')
}
function* logOut() {
    try{
        const result = yield call(logOutAPI);
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

function signUpAPI(data) {
    return axios.post('/user', data);
}
function* signUp(action) {
    try{
        const result = yield call(signUpAPI, action.data);
        console.log('result', result)
        yield put({
            type : SIGN_UP_SUCCESS,
        })
    }catch(err) {
        yield put({
            type : SIGN_UP_FAILURE,
            error : err.response.data
        })
    }
}

function followAPI(data) {
    return axios.patch(`/user/${data}/follow`)
}
function* follow(action) {
    try{
        const result = yield call(followAPI, action.data);
        yield put({
            type : FOLLOW_SUCCESS,
            data : result.data
        })
    }catch(err) {
        yield put({
            type : FOLLOW_FAILURE,
            error : err.response.data
        })
    }
}

function unfollowAPI(data) {
    return axios.delete(`/user/${data}/follow`)
}
function* unfollow(action) {
    try{
        const result = yield call(unfollowAPI, action.data);
        yield put({
            type : UNFOLLOW_SUCCESS,
            data : result.data
        })
    }catch(err) {
        yield put({
            type : UNFOLLOW_FAILURE,
            error : err.response.data
        })
    }
}

// 닉네임 변경
function changeNicknameAPI(data) {
    return axios.patch('/user/nickname', { nickname : data })
}
function* changeNickname(action) {
    try{
        const result = yield call(changeNicknameAPI, action.data); // nickname
        yield put({
            type : CHANGE_NICKNAME_SUCCESS,
            data : result.data.nickname
        })
    }catch(err) {
        yield put({
            type : CHANGE_NICKNAME_FAILURE,
            error : err.response.data
        })
    }
}

// 팔로워 목록 로드
function loadFollowersAPI() {
    return axios.get('/user/followers')
}
function* loadFollowers() {
    try{
        const result = yield call(loadFollowersAPI);
        yield put({
            type : LOAD_FOLLOWERS_SUCCESS,
            data : result.data
        })
    }catch(err) {
        yield put({
            type : LOAD_FOLLOWERS_FAILURE,
            error : err.response.data
        })
    }
}

// 팔로잉 목록 로드
function loadFollowingsAPI() {
    return axios.get('/user/followings')
}
function* loadFollowings() {
    try{
        const result = yield call(loadFollowingsAPI);
        yield put({
            type : LOAD_FOLLOWINGS_SUCCESS,
            data : result.data
        })
    }catch(err) {
        yield put({
            type : LOAD_FOLLOWINGS_FAILURE,
            error : err.response.data
        })
    }
}
// 나를 팔로우하는 사람 차단
function removeFollowerAPI(data) {
    return axios.delete(`/user/follower/${data}`)
}
function* removeFollower(action) {
    try{
        const result = yield call(removeFollowerAPI, action.data);
        yield put({
            type : REMOVE_FOLLOWER_SUCCESS,
            data : result.data
        })
    }catch(err) {
        console.error(err);
        yield put({
            type : REMOVE_FOLLOWER_FAILURE,
            error : err.response.data
        })
    }
}



function* watchLoadMyInfo() {
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo); 
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

function* watchFollow() {
    yield takeLatest(FOLLOW_REQUEST, follow); 
}

function* watchUnfollow() {
    yield takeLatest(UNFOLLOW_REQUEST, unfollow); 
}

function* watchChangeNickname() {
    yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname); 
}

function* watchFollowers() {
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers); 
}

function* watchFollowings() {
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings); 
}

function* watchRemoveFollower() {
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower); 
}

export default function* userSaga() {
    yield all([
        fork(watchLoadMyInfo),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUp),
        fork(watchFollow),
        fork(watchUnfollow),
        fork(watchChangeNickname),
        fork(watchFollowers),
        fork(watchFollowings),
        fork(watchRemoveFollower),
    ])
}