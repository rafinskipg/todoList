/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    mongoose = require('mongoose');

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

//Config, could be exported to different files and loaded depending on the enviroment
var database = 'todolist';

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}else if('test' === app.get('env')){
  app.use(express.errorHandler());
  database = 'test';
}

// Connect to database
app.db = mongoose.connect('mongodb://localhost/'+ database);

//Preload mongoose models
require('./models/task');
require('./models/user');

//Populate users with demo data
require('./mockUsersData');

//Bind routes
require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports.app = app;
