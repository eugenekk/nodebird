const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 사용자 로그인여부 확인하는 미들웨어

const router = express.Router();

// 사용자 정보 불러오기
router.get('/', async (req, res, next) => {
    try{
        if(req.user) {
            const user = await User.findOne({
                where : {id : req.user.id},
            });
            const fullUserWithoutPassword = await User.findOne({ 
                where : { id : user.id },
                attributes : {
                    exclude : ['password']
                },
                include : [{
                    model : db.Post,
                    attributes : ['id']
                },{
                    model : db.User,
                    as : 'Followings',
                    attributes : ['id']
                },{
                    model : db.User,
                    as : 'Followers',
                    attributes : ['id']
                }]
            })
            res.status(200).json(fullUserWithoutPassword)
        } else {
            res.status(200).json(null)
        }
    }catch(err){
        console.error(err);
        next(err)
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => { // 미들웨어 확장
    passport.authenticate('local', (err, user, info) => {
        // 순서대로 서버에러, 성공객체, 클라이언트에러정보
        if(err) {
            console.error(err);
            return next(err);
        }
        if(info) {
            return res.status(401).send(info.reason)
        }
        return req.login(user, async (loginErr)=>{ //passport 로 전달
            if(loginErr) { // passport 쪽 로그인
                console.error(loginErr);
                return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({ 
                where : { id : user.id },
                attributes : {
                    exclude : ['password']
                },
                include : [{
                    model : db.Post,
                },{
                    model : db.User,
                    as : 'Followings'
                },{
                    model : db.User,
                    as : 'Followers'
                }]
            })
            return res.status(200).json(fullUserWithoutPassword); // 사용자 정보를 프론트로 전달
        })
    })(req, res, next);

});


router.post('/', isNotLoggedIn, async (req, res, next) => {
    try{
        const exUser = await User.findOne({
            where: {
                email : req.body.email,
            }
        })
        if(exUser) {
            return res.status(403).send('이미 사용 중인 아이디 입니다.') // 4XX : 보내는쪽의 잘못, 
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email : req.body.email,
            nickname : req.body.nickname,
            password : hashedPassword,
        });
        res.status(201).send('ok'); // 201 잘 생성됨
    }catch(err) {
        console.error(err);
        next(err); //에러 한방에 처리(?) 5XX : 서버쪽의 잘못
    }
})

router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok')
});

module.exports = router;