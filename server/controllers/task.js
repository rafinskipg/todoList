var mongoose = require('mongoose'),
    taskModel = mongoose.model('task'),
    q = require('q'),
    _ = require('lodash');


function loadById(id){
  var deferred = q.defer();
  taskModel.findById(id, function (err, task) {
    if (err) {
      deferred.reject(err);
    }else{
      deferred.resolve(task);
    }
  });
  return deferred.promise;
}

function loadTasks(model){
  var deferred = q.defer();
  taskModel.find(model, function (err, tasks) {
    if (err) {
      deferred.reject(err);
    }else{
      deferred.resolve(tasks);
    }
  });
  return deferred.promise;
}

function createTask(taskEntity, userId){
  var deferred = q.defer();
  taskEntity.users_id = userId;
  var instance = new taskModel(taskEntity);
  deferred.resolve(instance);
  return deferred.promise;
}

function saveTask(taskInstance){
  var deferred = q.defer();
  taskInstance.save(function(err) {
    if (err) {
      deferred.reject(err);
    }else{
      deferred.resolve(taskInstance);
    }
  });
  return deferred.promise;
}

function updateTask(taskInstance){
  var deferred = q.defer();
  loadById(taskInstance._id)
    .then(function(taskLoaded){
      _.assign(taskLoaded, taskInstance).save(function(err){
        if (err) {
          deferred.reject(err);
        }else{
          deferred.resolve(taskInstance);
        }
      });
    });

  return deferred.promise;
}

function removeTask(id){
  var deferred = q.defer();

  loadById(id).then(function(taskToRemove){
    taskToRemove.remove(function(err){
      if(err){
        deferred.reject();
      }else{
        deferred.resolve();
      }
    });
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

var task = exports.task = {};

exports.task.create = function create(req, res) {
  createTask(req.body, req.headers['x-user-id'])
  .then(saveTask)
  .then(jsonResponse(res), jsonErrorResponse(res));
};

exports.task.update = function update(req, res) {
  updateTask(req.body)
  .then(jsonResponse(res), jsonErrorResponse(res));
};

exports.task.remove = function remove(req, res) {
  removeTask(req.params.id)
  .then(jsonResponse(res), jsonErrorResponse(res));
};

exports.task.getList = function getList(req, res) {
  res.setHeader('Content-Type','application/json');
  loadTasks({})
    .then(jsonResponse(res));
};

exports.task.getListByUser = function getListByUser(req, res) {
  var userId = req.params.id;
  loadTasks({users_id: userId})
    .then(jsonResponse(res));
};

exports.task.loadById = loadById;