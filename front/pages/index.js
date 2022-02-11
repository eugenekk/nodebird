import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostForm from '../components/PostForm';
import PostCard from "../components/PostCard";
import { useEffect } from "react";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from 'redux-saga';
import axios from "axios";


const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state)=>state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);

    //리트윗 실패시 에러메시지
    useEffect(()=> {
        if(retweetError) {
            alert(retweetError)
        }
    }, [retweetError])

    // 스크롤 로딩
    useEffect(()=>{
        function onScroll() {
            if(window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
                if(hasMorePosts && !loadPostsLoading){
                    const lastId = mainPosts[mainPosts.length -1]?.id
                    dispatch({
                        type : LOAD_POSTS_REQUEST,
                        lastId,
                    });
                }
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll); // 메모리 해제(useEffect)
        }
    }, [loadPostsLoading, hasMorePosts, mainPosts])
    
    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post) => <PostCard key={post.id} post={post}/>)}
        </AppLayout>
    )
};

// 화면을 그리기 전에 서버사이드로 먼저 실행
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }
    
    context.store.dispatch({
        type : LOAD_MY_INFO_REQUEST,
    })

    context.store.dispatch({
        type : LOAD_POSTS_REQUEST,
    });
    // 성공 날때 까지 서버와의 통신 기다려서 프론트로 success 보내기
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
})

export default Home;