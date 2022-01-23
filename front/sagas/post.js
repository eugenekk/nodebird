import { all, fork, takeLatest, delay, put, throttle, call } from "redux-saga/effects";
import axios from "axios";
import { LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE, generateDummyPost } from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";
import shortid from "shortid";

// 게시글 로드
function loadPostAPI(data) {
    return axios.post('/api/post')
}
function* loadPost(action) {
    try{
        // const result = yield call(addPostAPI, action.data);
        // yield delay(1000)
        yield put({
            type : LOAD_POST_SUCCESS,
            data : generateDummyPost(10),
        })
    }catch(err) {
        yield put({
            type: LOAD_POST_FAILURE,
            data : err.response.data
        })
    }
}
// 게시글 추가
function addPostAPI(data) {
    return axios.post('/post', { content : data })
}
function* addPost(action) {
    try{
        const result = yield call(addPostAPI, action.data);
        yield put({
            type : ADD_POST_SUCCESS,
            data : result.data,
        })
        yield put({
            type : ADD_POST_TO_ME,
            data : result.data.id
        })
    }catch(err) {
        yield put({
            type: ADD_POST_FAILURE,
            data : err.response.data
        })
    }
}
// 게시글 삭제
function removePostAPI(data) {
    return axios.delete('/api/post', data);
}
function* removePost(action) {
    try{
        // const result = yield call(addPostAPI, action.data);
        yield delay(1000);
        yield put({
            type : REMOVE_POST_SUCCESS,
            data : action.data,
        })
        yield put({
            type : REMOVE_POST_OF_ME,
            data : action.data
        })
    }catch(err) {
        yield put({
            type: REMOVE_POST_FAILURE,
            data : err.response.data
        })
    }
}
// 코멘트 추가
function addCommentAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, data);
}
function* addComment(action) {
    try{
        const result = yield call(addCommentAPI, action.data);
        yield put({
            type : ADD_COMMENT_SUCCESS,
            data : result.data
        })
    }catch(err) {
        yield put({
            type: ADD_COMMENT_FAILURE,
            data : err.response.data
        })
    }
}


function* watchLoadPost() {
    yield takeLatest( LOAD_POST_REQUEST, loadPost);
}
function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}
function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}


export default function* postSaga() {
    yield all([
        fork(watchLoadPost),
        fork(watchAddPost),
        fork(watchRemovePost),
        fork(watchAddComment),
    ])
}