export const initialState = {
    mainPosts : [{
        id : 1,
        User : {
            id : 1,
            nickname : '니키킴',
        },
        content : '첫번째 게시글 #해시태그 #익스프레스',
        Images : [{
            src : "https://news.hmgjournal.com/images_n/contents/cons/2020/201214_christmas_01.jpg", 
        }, {
            src : "https://news.hmgjournal.com/images_n/contents/cons/2020/201214_christmas_01.jpg", 
        }, {
            src : "https://news.hmgjournal.com/images_n/contents/cons/2020/201214_christmas_01.jpg", 
        },],
        Comments : [{
            User : {
            nickname : '울랄라',
            },
            content : '행복해보입니다'
        }, {
            User : {
            nickname : '비건',
            },
            content : '아무튼 비건'
        }]
    }],
    imagePaths : [],
    addPostLoading : false, //게시글 업로드 중
    addPostDone : false,
    addPostError : null,
    addCommentLoading : false, //코멘트 업로드 중
    addCommentDone : false,
    addCommentError : null,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const addPost = (data) => ({
    type : ADD_POST_REQUEST,
    data,
})
export const addComment = (data) => ({
    type : ADD_COMMENT_REQUEST,
    data,
})

const dummyPost = {
    id : 2,
    User : {
        id : 1,
        nickname : '니키킴',
    },
    content : '더미데이터 dummy Post',
    Images : [],
    Comments : [],
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST_REQUEST:
            return {
                ...state,
                addPostLoading : true,
                addPostDone : false,
                addPostError : null,
            }
        case ADD_POST_SUCCESS:
            return {
                ...state,
                mainPosts : [dummyPost, ...state.mainPosts], // 가장 위에 게시글 추가
                addPostLoading : false,
                addPostDone : true,
            }
        case ADD_POST_FAILURE:
            return {
                ...state,
                addPostLoading : false,
                addPostError : action.error
            }
        
        case ADD_COMMENT_REQUEST:
            return {
                ...state,
                addCommenttLoading : true,
                addCommenttDone : false,
                addCommenttError : null,
            }
        case ADD_COMMENT_SUCCESS:
            return {
                ...state,
                addCommentLoading : false,
                addCommentDone : true,
            }
        case ADD_COMMENT_FAILURE:
            return {
                ...state,
                addCommentLoading : false,
                addCommentError : action.error
            }
        default:
            return state;
    }
};

export default reducer;