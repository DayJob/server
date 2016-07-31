var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin')(sequelize);

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
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'longitude': {
            'type': Sequelize.STRING,
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
            getInclude: function () {
                return [{
                    'model': sequelize.models.User,
                    'as': 'creator',
                    'attributes': ['id', 'name', 'email', 'address', 'phone', 'gender', 'birth']
                }];
            },
            findTasks: function (query, callback) {
                var where = {};

                if (query.userId) {
                    where.userId = query.userId
                }

                if (query.pay) {
                    where.pay = query.pay
                }

                var options = {
                    where: where
                };
                
                sequelize.models.Task.findData(options, function (status, data) {
                    callback(status, data);
                });
            }
        })
    }
};