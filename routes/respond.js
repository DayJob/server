module.exports = function (res, status, data) {
    var result = {
        status: status
    };

    if(status == 200){
        result.body = data
    } else {
        result.body = data
    }

    res.json(result);
};
