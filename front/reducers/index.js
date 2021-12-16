import { HYDRATE } from "next-redux-wrapper";
//분리한 reducer 합치기
import { combineReducers } from "redux";
import user from './user';
import post from './post';


const initialState = {
    user : {

    },
    post : {
        
    },
};


// (이전상태, 액션) => 다음상태 를 만들어내는 함수
const rootReducer = combineReducers({
    //SSR을 위한 HYDRATE를 위한 index 추가
    index : (state = {}, action) => {
        switch (action.type) {
            case HYDRATE:
                console.log('HYDRATE', HYDRATE)
                return {...state, ...action.payloads}
            default:
                return state;
        };
    },
    user, 
    post,
});

export default rootReducer;
