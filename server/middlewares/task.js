'use strict';

var task = require('../controllers/task').task,
    q = require('q');

/**
 * Async check if task has this owner
 */
function ownsTask(req){
  var deferred = q.defer();
  var id = req.body._id ? req.body._id : req.params.id;
  
  task.loadById(id)
  .then(function(response){
    if(response.users_id.toString() === req.headers['x-user-id']){
      deferred.resolve();
    }else{
      deferred.reject();
    }
  }, deferred.reject);
  
  return deferred.promise;
}
/**
 * Check if the user id at the task is the given one
 */
module.exports = {
  owns: function auth(req, res, next) {
    ownsTask(req).then(
    function(){
      return next();
    },
    function(){
      res.send(403);
    }
    );
  }
};

