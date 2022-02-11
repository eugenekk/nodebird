const express = require('express');
const multer = require('multer');
const path = require('path') // node에서 제공
const fs = require('fs');

const { Post, Image, Comment, User, Hashtag } = require('../models');
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


// 이미지 업로드
const upload = multer({
    storage : multer.diskStorage({ // 실습용 하드디스크 저장
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); // 확장자 추출(png)
            const basename = path.basename(file.originalname, ext); // 눈길
            done(null, basename + '_' + new Date().getTime() + ext); // 눈길1562123452.png
        }
    }),
    limits : { fileSize : 20 * 1024 * 1024 } // 20MB
})
// 게시글 & 이미지 업로드
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const hashtag = req.body.content.match(/#[^\s#]+/g);
        const post = await Post.create({
            content : req.body.content,
            UserId : req.user.id, //passport deserialize user데이터
        });
        if(hashtag) {
            const result = await Promise.all(hashtag.map((tag) => Hashtag.findOrCreate({ 
                where: {
                    name : tag.slice(1).toLowerCase() 
                }
            }))); // result : [[노드, true], [react, false]]
            await post.addHashtags(result.map((v) => v[0]));
        }
        if(req.body.image) {
            if(Array.isArray(req.body.image)) { // image : [123.png, 456.png]
                const images = await Promise.all(req.body.image.map((image) => Image.create({ src : image })));
                await post.addImages(images);
            } else { // 이미지 한개만 올리면 123.png
                const image = await Image.create({ src : req.body.image });
                await post.addImages(image);
            }
        }
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

router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {  // multer는 모든 라우터에 미들웨어로 쓰지 않고, 라우터별로 개별적으로 넣어준다. 폼마다 필요할때만
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


router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
    try{
        //게시글 존재하는 지 확인
        const post = await Post.findOne({
            where : {
                id : req.params.postId
            },
            inclue : [{
                model : Post,
                as : 'Retweet'
            }]
        });
        if(!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.usee.id)) {
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.')
        }
        const retweetTargetid = post.RetweetId || post.id;
        const exPost = await Post.findOne({ // 내가 이미 리트윗했는지 찾기
            where : {
                UserId : req.user.id,
                RetweetId : retweetTargetid,
            }
        })
        if(exPost){
            return res.status(403).send('이미 리트윗했습니다.')
        }
        const retweet = await Post.create({
            UserId : req.user.id,
            RetweetId : retweetTargetid,
            content: 'retweet',
        });
        const retweetWithPrevPost = await Post.findOne({ // 내가 어떤 게시글을 리트윗했는지 데이터 추가
            where : { id : retweet.id},
            include : [{
                model : Post, 
                as : "Retweet",
                include : [{
                    model : User,
                    attribute : ['id', 'nickname']
                },{
                    model : Image,
                }]
            },{
                model : User,
                attribute : ['id', 'nickname']
            },{
                model : Image,
            }, {
                model : Comment,
                include : [{
                    model : User,
                    attribute : ['id', 'nickname']
                }]
            }, {
                model : User,
                as : 'Likers',
                attribute : ['id']
            }],
        })
        res.status(201).json(retweetWithPrevPost);
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

// 게시글 1개 불러오기(다이나믹 라우팅)
router.get('/:postId', async (req, res, next) => { //GET /post/1
    try{
        //게시글 존재하는 지 확인
        const post = await Post.findOne({
            where : {
                id : req.params.postId
            },
        });
        if(!post) {
            console.log('존재하지 않는 게시글')
            return res.status(404).send('존재하지 않는 게시글입니다.');
        }
        const fullPost = await Post.findOne({ // 게시글 전체 정보
            where : { id : post.id},
            include : [{
                model : Post, 
                as : "Retweet",
                include : [{
                    model : User,
                    attribute : ['id', 'nickname']
                },{
                    model : Image,
                }]
            },{
                model : User,
                attribute : ['id', 'nickname']
            },{
                model : User,
                as : 'Likers',
                attribute : ['id', 'nickname']
            },{
                model : Image,
            }, {
                model : Comment,
                include : [{
                    model : User,
                    attribute : ['id', 'nickname']
                }]
            }, {
                model : User,
                as : 'Likers',
                attribute : ['id']
            }],
        })
        res.status(200).json(fullPost);
    }catch(err) {
        console.error(err);
        next(err);
    };
})

module.exports = router;