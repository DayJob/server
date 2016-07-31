var express = require('express');
// var Task = require('../models/task');
var router = express.Router();
var apiPath = '/task/';

var models = require('../models/sequelize');
var Task = models.Task;

var respond = require('./respond');

module.exports = function () {

    router.post(apiPath, function (req, res) {
        Task.createData(req.body, function (status, data) {
            respond(res, status, data);
        });
    });

    router.get(apiPath + ':id', function (req, res) {
        Task.findDataById(req.params.id, function (status, data) {
            respond(res, status, data);
        });
    });

    router.get(apiPath, function (req, res) {
        Task.findTasks(req.query, function (status, data) {
            respond(res, status, data);
        });
    });

    router.put(apiPath + ':id', function (req, res) {
        Task.updateDataById(req.params.id, req.body, function (status, data) {
            respond(res, status, data);
        });
    });

    router.delete(apiPath + ':id', function (req, res) {
        Task.deleteDataById(req.params.id, function (status, data) {
            respond(res, status, data);
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