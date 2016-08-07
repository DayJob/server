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
                    where.userId = options.userId;
                }

                if (options.pay) {
                    where.pay = options.pay;
                }

                if (options.category) {
                    where.category = options.category;
                }

                var order = '';
                if (options.orderBy == "distance") {
                    order += '(POW(("latitude"-' + options.latitude + '),2) + POW(("longitude"-' + options.longitude + '),2))';
                } else if (options.orderBy == "createdAt") {
                    order += '"createdAt"'
                } else if (options.orderBy == "pay") {
                    order += '"pay"'
                }

                order += " " + options.sort;

                var query = {
                    where: where,
                    order: order,
                    offset: parseInt(options.offset)
                };

                if (options.limit) {
                    query.limit = parseInt(options.limit)
                }

                sequelize.models.Task.findData(query, function (status, data) {
                    callback(status, data);
                });

                // var query = 'SELECT * FROM "Tasks" AS "task"';
                //
                // query += ' INNER JOIN "Users" "users" ON "users"."id" = "task"."userId"';
                //
                // if (options.userId) {
                //     var where = " WHERE ";
                //     where += '"task"."userId" = ' + options.userId;
                //     query += where;
                // }
                //
                // if (options.category) {
                //     if (options.userId) {
                //         where += ' AND "task"."category" = ' + options.category;
                //         query += where;
                //     } else {
                //         var where = " WHERE ";
                //         where += '"task"."category" = ' + options.category;
                //         query += where;
                //     }
                // }
                //
                // var order = " ORDER BY ";
                //
                // if (options.orderBy == "distance") {
                //     order += '(POW(("task"."latitude"-' + options.latitude + '),2) + POW(("task"."longitude"-' + options.longitude + '),2))';
                // } else if (options.orderBy == "createdAt") {
                //     order += '"task"."createdAt"'
                // } else if (options.orderBy == "pay") {
                //     order += '"task"."pay"'
                // }
                //
                // order += " " + options.sort;
                //
                // query += order;
                //
                //
                // if (options.limit) {
                //     var limit = " LIMIT ";
                //     limit += options.limit;
                //     query += limit;
                // }
                //
                // var offset = " OFFSET ";
                // offset += options.offset;
                // query += offset;
                //
                // sequelize.query(query, {
                //     include: include()
                // }).spread(function(results, metadata)  {
                //     if (results) {
                //
                //         console.log({
                //             count: metadata.rowCount,
                //             rows: results
                //         });
                //
                //         callback(200, {
                //             count: metadata.rowCount,
                //             rows: results
                //         });
                //     }
                // });
            }
        })
    }
};