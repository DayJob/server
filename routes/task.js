var express = require('express');
// var Task = require('../models/task');
var router = express.Router();
var apiPath = '/task/';

var models = require('../models/sequelize');
var Task = models.Task;

module.exports = function () {

    router.post(apiPath, function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.resJson(res, 401);
        }

    }, function (req, res) {
        req.body.userId = req.user.id;
        console.log(req.body);
        Task.createData(req.body, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    router.get(apiPath + ':id', function (req, res) {
        Task.findDataById(req.params.id, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    router.get(apiPath, function (req, res, next) {
        if (req.query.orderBy === undefined) {
            req.query.orderBy = "createdAt"
        } else {

        }

        if (req.query.sort === undefined) {
            req.query.sort = "DESC"
        } else {

        }

        if (req.query.limit === undefined) {

        } else {

        }

        if (req.query.offset === undefined) {
            req.query.offset = "0"
        } else {

        }

        req.execute(req, res, next);

    }, function (req, res) {
        Task.findTasks(req.query, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    router.put(apiPath + ':id', function (req, res) {
        Task.updateDataById(req.params.id, req.body, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    router.delete(apiPath + ':id', function (req, res) {
        Task.deleteDataById(req.params.id, function (status, data) {
            res.resJson(res, status, data);
        });
    });

// router.post(apiPath, function (req, res) {
//     Task.createData(req.body, function (status, data) {
//         respond(res, status, data);
//     });
// });
//
// router.get(apiPath + ':id', function (req, res) {
//     Task.findDataById(req.params.id, function (status, data) {
//         respond(res, status, data);
//     });
// });
//
// router.get(apiPath, function (req, res) {
//     Task.findData(req.query, function (status, data) {
//         respond(res, status, data);
//     });
// });
//
// router.put(apiPath + ':id', function (req, res) {
//     Task.updateDataById(req.params.id, req.body, function (status, data) {
//         respond(res, status, data);
//     });
// });
//
// router.delete(apiPath + ':id', function (req, res) {
//     Task.deleteDataById(req.params.id, function (status, data) {
//         respond(res, status, data);
//     });
// });

    return router;
};