import { useRouter } from "next/router"
import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { useSelector } from "react-redux";
import Head from "next/head";
import { useEffect } from "react";
import { Router } from "next/router";

const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const { singlePost, loadPostError } = useSelector((state)=> state.post);

    // if(router.isFallback){
    //     return <div>로딩중</div>
    // }


    useEffect(() => {
        if(loadPostError){
            alert(loadPostError)
        }
    }, [loadPostError]);


    return (
        <AppLayout>
            {singlePost ? (
                <>
                <Head>
                    <title>{singlePost.User.nickname} 님의 글</title>
                    <meta name="description" content={singlePost.content}/>
                    <meta property="og:title" content={`${singlePost.User.nickname} 님의 게시글`}/>
                    <meta property="og:description" content={singlePost.content}/>
                    <meta property="og:image" content={singlePost.Image ? singlePost.Image[0].src : 'https://nodebird.com/favicon.ico'}/>
                    <meta property="og:url" content={`https://nodebird.com/post/${id}`}/>
                </Head>
                <PostCard post = {singlePost}/>
                </>
            ) : null}
        </AppLayout>
    )
}

// 화면을 그리기 전에 서버사이드로 먼저 실행

// export async function getStaticPaths() {
//     return {
//         paths : [
//             { params : { id : '7' } }, // 미리 만들애들 정하기
//             { params : { id : '13' }},
//             { params : { id : '14' }},
//         ],
//         fallback : true,
//     }
// }

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }
    
    context.store.dispatch({
        type : LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type : LOAD_POST_REQUEST,
        data : context.params.id,
    });

    // 성공 날때 까지 서버와의 통신 기다려서 프론트로 success 보내기
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
})

export default Post;