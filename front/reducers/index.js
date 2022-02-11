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
const rootReducer = (state, action) => {
    switch (action.type) {
        case HYDRATE:
            console.log('HYDRATE', HYDRATE);
            return action.payload;
        default : {
            const combinedReducer = combineReducers({
                user,
                post,
            });
            return combinedReducer(state, action);
        }
    }
}

export default rootReducer;
