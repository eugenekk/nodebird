import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from 'react';
import Router from 'next/router';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';

import { END } from "redux-saga";
import wrapper from "../store/configureStore";
import axios from "axios";

import useSWR from "swr";

const fetcher = (url) => axios.get(url, { withCredentials : true }).then((result) => result.data);

const Profile = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const [ followersLimit , setFollowersLimit ] = useState(3)
    const [ followingsLimit , setFollowingsLimit ] = useState(3)

    // loading / data / error -> reducer action 대신
    const { data : followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher)
    const { data : followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher)

    // useEffect(() => {
    //     dispatch({
    //         type : LOAD_FOLLOWERS_REQUEST
    //     });
    //     dispatch({
    //         type : LOAD_FOLLOWINGS_REQUEST
    //     });
    // }, []);

    useEffect(()=>{
        if(!(me && me.id)){
            Router.push('/');
        }
    }, [me && me.id]);


    const loadMoreFollowers = useCallback(() => {
        setFollowersLimit((prev) => prev + 3)
    },[])
    const loadMoreFollowings = useCallback(() => {
        setFollowingsLimit((prev) => prev + 3)
    },[])

    // return 은 모든 hook 아래

    if(!me) {
        return "내 정보 로딩 중";
    }

    if(followerError || followingError) {
        console.error(followerError || followingError);
        return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>
    }
    
    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <title>프로필 | NodeBird</title>
            </Head>

            <AppLayout>
                <NicknameEditForm/>
                {/* <FollowList header="팔로잉" data={me.Followings}/>
                <FollowList header="팔로워" data={me.Followers}/> */}

                <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError}/>
                <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError}/>
            </AppLayout>
        </>
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
    });

    // 성공 날때 까지 서버와의 통신 기다려서 프론트로 success 보내기
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
})

export default Profile;