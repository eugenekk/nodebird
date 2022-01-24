const express = require('express');
const { Post, Image, Comment, User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 사용자 로그인여부 확인하는 미들웨어

const router = express.Router();

router.get('/', (req, res) => {
    res.json([
        { id : 1, content : 'hello'},
        { id : 2, content : 'hello2'},
        { id : 3, content : 'hello3'}
    ])
})

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.create({
            content : req.body.content,
            UserId : req.user.id, //passport deserialize user데이터
        });
        const fullPost = await Post.findOne({
            where : { id : post.id },
            include : [{
                model : Image,
            },{
                model : Comment,
                include :[{
                    model :User,
                    attribute :['id', 'nickname']
                }]
            },{
                model : User,
                attribute :['id', 'nickname']
            }]
        })
        res.status(201).json(fullPost);
    }catch(err) {
        console.error(err);
        next(err);
    }
})

router.delete('/', (req, res) => {
    res.json({id :1})
})

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
    try{
        //게시글 존재하는 지 확인
        const post = await Post.findOne({
            where : {
                id : req.params.postId
            }
        });
        if(!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        const comment = await Comment.create({
            content : req.body.content,
            PostId : parseInt(req.params.postId,10), //파라미터로 받음(문자->숫자로 변형하여 insert)
            UserId : req.user.id, //passport deserialize user데이터
        });
        const fullComment = await Comment.findOne({
            where :{ id : comment.id },
            include: [{
                model : User,
                attribute :['id', 'nickname']
            }]
        });
        res.status(201).json(fullComment);
    }catch(err) {
        console.error(err);
        next(err);
    };
})
module.exports = router;