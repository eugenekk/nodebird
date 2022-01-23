const express = require('express');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();
const cors = require('cors');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const passportConfig = require('./passport/index');
const passport = require('passport');
const dotenv = require('dotenv');

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

app.get('/', (req, res) => {
    res.send('hello epresee')
})

app.get('/', (req, res) => {
    res.send('hello api')
})

app.use('/post', postRouter);
app.use('/user', userRouter);


// 가장 마지막에 next() 에러처리 미들웨어 내부적으로 존재(원할시 커스텀 가능)
// app.use((err, req, res, next) => {
//     // 에러 커스텀
// });

app.listen(3065, () => {
    console.log("서버 실행 중!!");
})