var LocalStrategy = require('passport-local').Strategy;
var models = require('../models/sequelize');
var User = models.User;
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
    passport.use('login', new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            return User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {

                if (user) {
                    if (isValidPassword(user, password)) {
                        delete user.dataValues.password;
                        delete user.dataValues.fcmToken;
                        delete user.dataValues.createdAt;
                        delete user.dataValues.updatedAt;
                        return done(null, user);
                    } else {
                        console.log('Invalid Password');
                        return done(null, false, {message: '비밀번호을 다시 확인해주세요.'}); // redirect back to login page
                    }
                } else {
                    console.log('User Not Found with email ' + email);
                    return done(null, false, {message: '해당 이메일을 찾을 수 없습니다.'});
                }

            }).catch(function (err) {
                console.log('Error in Login: ' + err);
                return done(err);
            }).done(function (data) {
                return data;
            });

        })
    );

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };

};
