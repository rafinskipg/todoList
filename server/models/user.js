var mongoose = require('mongoose');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var userSchema = new Schema({
  name : { type: String, default: 'User name' },
  state : { type: Number, default: 0 }
});

mongoose.model('User', userSchema);

