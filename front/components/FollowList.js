import PropTypes from 'prop-types';
import { Button, Card, List } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowList = ({ header, data, onClickMore, loading })=>{
    const dispatch = useDispatch();
    const onCancle = (id) =>()=>{
        if(header === '팔로잉'){
            dispatch({
                type : UNFOLLOW_REQUEST,
                data : id // 팔로잉리스트의 user.id
            })
        } else {
            dispatch({
                type : REMOVE_FOLLOWER_REQUEST,
                data : id // 팔로워리스트의 user.id
            })
        }
    }
    return(
        <List
            style={{ marginBottom: '20px' }}
            grid={{ gutter: 4, xs: 2, md: 3 }}
            size='small'
            header={<div>{header}</div>}
            loadMore={
                <div style={{ textAlign : 'center', margin : '10px 0' }}>
                    <Button onClick={onClickMore} loading={loading}>더 보기</Button>
                </div>
            }
            bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item style={{marginTop : 20}}>
                    <Card actions={[<StopOutlined key = 'stop' onClick={onCancle(item.id)}/>]}>
                        <Card.Meta description={item.nickname}/>
                    </Card>
                </List.Item>
            )}
        />
    )
}

FollowList.propTypes = {
    header : PropTypes.string.isRequired,
    data : PropTypes.array.isRequired,
    onClickMore : PropTypes.func.isRequired,
    loading : PropTypes.bool.isRequired
}

export default FollowList;