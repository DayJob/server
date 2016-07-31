var sequelize = require('../../config/sequelize');

var User = require('./user');
var Task = require('./task');

sequelize.defineAll({
    User: User,
    Task: Task
});

module.exports = sequelize.models;

