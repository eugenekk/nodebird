module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', { // 모델은 대문자, db는 소문자 복수로 테이블 생성됨(규칙)
        // id 는 디폴트 값
        src : {
            type : DataTypes.STRING(200),
            allowNull : false, //필수
        },
    }, {
        charset :'utf8',
        collate : 'utf8_general_ci' //한글 저장
    });
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post);
    };
    return Image;
}