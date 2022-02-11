import styled from 'styled-components';
import { Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { useCallback } from 'react';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const NicknameForm = styled(Form)`
    margin-bottom : 20px;
    border : 1px solid #d9d9d9;
    padding : 20px;
`;

const NicknameEditForm = ()=>{
    const { me } = useSelector((state) => state.user);
    const [ nickname, onChangeNickname ] = useInput(me?.nickname || '');
    const dispatch = useDispatch();
    const onSubmit = useCallback(() =>{
        dispatch({
            type : CHANGE_NICKNAME_REQUEST,
            data : nickname,
        })
    }, [nickname]);

    return (
        <NicknameForm>
            <Input.Search 
                addonBefore="닉네임" 
                enterButton="수정" 
                value={nickname}
                onChange={onChangeNickname}
                onSearch={onSubmit}
            />
        </NicknameForm>
    )
}
export default NicknameEditForm;