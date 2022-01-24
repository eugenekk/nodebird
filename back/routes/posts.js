const express = require('express');
const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
    try {
        const posts = await Post.findAll({
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
            }],
        })
        res.status(200).json(posts);

    } catch(err) {
        console.error(err)
        next(err)
    }
})
module.exports = router;