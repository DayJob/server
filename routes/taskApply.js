var express = require('express');
var TaskApply = require('../models/taskApply');
var router = express.Router();
var apiPath = '/taskApply/';

var respond = require('./respond');

module.exports = function () {

    router.post(apiPath, function (req, res) {
        TaskApply.createData(req.body, function (success, data) {
            respond(res, success, data);
        });
    });

    router.get(apiPath + ':id', function (req, res) {
        TaskApply.findDataById(req.params.id, function (success, data) {
            respond(res, success, data);
        });
    });

    router.get(apiPath, function (req, res) {
        TaskApply.findData(req.query, function (success, data) {
            respond(res, success, data);
        });
    });

    router.put(apiPath + ':id', function (req, res) {
        TaskApply.updateDataById(req.params.id, req.body, function (success, data) {
            respond(res, success, data);
        });
    });

    router.delete(apiPath + ':id', function (req, res) {
        TaskApply.deleteDataById(req.params.id, function (success, data) {
            respond(res, success, data);
        });
    });

    return router;
};