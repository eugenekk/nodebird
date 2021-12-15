import { Button, Card, Avatar } from 'antd';
import { useCallback } from 'react';

const UserProfile = ({setIsLogin}) => {
    const onLogout = useCallback(()=>{
        setIsLogin(false)
    })
    return (
        <Card
            actions={[
                <div key="twit">짹짹<br />0</div>,
                <div key="followings">팔로잉<br />0</div>,
                <div key="followers">팔로워<br />0</div>,
            ]}
        >
            <Card.Meta
                avatar={<Avatar>EG</Avatar>}
                title="Eugene"
            />
            <Button onClick={onLogout}>로그아웃</Button>
        </Card>
    )
}

export default UserProfile;