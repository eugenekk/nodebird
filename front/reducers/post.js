import shortId from 'shortid';
import produce from 'immer';

export const initialState = {
    mainPosts : [{
        id : 1,
        User : {
            id : 1,
            nickname : '밀키우',
        },
        content : '첫번째 게시글 #해시태그 #익스프레스',
        Images : [{
            id : shortId.generate(),
            src : "https://news.hmgjournal.com/images_n/contents/cons/2020/201214_christmas_01.jpg", 
        }, {
            id : shortId.generate(),
            src : "https://news.hmgjournal.com/images_n/contents/cons/2020/201214_christmas_01.jpg", 
        }, {
            id : shortId.generate(),
            src : "https://news.hmgjournal.com/images_n/contents/cons/2020/201214_christmas_01.jpg", 
        },],
        Comments : [{
            id : shortId.generate(),
            User : {
                id : shortId.generate(),
                nickname : '울랄라',
            },
            content : '행복해보입니다'
        }, {
            id : shortId.generate(),
            User : {
                id : shortId.generate(),
                nickname : '비건',
            },
            content : '아무튼 비건'
        }]
    }],
    imagePaths : [],
    addPostLoading : false, //게시글 업로드 중
    addPostDone : false,
    addPostError : null,
    removePostLoading : false, //게시글 삭제 중
    removePostDone : false,
    removePostError : null,
    addCommentLoading : false, //코멘트 업로드 중
    addCommentDone : false,
    addCommentError : null,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const addPost = (data) => ({
    type : ADD_POST_REQUEST,
    data,
})
export const removePost = (data) => ({
    type : REMOVE_POST_REQUEST,
    data,
})
export const addComment = (data) => ({
    type : ADD_COMMENT_REQUEST,
    data,
})

const dummyPost = (data) => ({
    id : data.id,
    content : data.content,
    User : {
        id : 1,
        nickname : '밀키우',
    },
    Images : [],
    Comments : [],
})
const dummyComment = (data) => ({
    id : shortId.generate(),
    content : data,
    User : {
        id : 1,
        nickname : '밀키우',
    },
})

// reducer = 이전 상태를 action을 통해 다음 상태로 만들어내는 함수
const reducer = (state = initialState, action) => {
    // 불변성을 지켜주는 immer 사용 (draft)
    return produce(state, (draft) =>{
        switch (action.type) {
            // 게시글 추가
            case ADD_POST_REQUEST:
                draft.addPostLoading = true;
                draft.addPostDone = false;
                draft.addPostError = null;
                break;
            case ADD_POST_SUCCESS:
                draft.addPostLoading = false;
                draft.addPostDone = true;
                draft.mainPosts.unshift(dummyPost(action.data));
                break;
            case ADD_POST_FAILURE:
                draft.addPostLoading = false;
                draft.addPostError = action.error;
                break;
            // 게시글 삭제
            case REMOVE_POST_REQUEST:
                draft.removePostLoading = true;
                draft.removePostDone = false;
                draft.removePostError = null;
                break;
            case REMOVE_POST_SUCCESS:
                draft.removePostLoading = false;
                draft.removePostDone = true;
                draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
                break;
            case REMOVE_POST_FAILURE:
                draft.removePostLoading = false;
                draft.removePostError = action.error;
                break;
            // 코멘트 추가
            case ADD_COMMENT_REQUEST:
                draft.addCommentLoading = true;
                draft.addCommentDone = false;
                draft.addCommentError = null;
                break;
            case ADD_COMMENT_SUCCESS: {
                const post = draft.mainPosts.find((v) => v.id === action.data.postId);
                post.Comments.unshift(dummyComment(action.data.content));
                draft.addCommentLoading = false;
                draft.addCommentDone = true;
                break;
            }
            case ADD_COMMENT_FAILURE:
                draft.addCommentLoading = false;
                draft.addCommentError = action.error;
                break;
            default:
                break;
        }
    })
    
};

export default reducer;