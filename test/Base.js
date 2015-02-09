var async = require('async'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

function BaseTest() {
  var that = {};

  return that;
}

BaseTest.database = '_mongovar_test';

/**
 * Clears out the test database.
 *
 * @param function
 *   the callback function upon completion.
 */
BaseTest.databaseCleanup = function(callback) {
  console.log('    after() cleanup.');

  var collections = [];
  for (var key in mongoose.connection.collections) {
    collections.push(key);
  }

  async.map(collections, function(collection, innerCallBack) {
    console.log('    Dropping collection: ' + collection);
    mongoose.connection.collections[collection].drop(function(err) {
      innerCallBack();
    });
  }, function(err, results) {
    mongoose.disconnect(function() {
      callback();
    });
  });
}

/**
 * Get the test instance of a Schema.  This is a work-around for MochaJS
 * to initialize a new model or use an existing model instance.
 *
 * @param Schema
 *   a MongooseJS schema definition.
 * @param string
 *   the name of the collection.
 * @return Model
 *   an instance of a MongooseJS Model.
 */
BaseTest.getModelInstance = function(Schema, collection) {
  try {
    return mongoose.model(collection, Schema);
  } catch (err) {
    return mongoose.model(collection);
  }
}

/**
 * Creates a database connection to a test database to be used.
 *
 * @param function
 *   the callback function upon completion.
 */
BaseTest.databaseInit = function(callback) {
  console.log('    before() initialization.');

  // Connect to a test database.
  mongoose.connect('mongodb://127.0.0.1/' + BaseTest.database, function() {
    console.log('    Connected to a test database: ' + BaseTest.database);
    callback();
  });
}

module.exports = BaseTest;