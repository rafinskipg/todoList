var mongoose = require('mongoose'),
    userModel = mongoose.model('User'),
    q = require('q');


function loadUser(id){
  var deferred = q.defer();
  userModel.findOne({ _id : id}, function (err, user) {
    if (err) {
      deferred.reject(err);
    }else{
      deferred.resolve(user);
    }
  });
  return deferred.promise;
}

function loadUsers(id){
  var deferred = q.defer();
  userModel.find({}, function (err, users) {
    if (err) {
      deferred.reject(err);
    }else{
      deferred.resolve(users);
    }
  });
  return deferred.promise;
}

function jsonResponse(response){
  return function(data){
    return response.json(data);
  };
}

function jsonErrorResponse(response){
  return function(data){
    return response.json(500, data);
  };
}

var user = exports.user = {};

var get = exports.user.get = function(req, res) {
  loadUser(req.params.id)
    .then(jsonResponse(res));
};

var getList = exports.user.getList = function(req, res) {
  loadUsers()
    .then(jsonResponse(res));
};

var loadById = exports.user.loadById = function (id){
  return loadUser(id);
};