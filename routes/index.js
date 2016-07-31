var express = require('express');

var router = express.Router();

module.exports = function (passport) {
    var auth = require('./auth')(passport);
    var user = require('./user')();
    var post = require('./post')();
    var task = require('./task')();
    var taskApply = require('./taskApply')();

    router.use('/api/', auth, user, post, task, taskApply);

    var data = {count: 0, user: ""};
    router.get('/', function (req, res) {
        data.count++;
        res.render('index', data);
    });

    return router;
};
