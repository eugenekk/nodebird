// 모든 페이지 공통 내용
import 'antd/dist/antd.css'
import PropTypes from 'prop-types';
import Head from "next/head";

const App = ({ Component }) =>{
    return (
        <>
        <Head>
            <meta charSet='utf-8' />
            <title>NodeBird</title>
        </Head>
        <Component />

        </>
    )
};

App.propTypes = {
    Component : PropTypes.elementType.isRequired,
}

export default App;