import produce from "immer";

export const initialState = {
    loadMyInfoLoading : false, //로그인한 사용자 정보 시도 중
    loadMyInfoDone : false,
    loadMyInfoError : null,
    logInLoading : false, //로그인 시도 중
    logInDone : false,
    logInError : null,
    logOutLoading : false, //로그아웃 시도중
    logOutDone : false,
    logOutError : null,
    signUpLoading : false, // 회원가입 시도중
    signUpDone : false,
    signUpError : null,
    changeNicknameLoading : false, // 닉네임 변경 시도중
    changeNicknameDone : false,
    changeNicknameError : null,
    followLoading : false, //팔로우 시도 중
    followDone : false,
    followError : null,
    unfollowLoading : false, //언팔로우 시도 중
    unfollowDone : false,
    unfollowError : null,
    me : null,
    signUpData : {},
    loginData : {},
};

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST'
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS'
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE'

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST'
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS'
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE'

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST'
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS'
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE'

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST'
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS'
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE'

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST'
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS'
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE'

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST'
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS'
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE'

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST'
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS'
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE'

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

const dummyUser = (data) => ({
    ...data,
    nickname : '밀키우',
    id : 1,
    Posts : [ {id : 1 } ],
    Followings : [{ nickname : 'mikey' }, { nickname : 'Holley' }],
    Followers : [{ nickname : 'mikey' }]
})

//action creator
//action 은 객체
export const loginRequestAction = (data) => {
    return {
        type : LOG_IN_REQUEST,
        data
    }
}
export const logoutRequestAction = () => {
    return {
        type : LOG_OUT_REQUEST,
    }
}
export const signupRequestAction = (data) => {
    return {
        type : SIGN_UP_REQUEST,
        data
    }
}

const reducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
        // 로그인 사용자 정보
        case LOAD_MY_INFO_REQUEST:
            draft.loadMyInfoLoading = true;
            draft.loadMyInfoError = null;
            draft.loadMyInfoDone = false;
            break;
        case LOAD_MY_INFO_SUCCESS:
            draft.loadMyInfoLoading = false;
            draft.loadMyInfoDone = true;
            draft.me = action.data;
            break;
        case LOAD_MY_INFO_FAILURE:
            draft.loadMyInfoLoading = false;
            draft.loadMyInfoError = action.error;
            break;
        // 로그인
        case LOG_IN_REQUEST:
            draft.logInLoading = true;
            draft.logInError = null;
            draft.logInDone = false;
            break;
        case LOG_IN_SUCCESS:
            draft.logInLoading = false;
            draft.logInDone = true;
            draft.me = action.data;
            break;
        case LOG_IN_FAILURE:
            draft.logInLoading = false;
            draft.logInError = action.error;
            break;
        // 로그아웃
        case LOG_OUT_REQUEST:
            draft.logOutLoading = true;
            draft.logOutDone = false;
            draft.logOutError = null;
            break;
        case LOG_OUT_SUCCESS:
            draft.logOutLoading = false;
            draft.logOutDone = true;
            draft.me = null;
            break;
        case LOG_OUT_FAILURE:
            draft.logOutLoading = false;
            draft.logOutError = action.error;
            break;
        // 회원가입
        case SIGN_UP_REQUEST:
            draft.signUpLoading = true;
            draft.signUpDone = false;
            draft.signUpError = null;
            break;
        case SIGN_UP_SUCCESS:
            draft.signUpLoading = false;
            draft.signUpDone = true;
            break;
        case SIGN_UP_FAILURE:
            draft.signUpLoading = false;
            draft.signUpError = action.error;
            break;
        // 닉네임 변경
        case CHANGE_NICKNAME_REQUEST:
            draft.changeNicknameLoading = true;
            draft.changeNicknameDone = false;
            draft.changeNicknameError = null;
            break;
        case CHANGE_NICKNAME_SUCCESS:
            draft.changeNicknameLoading = false;
            draft.changeNicknameDone = true;
            break;
        case CHANGE_NICKNAME_FAILURE:
            draft.changeNicknameLoading = false;
            draft.changeNicknameError = action.error;
            break;
        // 팔로우
        case FOLLOW_REQUEST:
            draft.followLoading = true;
            draft.followError = null;
            draft.followDone = false;
            break;
        case FOLLOW_SUCCESS:
            draft.followLoading = false;
            draft.followDone = true;
            draft.me.Followings.push({id : action.data})
            break;
        case FOLLOW_FAILURE:
            draft.followLoading = false;
            draft.followError = action.error;
            break;
        // 언팔로우
        case UNFOLLOW_REQUEST:
            draft.unfollowLoading = true;
            draft.unfollowError = null;
            draft.unfollowDone = false;
            break;
        case UNFOLLOW_SUCCESS:
            draft.unfollowLoading = false;
            draft.unfollowDone = true;
            draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data);
            break;
        case UNFOLLOW_FAILURE:
            draft.unfollowLoading = false;
            draft.unfollowError = action.error;
            break;
        // 게시글 추가 (내 정보 업데이트)
        case ADD_POST_TO_ME:
            draft.me.Posts.unshift({ id : action.data });
            break;
        // 게시글 삭제 (내 정보 업데이트)
        case REMOVE_POST_OF_ME:
            draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data);
            break;
        default:
            break;
        }
    })
    
};

export default reducer;