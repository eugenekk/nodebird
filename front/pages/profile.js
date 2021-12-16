import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import Head from "next/head";

const Profile = () => {
    const followerList = [{nickname : 'Nicky'}, {nickname : 'Hena'}, {nickname : 'Tommy'}]
    const followingList = [{nickname : 'Mikey'}, {nickname : 'Dolla'}, {nickname : 'Noze'}]
    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <title>프로필 | NodeBird</title>
            </Head>

            <AppLayout>
                <NicknameEditForm/>
                <FollowList header="팔로워목록" data={followerList}/>
                <FollowList header="팔로잉목록" data={followingList}/>
            </AppLayout>
        </>
    )
};

export default Profile;