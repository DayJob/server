var mongoose = require('mongoose'), Schema = mongoose.Schema;

var userSchema = Schema({
  email: {type:String, required:true, unique:true},
  nickname: {type:String, required:true, unique:true},
  password: {type:String, required:true, unique:true},
  posts : [{ type: Schema.Types.ObjectId, ref: 'post'}],
  createdAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model('user', userSchema);
