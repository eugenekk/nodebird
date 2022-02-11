module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { // 모델은 대문자, db는 소문자 복수로 테이블 생성됨(규칙)
        // id 는 디폴트 값
        email : {
            type : DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull : false, //필수
            unique : true, //고유값
        },
        nickname : {
            type : DataTypes.STRING(30),
            allowNull : false, //필수
        },
        password : {
            type : DataTypes.STRING(100),
            allowNull : false, //필수
        },
    }, {
        charset :'utf8',
        collate : 'utf8_general_ci' //한글 저장
    });
    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through : "Like", as : 'Liked'}); //사용자-게시글좋아요
        db.User.belongsToMany(db.User, { through : "Follow", as : "Followers",  foreignKey : 'FollowingId'});
        db.User.belongsToMany(db.User, { through : "Follow", as : "Followings",  foreignKey : 'FollowerId'});
    };
    return User;
}