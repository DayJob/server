var errorHandler = require('./error-handler');

var resJson = function (res, status, data) {

    if (!data) {
        data = {};
    }

    if (!data.status) {
        data.status = status;
    }

    if (status >= 200 && status < 400) {


    } else {
        data.message = errorHandler.errorTranslator(data.status);
    }

    res.status(status).json(data);
};

module.exports = function () {
    return function (req, res, next) {
        res.resJson = resJson;
        next();
    };
};