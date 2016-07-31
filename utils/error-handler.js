var META = require('../metadata/index');
var CODES = META.codes;

module.exports = {
    customError: function (status, code) {
        var _this = this;
        return {
            status: status,
            body: {
                code: code || status,
                detail: _this.errorTranslator(code || status)
            }
        };
    },
    refine: function (err) {
        if (err.status) {
            return {
                status: err.status,
                body: err.body
            };
        } else {
            return {
                status: 500,
                body: err
            };
        }
    },
    catchCallback: function (callback) {
        var _this = this;
        return function (err) {
            var refinedError = _this.refine(err);
            console.log(refinedError);
            callback(refinedError.status, refinedError.body);
        };
    },
    errorTranslator: function (errCode) {
        var lang = 'ko';

        return CODES[lang][errCode];
    }
};
