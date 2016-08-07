var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
};

module.exports = function (passport) {

    // router.post('/api/login', passport.authenticate('login', {
    //   successRedirect: '/',
    // 	failureRedirect: '/',
    // 	failureFlash : true
    // }));

    router.post('/login', function (req, res, next) {

        req.check('email');
        req.check('password');

        req.execute(req, res, next);
        // var isFail;
        //
        // checkCredentials('email');
        // checkCredentials('password');
        //
        // if (!isFail) {
        //     next();
        // }
        //
        // function checkCredentials(key) {
        //     if (req.body[key] == "" || req.body[key] == null) {
        //         isFail = true;
        //         res.resJson(res, 400, {
        //             status: '400_14',
        //             key: key
        //         });
        //     }
        // }
    }, function (req, res, next) {
        passport.authenticate('login', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.resJson(res, 404);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.resJson(res, 200, user);
            });
        })(req, res, next);
    });

    router.post('/signup', function (req, res, next) {

        req.check('name');
        req.check('email');
        req.check('password');
        req.check('address');
        req.check('phone');
        req.check('gender');
        req.check('birth');

        req.execute(req, res, next);
        // var isFail;
        //
        // checkCredentials('name');
        // checkCredentials('email');
        // checkCredentials('password');
        //
        // if (!isFail) {
        //     next();
        // }
        //
        // function checkCredentials(key) {
        //     if (req.body[key] == "" || req.body[key] == null) {
        //         isFail = true;
        //         res.resJson(res, 400, {
        //             status: '400_14',
        //             key: key
        //         });
        //     }
        // }
    }, function (req, res, next) {

        passport.authenticate('signup', function (err, user, info) {
            if (info) return res.json(info);
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json(info);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.json(user);
            });
        })(req, res, next);

    });

    // router.post('/api/signup', passport.authenticate('signup', {
    // 	successRedirect: '/',
    // 	failureRedirect: '/',
    // 	failureFlash : true
    // }));

    router.get('/logout', function (req, res) {
        if (req.user) {
            req.logout();
            if (req.user) {
                console.log('logout error');
                res.resJson(res, 500);
            } else {
                res.resJson(res, 204);
            }
        } else {
            res.resJson(res, 401);
        }

    });

    router.get('/status', function (req, res) {
        if(req.isAuthenticated()){
            res.resJson(res, 200, req.user);
        } else {
            res.resJson(res, 401);
        }

    });

    //facebook login
    router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/'
    }), function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

    //google logIn
    router.get('/auth/google', passport.authenticate('google', {scope: 'email'}));

    router.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

    return router;
};