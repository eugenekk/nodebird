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
                    {userInfo.nickname} λμ κΈ
                </title>
                <meta name="description" content={`${userInfo.nickname} λμ κ²μκΈ`}/>
                <meta property="og:title" content={`${userInfo.nickname} λμ κ²μκΈ`}/>
                <meta property="og:description" content={`${userInfo.nickname} λμ κ²μκΈ`}/>
                <meta property="og:image" content='https://nodebird.com/favicon.ico'/>
                <meta property="og:url" content={`https://nodebird.com/user/${id}`}/>
            </Head>
            {userInfo ? (
                <Card
                actions={[
                    <div key='tweet'>μ§Ήμ§Ή<br />{userInfo.Posts}</div>,
                    <div key='following'>νλ‘μ<br />{userInfo.following}</div>,
                    <div key='follower'>νλ‘μ<br />{userInfo.follower}</div>]}
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

// νλ©΄μ κ·Έλ¦¬κΈ° μ μ μλ²μ¬μ΄λλ‘ λ¨Όμ  μ€ν
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

    // μ±κ³΅ λ λ κΉμ§ μλ²μμ ν΅μ  κΈ°λ€λ €μ νλ‘ νΈλ‘ success λ³΄λ΄κΈ°
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
})


export default User;