import { Button } from "antd";
import PropTypes from 'prop-types';
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({post}) => {
    const dispatch = useDispatch();
    const { me, followLoading, unfollowLoading } = useSelector((state) => state.user);
    const isFollowing = me?.Followings.find((v) => v.id === post.User.id)
    const onFollow = useCallback(() => {
        if(isFollowing) {
            dispatch({
                type : UNFOLLOW_REQUEST,
                data : post.User.id
            })
        }else{
            dispatch({
                type : FOLLOW_REQUEST,
                data : post.User.id
            })
        }
    }, [isFollowing])

    if(post.User.id === me.id) { // 내게시글에는 팔로워버튼 없음
        return null;
    }
    return <Button loading={followLoading || unfollowLoading} onClick={onFollow}>
        {isFollowing ? 'unfollow' : 'follow'}</Button>
};

FollowButton.propTypes = {
    post : PropTypes.object.isRequired
};

export default FollowButton;