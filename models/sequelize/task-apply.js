var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var errorHandler = require('../../utils/error-handler');

var include = function () {
    return [{
        'model': sequelize.models.Task,
        'as': 'task'
    }, {
        'model': sequelize.models.User,
        'as': 'user',
        'attributes': ['id', 'name', 'email', 'address', 'phone', 'gender', 'birth']
    }];
};

var mixin = require('./mixin')(sequelize, include);

module.exports = {
    fields: {
        'taskId': {
            reference: 'Task',
            referenceKey: 'id',
            as: 'task',
            allowNull: false
        },
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'user',
            allowNull: false
        }
    },
    options: {
        'charset': 'utf8',
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            createTaskApply: function (body, callback) {
                console.log(body);
                sequelize.transaction(function (t) {
                    return sequelize.models.TaskApply.findOne({
                        where: {
                            taskId: body.taskId,
                            userId: body.userId
                        },
                        transaction: t
                    }).then(function (task) {
                        if (task) {
                            throw errorHandler.customError(409);
                        } else {
                            return sequelize.models.TaskApply.create(body, {
                                include: include(),
                                transaction: t
                            });
                        }
                    })
                }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                    if (data) {
                        data.reload().then(function () {
                            callback(200, data);
                        });
                    }
                });
            },
            deleteTaskApply: function (body, callback) {
                sequelize.transaction(function (t) {
                    return sequelize.models.TaskApply.findOne({
                        where: {
                            taskId: body.taskId,
                            userId: body.userId
                        },
                        transaction: t
                    }).then(function (task) {
                        if (task) {
                            return task.destroy({
                                transaction: t
                            });
                        } else {
                            throw errorHandler.customError(404);
                        }
                    }).then(function () {
                        return true;
                    })
                }).catch(errorHandler.catchCallback(callback)).done(function (done) {
                    if (done) {
                        callback(200, {
                            destroy: true
                        });
                    }
                });
            },
            findTaskApplies: function (options, callback) {
                var where = {};

                if (options.userId) {
                    where.userId = options.userId;
                }

                if (options.taskId) {
                    where.taskId = options.taskId;
                }

                var query = {
                    where: where,
                    order: [[options.orderBy, options.sort]],
                    offset: parseInt(options.offset)
                };

                if (options.limit) {
                    query.limit = parseInt(options.limit)
                }

                sequelize.models.TaskApply.findData(query, function (status, data) {
                    callback(status, data);
                });
            }
        })
    }
};