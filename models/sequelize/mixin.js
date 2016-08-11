var errorHandler = require('../../utils/error-handler');

module.exports = function (sequelize, include, attributes) {
    return {
        'options': {
            'instanceMethods': {},
            'classMethods': {
                createData: function (body, callback) {
                    this.create(body, {
                        include: include()
                    }).then(function (data) {
                        return data;
                    }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                        if (data) {
                            data.reload().then(function () {
                                callback(200, data);
                            });
                        }
                    });
                },
                findDataById: function (id, callback) {
                    var query = {
                        include: include()
                    };

                    if (attributes) {
                        query.attributes = attributes();
                    }

                    this.findById(id, query).then(function (data) {
                        if (data) {
                            return data;
                        } else {
                            throw errorHandler.customError(404);
                        }
                    }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                        if (data) {
                            callback(200, data);
                        }
                    });
                },
                findData: function (query, callback) {
                    query.include = include();
                    if (attributes) {
                        query.attributes = attributes();
                    }
                    this.findAndCount(query).then(function (data) {
                        if (data.rows.length > 0) {
                            return data;
                        } else {
                            throw errorHandler.customError(404);
                        }
                    }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                        if (data) {
                            callback(200, data);
                        }
                    });
                },
                updateDataById: function (id, body, callback) {
                    var _this = this;

                    sequelize.transaction(function (t) {
                        return _this.findById(id, {
                            include: include(),
                            transaction: t
                        }).then(function (data) {
                            if (data) {
                                return data.update(body, {
                                    returning: true,
                                    transaction: t
                                })
                            } else {
                                throw errorHandler.customError(404);
                            }
                        }).then(function (data) {
                            console.log(data);
                            if (data) {
                                return data;
                            } else {
                                throw errorHandler.customError(404);
                            }
                        });
                    }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                        if (data) {
                            callback(200, data)
                        }
                    });

                },
                deleteDataById: function (id, callback) {
                    var _this = this;

                    sequelize.transaction(function (t) {
                        return _this.findById(id, {
                            include: include(),
                            transaction: t
                        }).then(function (data) {
                            if (data) {
                                return _this.destroy({
                                    where: {
                                        id: id
                                    },
                                    transaction: t
                                })
                            } else {
                                throw errorHandler.customError(404);
                            }
                        }).then(function (data) {
                            console.log(data);
                            if (data == 1) {
                                return data;
                            } else {
                                throw errorHandler.customError(404);
                            }
                        })

                    }).catch(errorHandler.catchCallback(callback)).done(function (data) {
                        if (data) {
                            callback(204, data);
                        }
                    });

                }
            }
        }
    }

};