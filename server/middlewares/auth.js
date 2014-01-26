'use strict';

var user = require('../controllers/user').user,
    q = require('q');

/**
 * Async check if user exists / Returns true if all is valid / false otherwise
 */
function checkValidUserData(req){
  var deferred = q.defer();
  if(!req.headers['x-user-id'] || !req.headers['x-session-id'] ){
    deferred.reject();
  }else{
    user.loadById(req.headers['x-user-id'])
    .then(deferred.resolve, deferred.reject);
  }
  return deferred.promise;
}
/**
 * Check if userId and sessionId headers are present
 */
module.exports = {
  auth: function auth(req, res, next) {
    checkValidUserData(req).then(
    function(){
      return next();
    },
    function(){
      res.send(403);
    }
    );
  }
};

