module.exports = function (Model, populate) {
    return {
        createData: function (body, callback) {
            var model = new Model(body);
            model.save(function (err, data) {
                if (err) {
                    callback(false, err);
                } else {
                    data.populate(populate, function (err, data) {
                        callback(200, data);
                    });
                }
            });
        },
        findDataById: function (id, callback) {
            Model.findById(id).populate(populate).exec(function (err, data) {

                if (err) {
                    callback(false, err);
                } else {
                    callback(200, data);
                }
            });
        },
        findData: function (query, callback) {
            Model.find(query).where('createdAt').lt(new Date()).populate(populate).exec(function (err, data) {

                if (err) {
                    callback(false, err);
                } else {
                    callback(200, data);
                }
            });
        },
        updateDataById: function (id, body, callback) {

            body.updatedAt = Date.now();

            Model.findOneAndUpdate({
                _id: id
            }, body, {new: true}).populate(populate).exec(function (err, data) {

                if (err) {
                    callback(false, err);
                } else {
                    callback(200, data);
                }

            });
        },
        deleteDataById: function (id, callback) {

            Model.findOneAndRemove({
                _id: id
            }).populate(populate).exec(function (err, data) {

                if (err) {
                    callback(false, err);
                } else {
                    callback(200, data);
                }

            });
        }
    };
};