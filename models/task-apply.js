var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var taskApplySchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: 'task'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

var TaskApply = mongoose.model('taskApply', taskApplySchema);
var mixin = require('./mixin')(TaskApply, 'task user');

taskApplySchema.plugin(mongoosePaginate);

module.exports = mixin;