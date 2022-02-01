// 특정 페이지 공통 내용(레이아웃)
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';
import { createGlobalStyle } from 'styled-components';
import useInput from '../hooks/useInput';
import Router from 'next/router';

const Global = createGlobalStyle`
    .ant-row {
        margin-right : 0 !important;
        margin-left : 0 !important;
    }
    .ant-col:first-child {
        padding-left : 0 !important;
    }
    .ant-col:last-child {
        padding-right : 0 !important;
    }
`
const SearchInput = styled(Input.Search)`
    vertical-align : middle;
`;

const AppLayout = ({children}) => {
    const { me } = useSelector((state) => state.user );
    const [ searchInput, onChangeSearchInput ] = useInput();
    const onSearch = useCallback(() => {
        Router.push(`/hashtag/${searchInput}`)
    }, [searchInput])
    
    return (
        <div>
            <Global />
            <Menu mode="horizontal">
                <Menu.Item key="/">
                    <Link href="/"><a>메인</a></Link>
                </Menu.Item>
                <Menu.Item key="/profile">
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <SearchInput 
                    enterButton
                    value={searchInput}
                    onChange={onChangeSearchInput}
                    onSearch={onSearch}
                />
                <Menu.Item key="/signup">
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>
            
            <Row gutter={8}>
                {/* xs:모바일/sm:태블릿/md:작은데스크톱 */}
                <Col xs={24} md={6}>
                    {me ? <UserProfile/> : <LoginForm/>}
                </Col>
                <Col xs={24} md={12}>{children}</Col>
                <Col xs={24} md={6}>
                    <a href="https://github.com/eugenekk" target="_blank" rel='noreferrer noopener'>Made by Eugene</a>
                </Col>
            </Row>
        </div>
    )
};

AppLayout.propTypes = {
    children : PropTypes.node.isRequired,
}

export default AppLayout;