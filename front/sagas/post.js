import { all, fork, takeLatest, put, call } from "redux-saga/effects";
import axios from "axios";
import { LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE,
    LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
    LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
    UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE, 
    UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, 
    RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE, 
    LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
    LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, } from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";
import shortid from "shortid";

// 게시글 로드
function loadPostsAPI(lastId) {
    return axios.get(`/posts?lastId=${lastId || 0}`);
}
function* loadPosts(action) {
    try{
        const result = yield call(loadPostsAPI, action.lastId);
        yield put({
            type : LOAD_POSTS_SUCCESS,
            data : result.data,
        })
    }catch(err) {
        console.error(err);
        yield put({
            type: LOAD_POSTS_FAILURE,
            error : err.response.data
        })
    }
}
// 특정 유저 게시글 로드
function loadUserPostsAPI(data, lastId) {
    return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}
function* loadUserPosts(action) {
    try{
        const result = yield call(loadUserPostsAPI, action.data, action.lastId);
        yield put({
            type : LOAD_USER_POSTS_SUCCESS,
            data : result.data,
        })
    }catch(err) {
        console.error(err);
        yield put({
            type: LOAD_USER_POSTS_FAILURE,
            error : err.response.data
        })
    }
}
// 해시태그 검색 게시글 로드
function loadHashtagPostsAPI(data, lastId) {
    return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}
function* loadHashtagPosts(action) {
    try{
        const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
        yield put({
            type : LOAD_HASHTAG_POSTS_SUCCESS,
            data : result.data,
        })
    }catch(err) {
        console.error(err);
        yield put({
            type: LOAD_HASHTAG_POSTS_FAILURE,
            error : err.response.data
        })
    }
}
// 게시글(1개) 로드
function loadPostAPI(data) {
    return axios.get(`/post/${data}`);
}
function* loadPost(action) {
    try{
        const result = yield call(loadPostAPI, action.data);
        yield put({
            type : LOAD_POST_SUCCESS,
            data : result.data,
        })
    }catch(err) {
        console.error(err);
        yield put({
            type: LOAD_POST_FAILURE,
            error : err.response.data
        })
    }
}
// 게시글 추가
function addPostAPI(data) {
    return axios.post('/post', data)
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
        console.error(err);
        yield put({
            type: ADD_POST_FAILURE,
            error : err.response.data
        })
    }
}
// 게시글 삭제
function removePostAPI(data) {
    return axios.delete(`/post/${data}`);
}
function* removePost(action) {
    try{
        const result = yield call(removePostAPI, action.data); // postId
        yield put({
            type : REMOVE_POST_SUCCESS,
            data : result.data, // postId
        })
        yield put({
            type : REMOVE_POST_OF_ME,
            data : action.data
        })
    }catch(err) {
        console.error(err);
        yield put({
            type: REMOVE_POST_FAILURE,
            error : err.response.data
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
        console.error(err)
        yield put({
            type: ADD_COMMENT_FAILURE,
            error : err.response.data
        })
    }
}

// 좋아요
function likePostAPI(data) {
    return axios.patch(`/post/${data}/like`);
}
function* likePost(action) {
    try{
        const result = yield call(likePostAPI, action.data);
        yield put({
            type : LIKE_POST_SUCCESS,
            data : result.data
        })
    }catch(err) {
        console.error(err)
        yield put({
            type: LIKE_POST_FAILURE,
            error : err.response.data
        })
    }
}
// 좋아요 해제
function unlikePostAPI(data) {
    return axios.delete(`/post/${data}/like`);
}
function* unlikePost(action) {
    try{
        const result = yield call(unlikePostAPI, action.data);
        yield put({
            type : UNLIKE_POST_SUCCESS,
            data : result.data
        })
    }catch(err) {
        console.error(err)
        yield put({
            type: UNLIKE_POST_FAILURE,
            error : err.response.data
        })
    }
}
// 이미지 업로드
function uploadImagesAPI(data) {
    return axios.post(`/post/images`, data);
}
function* uploadImages(action) {
    try{
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type : UPLOAD_IMAGES_SUCCESS,
            data : result.data
        })
    }catch(err) {
        console.error(err)
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error : err.response.data
        })
    }
}

function retweetAPI(data) {
    return axios.post(`/post/${data}/retweet`, data);
}
function* retweet(action) {
    try{
        const result = yield call(retweetAPI, action.data);
        yield put({
            type : RETWEET_SUCCESS,
            data : result.data
        })
    }catch(err) {
        console.error(err)
        yield put({
            type: RETWEET_FAILURE,
            error : err.response.data
        })
    }
}

function* watchLoadPosts() {
    yield takeLatest( LOAD_POSTS_REQUEST, loadPosts);
}
function* watchLoadUserPosts() {
    yield takeLatest( LOAD_USER_POSTS_REQUEST, loadUserPosts);
}
function* watchLoadHashtagPosts() {
    yield takeLatest( LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
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
function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnlikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}
function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet);
}


export default function* postSaga() {
    yield all([
        fork(watchLoadPosts),
        fork(watchLoadUserPosts),
        fork(watchLoadHashtagPosts),
        fork(watchLoadPost),
        fork(watchAddPost),
        fork(watchRemovePost),
        fork(watchAddComment),
        fork(watchLikePost),
        fork(watchUnlikePost),
        fork(watchUploadImages),
        fork(watchRetweet),
    ])
}