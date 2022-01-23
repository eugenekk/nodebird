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
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsToMany(db.Hashtag, { through : "PostHashtag"});
        db.Post.belongsToMany(db.User, { through : "Like", as : 'Likers'}); //사용자-게시글좋아요
        db.Post.belongsTo(db.Post, { as : 'Retweet'});
    };
    return Post;
}