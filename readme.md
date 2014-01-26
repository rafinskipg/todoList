TodoList
=========
API implementation with:

  - [Mocha](http://visionmedia.github.io/mocha/)
  - [SuperTest](https://github.com/visionmedia/supertest)
  - [Chai](http://chaijs.com/)
  - [ExpressJS](http://expressjs.com/)
  - [Mongoose](https://github.com/LearnBoost/mongoose)


API
==========

````
{
  "salute": "What's up? This is the todo list",
  "methods": [
    {
      "name": "/",
      "description": "Returns available methods"
    },
    {
      "name": "/user",
      "description": "Returns users list"
    },
    {
      "name": "/user:id",
      "description": "Returns user information"
    },
    {
      "name": "/api/user/:id",
      "description": "Returns the tasks for a given user"
    },
    {
      "name": "/api/task",
      "description": "GET all tasks, POST task"
    },
    {
      "name": "/api/task/:id",
      "description": "PUT task, DELETE task"
    }
  ]
}
`````

TODO
===========

I haven't implemented session management.



