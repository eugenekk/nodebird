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
    postAdded : false, //게시글 추가가 완료되었을 때 true
};

const ADD_POST = 'ADD_POST';
export const addPost = {
    type : ADD_POST,
}

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
        case ADD_POST:
            return {
                ...state,
                mainPosts : [dummyPost, ...state.mainPosts], // 가장 위에 게시글 추가
                postAdded : true,
            }

        default:
            return state;
    }
};

export default reducer;