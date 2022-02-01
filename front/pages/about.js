
import { useSelector } from "react-redux";
import Head from "next/head";
import { END } from "redux-saga";

import { Avatar, Card } from "antd";
import AppLayout from "../components/AppLayout";
import wrapper from "../store/configureStore";
import { LOAD_USER_REQUEST } from '../reducers/user';

const About = () => {
    const { userInfo } = useSelector((state) => state.user);

    return (
        <>
            <AppLayout>
                <Head>
                    <title>Eugene | NodeBird</title>
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
                        title={userInfo.nickname}
                        description='노드버드 개발자'
                        />
                    </Card>
                ) :
                null}
            </AppLayout>
        </>
    )
};

export const getStaticProps = wrapper.getStaticProps(async (context) => {
    context.store.dispatch({
        type : LOAD_USER_REQUEST,
        data : 1,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
})

export default About;