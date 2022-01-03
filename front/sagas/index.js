import { all, fork } from 'redux-saga/effects';
import postSaga from "./post";
import userSaga from './user';

export default function* rootSaga() {
    yield all([ // 동시실행
        fork(userSaga), // 실행
        fork(postSaga),
    ])
}