var express = require('express');
// var User = require('../models/user');
var router = express.Router();
var apiPath = '/users/';

var models = require('../models/sequelize');
var User = models.User;

// module.exports = function () {
//
// //user routing
//     router.get(apiPath, function (req, res) {
//         User.find({}, function (err, users) {
//             if (err) return res.json({success: false, message: err});
//             res.json({success: true, data: users});
//         });
//     });
//     router.post(apiPath, function (req, res) {
//         User.create(req.body, function (err, user) {
//             if (err) return res.json({success: false, message: err});
//             res.json({success: true, data: user});
//         });
//     });
//     router.get(apiPath + ':id', function (req, res) {
//         User.findById(req.params.id, function (err, user) {
//             if (err) return res.json({success: false, message: err});
//             res.json({success: true, data: user});
//         });
//     });
//     router.put(apiPath + ':id', function (req, res) {
//         req.body.updatedAt = Date.now();
//         User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
//             if (err) return res.json({success: false, message: err});
//             res.json({success: true, message: user._id + " updated"});
//         });
//     });
//     router.delete(apiPath + ':id', function (req, res) {
//         User.findByIdAndRemove(req.params.id, function (err, user) {
//             if (err) return res.json({success: false, message: err});
//             res.json({success: true, message: user._id + " deleted"});
//         });
//     });
//
//     return router;
// };

module.exports = function () {
    router.post(apiPath, function (req, res) {
        User.createData(req.body, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    router.get(apiPath + ':id', function (req, res) {
        User.findDataById(req.params.id, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    router.get(apiPath, function (req, res) {
        User.findData(req.query, function (status, data) {
            res.resJson(res, status, data);
        });

    });

    router.put(apiPath + ':id', function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.resJson(res, 401);
        }

    }, function (req, res) {
        User.updateDataById(req.params.id, req.body, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    router.delete(apiPath + ':id', function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.resJson(res, 401);
        }

    }, function (req, res) {
        User.deleteDataById(req.params.id, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    return router;
};