const express = require('express');
const multer = require('multer');
const path = require('path') // node에서 제공
const fs = require('fs');

const { Post, Image, Comment, User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 사용자 로그인여부 확인하는 미들웨어

const router = express.Router();

try {
    fs.accessSync('uploads');
}catch(err) {
    console.log("uploads 폴더가 없으므로 폴더를 생성합니다.");
    fs.mkdirSync('uploads')
}

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
                    model :User, // 댓글 작성자
                    attribute :['id', 'nickname']
                }]
            },{
                model : User, // 게시글 작성자
                attribute :['id', 'nickname']
            },{
                model : User, // 좋아요 누른 사람
                as : 'Likers',
                attribute :['id']
            }
        ]
        })
        res.status(201).json(fullPost);
    }catch(err) {
        console.error(err);
        next(err);
    }
})

// 이미지 업로드
const upload = multer({
    storage : multer.diskStorage({ // 실습용 하드디스크 저장
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); // 확장자 추출(png)
            const basename = path.basename(file.originalname, ext); // 눈길
            done(null, basename + new Date().getTime() + ext); // 눈길1562123452.png
        }
    }),
    limits : { fileSize : 20 * 1024 * 1024 } // 20MB
})
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {  // multer는 모든 라우터에 미들웨어로 쓰지 않고, 라우터별로 개별적으로 넣어준다. 폼마다 필요할때만
    console.log('req', req.files);
    res.json(req.files.map((v) => v.filename));
     
})
// 게시글 삭제
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where : { id : req.params.postId}
        })
        if(!post) {
            return next('존재하지 않는 게시글 입니다.')
        }
        await Post.destroy({
            where : { 
                id : req.params.postId,
                UserId : req.user.id, // 내껏만 지울 수 있도록
            }
        })
        res.status(200).json({ PostId : parseInt(req.params.postId, 10) });
    } catch(err){
        console.error(err);
        next(err);
    }
})

// 게시글 수정
// router.patch('/:postId', async (req, res, next) => {
//     try {
//         const post = await Post.findOne({
//             where : { id : req.params.postId }
//         })
//         if(!post) {
//             return next("존재하지 않는 게시글입니다.")
//         }
//         await Post.update({
//             where : { id : req.params.postId }
//         })
//     } catch(err) {
//         console.error(err);
//         next(err)
//     }
// })

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

// 좋아요 
router.patch('/:postId/like', isLoggedIn, async (req, res, next)=>{
    try {
        const post = await Post.findOne({
            where : {id : req.params.postId}
        });
        if(!post) {
            return res.status(403).send('존재하지 않는 게시글 입니다.')
        }
        await post.addLikers(req.user.id);
        res.json({ PostId : post.id, UserId : req.user.id})
    }catch(err) {
        console.error(err);
        next(err)
    }
})

// 좋아요 해제
router.delete('/:postId/like', isLoggedIn, async (req, res, next)=>{
    try {
        const post = await Post.findOne({
            where : {id : req.params.postId}
        });
        if(!post) {
            return res.status(403).send('존재하지 않는 게시글 입니다.')
        }
        await post.removeLikers(req.user.id);
        res.json({ PostId : post.id, UserId : req.user.id})
    }catch(err) {
        console.error(err);
        next(err)
    }
})

module.exports = router;