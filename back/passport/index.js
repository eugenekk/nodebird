const passport = require('passport');
const local = require('./local')
const { User } = require("../models");

module.exports = () =>{
    passport.serializeUser((user, done) =>{
        done(null, user.id);

    });
    passport.deserializeUser(async (id, done) => { // 세션에 아이디만 저장 (라우터 접근시 매번 사용자 정보 복구하여 user에 담는다)
        try {
            const user = await User.findOne({
                where : id
            });
            done(null, user)
        }catch(err) {
            console.error(err);
            done(err)
        }
        

    });
    local();

}