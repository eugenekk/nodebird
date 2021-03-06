const express = require('express');
const { User, Post, Image, Comment } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 사용자 로그인여부 확인하는 미들웨어
const { Op } = require('sequelize');
const router = express.Router();

// 사용자 정보 불러오기
router.get('/', isLoggedIn, async (req, res, next) => { 
    try{
        if(req.user) {
            // const user = await User.findOne({
            //     where : {id : req.user.id},
            // });
            const fullUserWithoutPassword = await User.findOne({ 
                where : { id : req.user.id },
                attributes : {
                    exclude : ['password']
                },
                include : [{
                    model : Post,
                    attributes : ['id']
                },{
                    model : User,
                    as : 'Followings',
                    attributes : ['id']
                },{
                    model : User,
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

//프로필 - 팔로워목록
router.get('/followers', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where : { id : req.user.id }
        })
        if(!user) {
            res.status(403).send("존재하지 않는 사용자 입니다.")
        }
        const followers = await user.getFollowers({
            limit : parseInt(req.query.limit, 10),
        });
        res.status(200).json(followers);
    } catch (err) {
        console.error(err);
        next(err)
    }
})

//프로필 - 팔로잉목록
router.get('/followings', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where : { id : req.user.id }
        })
        if(!user) {
            res.status(403).send("존재하지 않는 사용자 입니다.")
        }
        const followings = await user.getFollowings({
            limit : parseInt(req.query.limit, 10),
        });
        res.status(200).json(followings);
    } catch (err) {
        console.error(err);
        next(err)
    }
})

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


// 닉네임 변경
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        const user = User.findOne({
            where : { id : req.user.id }
        })
        if(!user) {
            res.status(403).send("존재하지 않는 사용자 입니다.")
        }
        await User.update({
            nickname : req.body.nickname
        },{
            where: { id : req.user.id }
        })
        res.status(200).json({ nickname : req.body.nickname })
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok')
});

// 나를 팔로우하는 사람을 차단
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where : { id : req.params.userId } // 나를 팔로우하는 사람
        })
        if(!user) {
            res.status(403).send("존재하지 않는 사용자 입니다.")
        }
        await user.removeFollowings(req.user.id)
        res.status(200).json({ UserId : parseInt(req.params.userId, 10 ) })
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 특정 사용자 정보 불러오기
router.get('/:id', async (req, res, next) => {  //GET /user/3
    try{
        const fullUserWithoutPassword = await User.findOne({ 
            where : { id : req.params.id },
            attributes : {
                exclude : ['password']
            },
            include : [{
                model : Post,
                attributes : ['id']
            },{
                model : User,
                as : 'Followings',
                attributes : ['id']
            },{
                model : User,
                as : 'Followers',
                attributes : ['id']
            }]
        })

        if(fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();
            data.Posts = data.Posts.length; // 개인정보 침해 예방
            data.Followings = data.Followings.length;
            data.Followers = data.Followers.length;
            res.status(200).json(data)
        } else {
            res.status(404).send('존재하지 않는 사용자 입니다.')
        }
    }catch(err){
        console.error(err);
        next(err)
    }
});

// 팔로우
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where : { id : req.params.userId }
        })
        if(!user) {
            res.status(403).send("존재하지 않는 사용자 입니다.")
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({ UserId : parseInt(req.params.userId, 10) })
    } catch(err) {
        console.error(err);
        next(err);
    }
});
// 언팔로우
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where : { id : req.params.userId }
        })
        if(!user) {
            res.status(403).send("존재하지 않는 사용자 입니다.")
        }
        await user.removeFollowers(req.user.id)
        res.status(200).json({ UserId : parseInt(req.params.userId, 10 ) })
    } catch(err) {
        console.error(err);
        next(err);
    }
});


// 특정 사용자의 게시글
router.get('/:userId/posts', async (req, res, next) => { // GET /user/1/posts
    try {
        const where = { UserId : req.params.userId };
        if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
          where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
        } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
        const posts = await Post.findAll({
          where,
          limit: 10,
          order: [
            ['createdAt', 'DESC'],
            [Comment, 'createdAt', 'DESC'],
          ],
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }, {
            model: Image,
          }, {
            model: Comment,
            include: [{
              model: User,
              attributes: ['id', 'nickname'],
            }],
          }, {
            model: User, // 좋아요 누른 사람
            as: 'Likers',
            attributes: ['id'],
          }, {
            model: Post,
            as: 'Retweet',
            include: [{
              model: User,
              attributes: ['id', 'nickname'],
            }, {
              model: Image,
            }]
          }],
        });
        res.status(200).json(posts);
      } catch (error) {
        console.error(error);
        next(error);
      }
    });


module.exports = router;