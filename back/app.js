const express = require('express');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();
const cors = require('cors');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const passportConfig = require('./passport/index');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

db.sequelize.sync()
    .then(()=> {
        console.log("db연결 성공")
    })
    .catch(console.error);

passportConfig();
dotenv.config();

app.use(cors({
    // origin : 'http://nodebird.com' // 실제 서버주소만 허용
    origin : 'http://localhost:3060', // cors 허용 : Header 추가 : Access Control Allow Origin
    credentials : true, // 다른 포트로부터의 쿠키 받기 허용
}));

app.use('/', express.static(path.join(__dirname, 'uploads'))) //프론트가 uploads 폴더에 접근할 수 있도록 설정
app.use(express.json()); // 프론트에서 보낸 json데이터를 req.body안에 넣어줌
app.use(express.urlencoded({ extended : true })) // 프론트에서 보낸 form submit req.body에 넣기
app.use(session({
    saveUninitialized : false,
    resave : false,
    secret : process.env.COOKIE_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan('dev'));


app.use('/post', postRouter); // 게시글 한개에 대한 요청
app.use('/posts', postsRouter); // 게시글 여러개 대한 요청
app.use('/user', userRouter);


// 가장 마지막에 next() 에러처리 미들웨어 내부적으로 존재(원할시 커스텀 가능)
// app.use((err, req, res, next) => {
//     // 에러 커스텀
// });

app.listen(3065, () => {
    console.log("서버 실행 중!!");
})