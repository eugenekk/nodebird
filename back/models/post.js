module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { // 모델은 대문자, db는 소문자 복수로 테이블 생성됨(규칙)
        // id 는 디폴트 값
        content : {
            type : DataTypes.TEXT,
            allowNull : false, //필수
        },
    }, {
        charset :'utf8mb4',
        collate : 'utf8mb4_general_ci' //한글 & 이모티콘저장
    });
    Post.associate = (db) => { // 자동 메서드 생성
        db.Post.belongsTo(db.User); // post.addUser, getUser,
        db.Post.hasMany(db.Comment); // post.addComments, post.getComments
        db.Post.hasMany(db.Image); // post.addImages, post.getImages
        db.Post.belongsToMany(db.Hashtag, { through : "PostHashtag"}); // post.addHashtags
        db.Post.belongsToMany(db.User, { through : "Like", as : 'Likers'}); //사용자-게시글좋아요 //post.addLikers, post.removeLikers
        db.Post.belongsTo(db.Post, { as : 'Retweet'}); // post.addRetweet
    };
    return Post;
}