//configureStore.js (redux 기본세팅)
import {createWrapper} from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
//root reducer 불러오기
import reducer from '../reducers';
import rootSaga from '../sagas';

const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    // redux의 기능을 확장
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares)) //배포용 미들웨어
        : composeWithDevTools(applyMiddleware(...middlewares)) //개발용 미들웨어(dev-tools-extension사용)
    const store = createStore(reducer, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store //state & reducer
};

const wrapper = createWrapper(configureStore, {
    debug : process.env.NODE_ENV === 'development',
});

export default wrapper;