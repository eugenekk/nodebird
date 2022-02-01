import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../components/AppLayout";
import Head from "next/head";
import { Card, Avatar } from "antd";
import PostCard from "../../components/PostCard";
import { LOAD_USER_REQUEST, LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import wrapper from "../../store/configureStore";
import axios from "axios";
import { END } from "redux-saga";
import { Router } from "next/router";

const User = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;
    const { mainPosts, hasMorePosts, loadPostsLoading, loadPostsError } = useSelector((state) => state.post);
    const { userInfo } = useSelector((state)=> state.user);
    const { loadUserError } = useSelector((state) => state.user);
    
    console.log('userInfo', userInfo);

    useEffect(() => {
        if(loadUserError){
            alert(loadUserError)
            Router.push('/');
        }
    }, [loadUserError]);

    useEffect(()=> {
        const onScroll = () => {
            if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if(hasMorePosts && !loadPostsLoading) {
                    dispatch({
                        type : LOAD_USER_POSTS_REQUEST,
                        lastId : mainPosts[mainPosts.length -1] && mainPosts[mainPosts.length -1].id,
                        data : id,
                    })
                }
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts.length, hasMorePosts, id, loadPostsLoading])

    return (
        <AppLayout>
            <Head>
                <title>
                    {userInfo.nickname} 님의 글
                </title>
                <meta name="description" content={`${userInfo.nickname} 님의 게시글`}/>
                <meta property="og:title" content={`${userInfo.nickname} 님의 게시글`}/>
                <meta property="og:description" content={`${userInfo.nickname} 님의 게시글`}/>
                <meta property="og:image" content='https://nodebird.com/favicon.ico'/>
                <meta property="og:url" content={`https://nodebird.com/user/${id}`}/>
            </Head>
            {userInfo ? (
                <Card
                actions={[
                    <div key='tweet'>짹짹<br />{userInfo.Posts}</div>,
                    <div key='following'>팔로잉<br />{userInfo.following}</div>,
                    <div key='follower'>팔로워<br />{userInfo.follower}</div>]}
                >
                    <Card.Meta
                    avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                    title={userInfo.nickname} />
                </Card>
            ): null}
            {mainPosts.map((c) => (
                <PostCard key={c.id} post={c} />
            ))}
        </AppLayout>

    )
}

// 화면을 그리기 전에 서버사이드로 먼저 실행
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
        type : LOAD_USER_POSTS_REQUEST,
        data : context.params.id,
    });
    context.store.dispatch({
        type : LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type : LOAD_USER_REQUEST,
        data : context.params.id,
    });

    // 성공 날때 까지 서버와의 통신 기다려서 프론트로 success 보내기
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
})


export default User;