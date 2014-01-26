'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Insert mock data into the Users collection
 */
User.find({}).remove(function() {
  User.create({
    name : 'Pascasio martinez bonilla',
    state: 1
  }, {
    name : 'Phillip J. Fry',
    state: 0
  }, function() {
      console.log('Users inserted');
    }
  );
});