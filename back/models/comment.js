module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', { // 모델은 대문자, db는 소문자 복수로 테이블 생성됨(규칙)
        // id 는 디폴트 값
        content : {
            type : DataTypes.TEXT,
            allowNull : false, //필수
        },
    }, {
        charset :'utf8mb4',
        collate : 'utf8mb4_general_ci' //한글 & 이모티콘저장
    });
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User); //UserId 컬럼 생성됨
        db.Comment.belongsTo(db.Post);
    };
    return Comment;
}