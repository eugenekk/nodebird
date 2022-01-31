const express = require('express');
const { Op } = require('sequelize'); // 비교조건
const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
    try {
        console.log('req.query.lastId', req.query.lastId)
        const where = {}
        //초기 로딩이 아니면 (스크롤내려서 더 불러옴)
        if(parseInt(req.query.lastId, 10)) {
            where.id = { [Op.lt] : parseInt(req.query.lastId, 10)} // lastId 보다(lt) 작은 10개 불러오기
        }
        
        // 초기 로딩일 때
        const posts = await Post.findAll({
            where,
            // where : { id : lastId }, // (비추) offset : 0, // 시작기준점
            limit : 10,
            order : [
                ['createdAt', 'DESC'], // 게시글 내림차순 정렬
                [ Comment, 'createdAt', 'DESC'], // 댓글 내림차순 정렬
            ], 
            include : [{
                model : User,
                attribute :['id' ,'nickname'],
            },{
                model : Image,
            },
            {
                model : Comment,
                include : [{
                    model : User,
                    attribute :['id' ,'nickname'],
                }]
            },{
                model : User, // 좋아요 누른 사람
                as : 'Likers',
                attribute :['id']
            },{
                model : Post, 
                as : "Retweet",
                include : [{
                    model : User,
                    attribute : ['id', 'nickname']
                },{
                    model : Image,
                }]
            }],
        })
        res.status(200).json(posts);

    } catch(err) {
        console.error(err)
        next(err)
    }
})
module.exports = router;