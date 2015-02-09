var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Var data model.
 */
var VarSchema = new Schema({
  name: { type: String, index: true },
  value: {},
});


// Mocha watch workaround to reuse the DB connection.
try {
  module.exports = mongoose.model('mongovar', VarSchema);
} catch (err) {
  module.exports = mongoose.model('mongovar');
}