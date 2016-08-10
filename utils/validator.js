var keys = [];
var errorList = [];

var check = function (key) {
    keys.push(key);
};

var checkCredentials = function (body) {

    for (var i = 0; i < keys.length; i++) {
        if (body[keys[i]] == "" || body[keys[i]] == null) {
            errorList.push(keys[i]);
        }
    }

};

var execute = function (req, res, next) {

    if (req.method == 'GET') {
        checkCredentials(req.query);
    } else {
        checkCredentials(req.body);
    }

    if (errorList.length > 0) {
        console.log('errorList', errorList);
        res.resJson(res, 400, {
            status: '400_14',
            data: errorList
        });
    } else {
        next();
    }

    errorList = [];
    keys = [];
};

module.exports = function () {
    return function (req, res, next) {
        req.check = check;
        req.execute = execute;

        next();
    };
};