var mongoose = require('mongoose')
    VarModel = require('./models/Var');

/**
 * Main MongoVar class.
 */
module.exports = function MongoVar(spec) {
  var that = {}

  /**
   *
   *
   * @param string
   *   the name of the variable.
   * @param mixed
   *   a default value to be used if the variable doesn't exist.
   * @param function
   *   the callback function to be called upon completion.
   */
  that.get = function(name, defaultValue, callback) {
    VarModel.findOne({ name: name }, function(err, result) {
      var val;

      if (!result) {
        val = defaultValue;
      } else {
        val = result.value;
      }

      callback(err, val);
    });
  }

  /**
   *
   *
   * @param string
   *   the name of the variable.
   * @param mixed
   *   the data to be stored.
   * @param function
   *   the callback function to be called upon completion.
   */
  that.set = function(name, value, callback) {
    VarModel.findOne({ name: name }, function(err, result) {
      var newVar = new VarModel()

      if (result) {
        newVar = result;
      }

      newVar.set('name', name);
      newVar.set('value', value);
      newVar.save(function(err, newVar) {
        callback(err, newVar.value);
      });
    });
  }

  return that;
}