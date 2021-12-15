// 특정 페이지 공통 내용(레이아웃)
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';

const SearchInput = styled(Input.Search)`
    vertical-align : middle;
`;

const AppLayout = ({children}) => {
    const [isLogin, setIsLogin] = useState(false);
    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href="/"><a>메인</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <SearchInput enterButton/>
                <Menu.Item>
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                {/* xs:모바일/sm:태블릿/md:작은데스크톱 */}
                <Col xs={24} md={6}>
                    {isLogin ? <UserProfile setIsLogin={setIsLogin}/> : <LoginForm setIsLogin={setIsLogin}/>}
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