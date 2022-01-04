import AppLayout from "../components/AppLayout";
import Head from "next/head";
import { useState, useCallback } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";
import { Form, Input, Checkbox, Button } from 'antd'; 
import { useDispatch, useSelector } from "react-redux";
import { signupRequestAction, SIGN_UP_REQUEST } from "../reducers/user";

const ErrorMessage = styled.div`
    color : red`;

const Signup = () => {
    const dispatch = useDispatch();
    const { signUpLoading } = useSelector((state) => state.user);

    const [ email, onChangeEmail ] = useInput(''); //커스텀훅 사용
    const [ nickname, onChangeNickname ] = useInput('');
    const [ password, onChangePassword ] = useInput('');
    const [ passwordCheck, setPasswordCheck ] = useState('');
    const [ passwordError, setPasswordError ] = useState(false);

    const onChangePasswordCheck = useCallback((e) =>{
        setPasswordCheck(e.target.value);
        setPasswordError(e.target.value !== password);
    },[password]);

    //약관동의
    const [term, setTerm] = useState('');
    const [termError, setTermError] = useState(false)
    
    const onChangeTerm = useCallback((e)=>{
        setTerm(e.target.checked);
        setTermError(false)
    },[]);
    
    const onSubmit = useCallback(()=>{
        if(password !== passwordCheck){
            return setPasswordError(true);
        }
        if(!term) {
            return setTermError(true);
        }
        console.log(email, nickname, password)
        dispatch(signupRequestAction({email, password, nickname}))
    }, [email, password, passwordCheck, term]);
    
    return (
        <>
        <AppLayout>
            <Head>
                <meta charSet='utf-8' />
                <title>회원가입 | NodeBird</title>
            </Head>
            <Form onFinish={onSubmit}>
                <div>
                    <label htmlFor="user-email">이메일</label>
                    <br />
                    <Input name='user-email' type='email' value={email} required onChange={onChangeEmail}/>
                </div>
                <div>
                    <label htmlFor="user-nickname">닉네임</label>
                    <br />
                    <Input name='user-nickname' value={nickname} required onChange={onChangeNickname}/>
                </div>
                <div>
                    <label htmlFor="user-password">비밀번호</label>
                    <br />
                    <Input name='user-password' value={password} required onChange={onChangePassword}/>
                </div>
                <div>
                    <label htmlFor="user-password-check">비밀번호확인</label>
                    <br />
                    <Input name='user-password-check' value={passwordCheck} required onChange={onChangePasswordCheck}/>
                </div>
                {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
                <div>
                    <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>서비스 이용에 필요한 회원가입을 동의합니다.</Checkbox>
                    {termError && <ErrorMessage>약관에 동의가 필요합니다.</ErrorMessage>}
                </div>
                <div style={{marginTop : 10}}>
                    <Button type="primary" htmlType="submit" loading= {signUpLoading}>가입하기</Button>
                </div>
            </Form>
        </AppLayout>
        </>
    )
};

export default Signup;