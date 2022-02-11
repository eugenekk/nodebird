import AppLayout from "../components/AppLayout";
import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";
import { Form, Input, Checkbox, Button } from 'antd'; 
import { useDispatch, useSelector } from "react-redux";
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from "../reducers/user";
import Router from "next/router";
import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../store/configureStore";

const ErrorMessage = styled.div`
    color : red`;

const Signup = () => {
    const dispatch = useDispatch();
    const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

    useEffect(() => {
        if(me && me.id) {
            Router.replace('/');
        }
    }, [me && me.id]);

    useEffect(() => {
        if(signUpDone) {
            Router.replace('/');
        }
    }, [signUpDone]);

    useEffect(() => {
        if(signUpError) {
            alert(signUpError);
        }
    }, [signUpError]);


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
        dispatch({
            type : SIGN_UP_REQUEST,
            data : {email, password, nickname},
        })
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

export default Signup;