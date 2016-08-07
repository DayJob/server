var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var include = function () {
    return [{
        'model': sequelize.models.User,
        'as': 'creator',
        'attributes': ['id', 'name', 'email', 'address', 'phone', 'gender', 'birth']
    }];
};

var mixin = require('./mixin')(sequelize, include);

module.exports = {
    fields: {
        'pay': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'description': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'address': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'date': {
            'type': Sequelize.DATE,
            'allowNull': false
        },
        'phone': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'category': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'latitude': {
            'type': Sequelize.DOUBLE,
            'allowNull': false
        },
        'longitude': {
            'type': Sequelize.DOUBLE,
            'allowNull': false
        },
        'image_name': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'userId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'creator',
            asReverse: 'tasks',
            allowNull: false
        }
    },
    options: {
        'charset': 'utf8',
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            findTasks: function (options, callback) {
                var where = {};

                if (options.userId) {
                    where.userId = options.userId
                }

                if (options.pay) {
                    where.pay = options.pay
                }

                if (options.category) {
                    where.category = options.category
                }

                var query = {
                    where: where,
                    order: [[options.orderBy, options.sort]],
                    offset: parseInt(options.offset)
                };

                if (options.limit) {
                    query.limit = parseInt(options.limit)
                }

                sequelize.models.Task.findData(query, function (status, data) {
                    callback(status, data);
                });
            }
        })
    }
};