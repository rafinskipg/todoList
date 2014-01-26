
TodoList
=========
API implementation with Mongoose, ExpressJS tested with Mocha & Chai Should


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
