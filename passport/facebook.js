var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
  passport.use('facebook', new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://goodtogo.herokuapp.com/auth/facebook/callback",
      profileFields: ['id', 'emails', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      findOrCreateUser = function(){
        User.findOne({'email': profile.emails[0].value}, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user) {
              done(null, user);
          } else {

              var newUser = new User();

              newUser.nickname = profile.displayName;
              newUser.password = createHash('1234');
              newUser.email = profile.emails[0].value;

              newUser.save(function(err) {
                  if (err){
                      console.log('Error in Saving user: '+err);
                      throw err;
                  }
                  console.log('User Registration succesful');
                  return done(null, newUser);
              });

          }

        });
      };

      process.nextTick(findOrCreateUser);
    }
  ));

  var createHash = function(password){
      return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };
};
