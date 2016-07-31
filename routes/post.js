var express = require('express');
var Post = require('../models/post');
var User = require('../models/user');
var router = express.Router();
var apiPath = '/post/';

var respond = require('./respond');

module.exports = function () {

//post routing
    router.get(apiPath + 'paginate/:offset/:limit', function (req, res) {
        var query = {};
        var options = {
            select: '_id title body createdAt creator',
            sort: {_id: 1},
            populate: 'creator',
            lean: false,
            offset: req.params.offset,
            limit: req.params.limit
        };

        Post.paginate(query, options, function (err, posts) {
            if (err) return res.json({success: false, message: err});

            res.json({success: true, data: posts});
        });

        // Post.find().select('_id title body').skip(req.params.offset)
        // .limit(req.params.limit).sort('_id').exec(function(err,posts){
        // 	if(err) return res.json({success:false, message:err});
        // 	res.json({success:true, data:posts});
        // });
    });
    router.get(apiPath, function (req, res) {
        Post.find({}, function (err, posts) {
            if (err) return res.json({success: false, message: err});
            res.json({success: true, data: posts});
        });
    });
    router.post(apiPath, function (req, res) {
        Post.create(req.body, function (err, post) {
            if (err) return res.json({success: false, message: err});

            User.findByIdAndUpdate(post.creator, {$push: {posts: post._id}}, {
                safe: true,
                upsert: true
            }, function (err, user) {
                if (err) console.logo(err);
            });

            res.json({success: true, data: post});
        });
    });
    router.get(apiPath + ':id', function (req, res) {
        Post.findById(req.params.id, function (err, post) {
            if (err) return res.json({success: false, message: err});
            res.json({success: true, data: post});
        });
    });
    router.put(apiPath + ':id', function (req, res) {
        req.body.updatedAt = Date.now();
        Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) return res.json({success: false, message: err});
            res.json({success: true, message: post._id + " updated"});
        });
    });
    router.delete(apiPath + ':id', function (req, res) {
        Post.findById(req.params.id, function (err, post) {
            if (err) return res.json({success: false, message: err});
            console.log(req.isAuthenticated());
            if (!req.user) return res.json({success: false, message: "You should login in first"});
            if (post == null) return res.json({success: false, message: "Already deleted"});
            if (post.creator.equals(req.user._id)) {
                Post.findByIdAndRemove(req.params.id, function (err, post) {
                    if (err) return res.json({success: false, message: err});
                    console.log(post._id + " deleted")
                    res.json({success: true, message: post._id + " deleted"});
                });
            } else {
                res.json({success: false, message: "User mismatch"});
            }
        });

    });
    router.get(apiPath + 'search/:keyword', function (req, res) {

        var query = Post.find().or([{"title": {$regex: req.params.keyword}}, {"body": {$regex: req.params.keyword}}]);
        var options = {
            select: '_id title body createdAt creator',
            sort: {_id: -1},
            populate: 'creator',
            lean: false,
            offset: 0,
            limit: 10
        };

        Post.paginate(query, options, function (err, posts) {
            if (err) return res.json({success: false, message: err});
            res.json({success: true, data: posts});
        });


        // Post.find().or([{"title": { $regex: req.params.keyword }},{"body":{$regex: req.params.keyword}}]).sort('title').exec(function(err,post){
        //   if(err) return res.json({success:false, message:err});
        //   res.json({success:true, data:post});
        // });
    });

    return router;
};