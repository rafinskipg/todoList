'use strict';

//First of all set the enviroment
process.env.NODE_ENV = 'test';

var should = require('chai').should(),
    supertest = require('supertest'),
    q = require('q'),
    userID, badUserID, taskID,
    app = require('../server/app').app,
    api = supertest(app);

/**
 * Utilities
 **/
var createPost = function(userId, cb){
  api.post('/api/task')
    .set('x-user-id', userId)
    .set('x-session-id', 'sessionSessionID')
    .send({ title: 'My task is gutten', type: 'Development', body : 'Tarzan'})
    .end(function(err, res){
      taskID = res.body._id;
      cb();
    });
};

var createMultiplePosts = function(ammount, userId, cb) {
  var async = [];
  for(var i = 0; i < ammount; i++){
    var deferred = q.defer();
    createPost(userId, deferred.resolve);
    async.push(deferred.promise);
  }
  q.all(async).then(function(){
    cb();
  });
};

/*
 * Executed before the tests to get a good & bad users ids.
 */
before(function (done) {
  app.db.connection.on('open', function(){
    api.get('/user')
    .end(function(err, res){
      if(err){
        return done(err);
      }else{
        userID  = res.body[0]._id;
        badUserID  = res.body[1]._id;
        done();
      }
    });
  });
});

/*
 * Clear db after each test
 */
afterEach(function(done) {
  app.db.connection.collections.tasks.remove(function () {
    done();
  });
});

/*
 * Api definition
 */
describe('API Definition', function(){
  it('Returns available methods', function(done) {
    api.get('/')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(res) {
      should.exist(res.body);
    })
    .end(function(err,res) {
      if (err) {
        return done(err);
      }
      res.body.should.have.property('methods');
      done();
    });
  });
});

/*
 * Get all tasks returns array
 */
describe('GET: Return array of tasks', function(){
  it('Returns a json with an array of tasks', function(done) {
    api.get('/api/task')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Array);
      done();
    });
  });
});

/*
 * POST: Creates a new note in the database. 
 * It receives a json with note's title and text on the body 
 * of the request. :id paramenter is empty. 
 * The headers of the request must receive an userId and 
 * sessionId that you need to check for validity before saving 
 * the object to the db. 
 * You need to add the user info to the new note.
 */
describe('POST: Create and list', function(){
  beforeEach(function(done){
    createPost(userID, done);
  });

  it('Returns the object created', function(done) {
    api.post('/api/task')
    .set('x-user-id', userID)
    .set('x-session-id', 'sessionSessionID')
    .send({ title: 'My task is gutten', type: 'Development'})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.have.property('title').and.equal('My task is gutten');
      done();
    });
  });

  it('Show the new object at the list', function(done) {
    api.get('/api/task')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.length.should.be.above(0);
        res.body[0].should.have.property('title').and.equal('My task is gutten');
        res.body[0].should.have.property('body').and.equal('Tarzan');
        done();
      });
  });

  it('Should return forbidden if headers are not present', function(done) {
    api.post('/api/task')
    .send({ title: 'Heidi', body: 'Go go power 403 Rangers'})
    .expect(403)
    .end(function(err) {
      if(err) {
        return done(err);
      }
      done();
    });
  });

  it('Should return forbidden if user id is wrong', function(done) {
    api.post('/api/task')
    .set('x-user-id', 'breakingBad')
    .set('x-session-id', 'sessionSessionID')
    .send({ title: 'Heidi', body: 'Go go power 403 Rangers'})
    .expect(403)
    .end(function(err) {
      if(err) {
        return done(err);
      }
      done();
    });
  });
});

/*
 * PUT: Updates an existant note on the db. 
 * It receives a json with note's title & text on the body of the request, 
 * and the :id of an existant entry on the database. 
 * The headers of the request must receive an userId and sessionId 
 * hat you need to check for validity before saving the object to 
 * the db. The user id should be the same than the user who created 
 * the note.
 */
describe('PUT: edit', function(){
  var taskToEdit;
  beforeEach(function(done){
    api.post('/api/task')
    .set('x-user-id', userID)
    .set('x-session-id', 'sessionSessionID')
    .send({ title: 'EDITABLE', body: 'Ey'})
    .end(function(err, res) {
      if(err) {
        return done(err);
      }
      taskToEdit = res.body;
      done();
    });
  });

  it('Should update if the user id is correct',function (done){
    taskToEdit.title = 'EDITED';
    api.put('/api/task/')
    .set('x-user-id', userID)
    .set('x-session-id', 'sessionSessionID')
    .send(taskToEdit)
    .expect(200)
    .end(function(){
      api.get('/api/task')
      .end(function(err, res) {
        res.body[0].should.have.property('title').and.equal('EDITED');
        done();
      });
    });
  });

  it('Should fail update if userID is from other user', function(done){
    taskToEdit.title = 'EDITED BAD';
    api.put('/api/task/')
    .set('x-user-id', badUserID)
    .set('x-session-id', 'sessionSessionID')
    .send(taskToEdit)
    .expect(403, done);
  });

});

/*
 * DELETE: Deletes an existant note on the database. 
 * It receives an empty request's body and the :id of an 
 * existant entry on the database. The headers of the request 
 * must receive an userId and sessionId that you need to check 
 * for validity before saving the object to the db. 
 * The user id should be the same than the user who created 
 * the note.
 */
describe('DELETE: borrado', function(){
  beforeEach(function(done){
    createMultiplePosts(5, userID, done);
  });
  it('Should delete the node if the userID is correct', function(done){
    api.del('/api/task/'+taskID)
    .set('x-user-id', userID)
    .set('x-session-id', 'sessionSessionID')
    .expect(200).end(function(){
      api.get('/api/task')
      .end(function(err, res) {
        res.body.length.should.equal(4);
        done();
      });
    });

    
  });
  it('Should delete the node if the userID is correct', function(done){
    api.del('/api/task/'+taskID)
    .set('x-user-id', badUserID)
    .set('x-session-id', 'sessionSessionID')
    .expect(200).end(function(){
      api.get('/api/task')
      .end(function(err, res) {
        res.body.length.should.equal(5);
        done();
      });
    });
  });
});

/*
 * GET: Search all the todo notes of the db 
 * and returns an array of the which belongs 
 * to the user with :id as id.
 */
describe('API/USER/:ID: get user tasks', function(){
  beforeEach(function(done){
    createMultiplePosts(5, userID, done);
  });
  it('Should return an array with 5 tasks with a good userID', function(done){
    api.get('/api/user/'+userID)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.length.should.be.equal(5);
      done();
    });
  });

  it('Should return an array with 0 task with a bad userID', function(done){
    api.get('/api/user/'+badUserID)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.length.should.be.equal(0);
      done();
    });
  });
});

/*
 * USER API, is preloaded
 */
describe('User data', function(){
  it('Should return an array of users', function(done){
    api.get('/user')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        res.body.should.be.instanceof(Array);
        res.body.length.should.be.above(0);
        res.body[0].should.have.property('name').and.equal('Pascasio martinez bonilla');
        done();
      });
  });
});
