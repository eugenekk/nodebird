import Document, { NextScript, Html, Head, Main } from 'next/document';
import { ServerStyleSheet } from 'styled-components'; // styled-component SSR 제공

// App을 Document로 감쌈
export default class MyDocument extends Document { // Document 에서는 class형 써야함
    static async getInitialProps(ctx){ // document/app 에서만 쓰는 특수한 SSR
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () => originalRenderPage({
                enhanseApp : (App) => (props) => sheet.collectStyles(<App {...props} />)
            });
            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles : (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                )
            }
        }catch(err) {
            console.error(err)
        }finally {
            sheet.seal();
        }
    }
ㄴ
    render() {
        return (
            <Html>
                <Head/>
                <body>
                    <Main/>
                    {/* 익스플로러 */}
                    <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019"/>
                    <NextScript/>
                </body>
            </Html>
        )
    }
}