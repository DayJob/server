var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var postSchema = Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'user'},
    title: {type: String, required: true},
    body: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date
});

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('post', postSchema);
