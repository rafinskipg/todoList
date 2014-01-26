var mongoose = require('mongoose');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var taskSchema = new Schema({
    users_id : ObjectId, 
    title : { type: String, default: 'New task' }, 
    body : String, 
    date : { type: Date, default: Date.now },    
    state : { type: Date, default: Date.now }
  });

mongoose.model('task', taskSchema);

