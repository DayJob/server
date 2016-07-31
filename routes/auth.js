var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()){
    return next();
  }

	// if the user is not authenticated then redirect him to the login page
};
  
module.exports = function(passport){
    
  // router.post('/api/login', passport.authenticate('login', {
  //   successRedirect: '/',
	// 	failureRedirect: '/',
	// 	failureFlash : true
  // }));

	router.post('/api/login', function(req, res, next) {
	  passport.authenticate('login', function(err, user, info) {
	    if (err) {
				return next(err); }
	    if (!user) {
						return res.json(info);
				}
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.json(user);
	    });
	  })(req, res, next);
	});

	router.post('/api/signup', function(req, res, next) {
		if(req.body.nickname==""||req.body.nickname==null){
			res.json({message: 'Missing credential'});
		} else {
			passport.authenticate('signup', function(err, user, info) {
				if(info) return res.json(info);
				if (err) {
					return next(err); }
				if (!user) {
							return res.json(info);
					}
				req.logIn(user, function(err) {
					if (err) { return next(err); }
					return res.json(user);
				});
			})(req, res, next);
		}
	});

  // router.post('/api/signup', passport.authenticate('signup', {
	// 	successRedirect: '/',
	// 	failureRedirect: '/',
	// 	failureFlash : true
  // }));

    router.get('/api/logout', function(req, res) {
    	req.logout();
    	res.json(req.user);

    });

    router.get('/api/status', function(req, res){
    	console.log(req.isAuthenticated());
    		res.json(req.user);
    });
    
    //facebook login
	router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/'
	}), function(req, res) {
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