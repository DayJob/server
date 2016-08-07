var LocalStrategy = require('passport-local').Strategy;
var models = require('../models/sequelize');
var User = models.User;
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

    passport.use('signup', new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {

            findOrCreateUser = function () {

                return User.findOne({
                    where: {
                        email: email
                    }
                }).then(function (user) {
                    if (user) {
                        console.log('User already exists with email: ' + email);
                        return done(null, false, {message: '해당 이메일로 등록된 계정이 있습니다.'});
                    } else {

                        var body = {
                            email: email,
                            password: createHash(password),
                            name: req.param('name'),
                            address: req.param('address'),
                            phone: req.param('phone'),
                            gender: req.param('gender'),
                            birth: req.param('birth')
                        };

                        User.createData(body, function (status, data) {
                            if (status == 200) {
                                console.log('User Registration succesful');
                                return done(null, data);
                            } else {
                                console.log('Error in Saving user: ' + status);
                                throw status;
                            }
                        });

                    }
                }).catch(function (err) {
                    console.log('Error in SignUp: ' + err);
                    return done(err);
                }).done(function (data) {
                    return data;
                });

            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};
