var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin')(sequelize);

module.exports = {
    fields: {
        'name': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'email': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'password': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'address': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'phone': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'gender': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'birth': {
            'type': Sequelize.STRING,
            'allowNull': true
        }
    },
    options: {
        'charset': 'utf8',
        'hooks': {},
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            getInclude: function () {
                return [{
                    'model': sequelize.models.Task,
                    'as': 'tasks'
                }];
            }
        })
    }
};