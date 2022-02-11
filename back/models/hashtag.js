module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', { // 모델은 대문자, db는 소문자 복수로 테이블 생성됨(규칙)
        // id 는 디폴트 값
        name : {
            type : DataTypes.STRING(20),
            allowNull : false, //필수
        },
    }, {
        charset :'utf8mb4',
        collate : 'utf8mb4_general_ci' //한글 & 이모티콘저장
    });
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, { through : "PostHashtag"});
    };
    return Hashtag;
}