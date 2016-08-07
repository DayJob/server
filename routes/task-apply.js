var request = require('request');
var express = require('express');
// var TaskApply = require('../models/task-apply');
var router = express.Router();
var apiPath = '/task-apply/';

var models = require('../models/sequelize');
var TaskApply = models.TaskApply;
var User = models.User;

module.exports = function () {

    router.post(apiPath, function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.resJson(res, 401);
        }

    }, function (req, res) {
        req.body.userId = req.user.id;
        TaskApply.createTaskApply(req.body, function (status, data) {
            User.findDataById(data.task.userId, function (status, data) {
                if (status == 200) {

                    if (data.fcmToken) {
                        request.post({
                            headers: {
                                'Authorization': 'key=' + process.env.FCM_SERVER_KEY,
                                'Content-Type': 'application/json'
                            },
                            json: {
                                "notification": {
                                    "title": "DayJob",
                                    "body": "지원자가 있습니다!",
                                    "sound": "default",
                                    "click_action": "OPEN_ACTIVITY_1"
                                },
                                "data": {
                                    "score": "4x8",
                                    "time": "15:16.2342"
                                },
                                "to": data.fcmToken

                            },
                            url: 'https://fcm.googleapis.com/fcm/send'
                        }, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                if (body.success == 1) {
                                    res.resJson(res, status, data);
                                }
                            } else {
                                if (!error) {
                                    console.log(error);
                                }
                                res.resJson(res, 500);
                            }

                        });
                    } else {
                        res.resJson(res, status, data);
                    }
                } else {
                    res.resJson(res, 404);
                }
            });


        });
    });

    router.get(apiPath + ':id', function (req, res) {
        TaskApply.findDataById(req.params.id, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    router.get(apiPath, function (req, res, next) {
        console.log('gets', req.user);
        if (req.user) {
            next();
        } else {
            res.resJson(res, 401);
        }

    }, function (req, res, next) {
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

        TaskApply.findTaskApplies(req.query, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    router.delete(apiPath + ':id', function (req, res, next) {
        console.log('destroy', req.user);
        if (req.user) {
            next();
        } else {
            res.resJson(res, 401);
        }

    }, function (req, res) {
        var body = {
            taskId: req.params.id,
            userId: req.user.id
        };

        TaskApply.deleteTaskApply(body, function (status, data) {
            res.resJson(res, status, data);
        });
    });

    // router.post(apiPath, function (req, res) {
    //     TaskApply.createData(req.body, function (success, data) {
    //         res.resJson(res, success, data);
    //     });
    // });
    //
    // router.get(apiPath + ':id', function (req, res) {
    //     TaskApply.findDataById(req.params.id, function (success, data) {
    //         res.resJson(res, success, data);
    //     });
    // });
    //
    // router.get(apiPath, function (req, res) {
    //     TaskApply.findData(req.query, function (success, data) {
    //         res.resJson(res, success, data);
    //     });
    // });
    //
    // router.put(apiPath + ':id', function (req, res) {
    //     TaskApply.updateDataById(req.params.id, req.body, function (success, data) {
    //         res.resJson(res, success, data);
    //     });
    // });
    //
    // router.delete(apiPath + ':id', function (req, res) {
    //     TaskApply.deleteDataById(req.params.id, function (success, data) {
    //         res.resJson(res, success, data);
    //     });
    // });

    return router;
};