export const initialState = {
    isLogin : false,
    me : null,
    signUpData : {},
    loginData : {},
};

//action creator
//action 은 객체
export const loginAction = (data) => {
    return {
        type : 'LOG_IN',
        data
    }
}

export const logoutAction = () => {
    return {
        type : 'LOG_OUT',
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                isLogin : true,
                me : action.data
            };
        case 'LOG_OUT':
            return {
                ...state,
                isLogin : false,
                me : null,
            };
        default:
            return state;
    }
};

export default reducer;