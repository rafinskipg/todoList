'use strict';

var tasks = require('./controllers/task').task,
    users = require('./controllers/user').user,
    auth = require('./middlewares/auth').auth,
    owns = require('./middlewares/task').owns;
/**
 * Routes, could be divided into more files if needed
 */
module.exports = function(app) {
  app.get('/api/task', tasks.getList);
  app.post('/api/task',  auth, tasks.create);
  app.put('/api/task', auth, owns, tasks.update);
  app.delete('/api/task/:id', auth, owns, tasks.remove);
  
  app.get('/user', users.getList);
  app.get('/user/:id', users.get);
  app.get('/api/user/:id', tasks.getListByUser);

  //greetings
  app.get('/',  function(req,res){
    res.json({
      salute: "What's up? This is the todo list",
      methods: [
        {
          name: '/',
          description: "Returns available methods"
        },
        {
          name: '/user',
          description: "Returns users list"
        },
        {
          name: '/user:id',
          description: "Returns user information"
        },
        {
          name: '/api/user/:id',
          description: "Returns the tasks for a given user"
        },
        {
          name: '/api/task',
          description: "GET all tasks, POST task"
        },
        {
          name: '/api/task/:id',
          description: "PUT task, DELETE task"
        }
      ]
    });
  });
};