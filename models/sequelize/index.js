var sequelize = require('../../config/sequelize');

var User = require('./user');
var Task = require('./task');
var TaskApply = require('./task-apply');

sequelize.defineAll({
    User: User,
    Task: Task,
    TaskApply: TaskApply
});

module.exports = sequelize.models;

