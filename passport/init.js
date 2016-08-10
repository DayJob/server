var login = require('./login');
var signup = require('./signup');
var facebook = require('./facebook');
var google = require('./google');
var models = require('../models/sequelize');
var User = models.User;

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user: ', user.name);
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        User.findDataById(user.id, function (status, user) {
            console.log('deserializing user');
            done(null, user);
        });

    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
    facebook(passport);
    google(passport);
};
