import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from "./post";
import userSaga from './user';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true; // 다른포트로 쿠키 전달 허용

export default function* rootSaga() {
    yield all([ // 동시실행
        fork(userSaga), // 실행
        fork(postSaga),
    ])
}