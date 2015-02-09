var expect = require('chai').expect,
    BaseTest = require('./Base'),
    MongoVar = require('../lib/Var');

describe('MongoVar Tests', function() {
  var mongoVar = new MongoVar();

  before(function(done) {
    // Initialize test database.
    BaseTest.databaseInit(function() {
      done();
    });
  });

  after(function(done) {
    // Clean up test database.
    BaseTest.databaseCleanup(function() {
      done();
    });
  });

  describe('#get()', function() {
    before(function(done) {
      mongoVar.set('hello', 'world', function(err, val) {
        done();
      });
    });

    it('should get a value of an existing variable.', function(done) {
      mongoVar.get('hello', 'bar', function(err, result) {
        expect(result).to.be.equal('world');
        done();
      });
    });

    it('should get the default value if the variable doesn\'t exist.', function(done) {
      mongoVar.get('foo', 'bar', function(err, result) {
        expect(result).to.be.equal('bar');
        done();
      });
    });
  });

  describe('#set()', function() {
    it('should store a string.', function(done) {
      var value = 'bar';

      getset('fooString', value, function(err, val) {
        expect(val).to.be.equal('bar');
        expect(val).to.be.a('string');
        done();
      });
    });

    it('should store a number.', function(done) {
      var value = 3.14;

      getset('fooNumber', value, function(err, val) {
        expect(val).to.be.equal(value);
        expect(val).to.be.a('number');
        done();
      });
    });

    it('should store an array.', function(done) {
      var value = [1, 2, 'three'];

      getset('fooArray', value, function(err, val) {
        expect(val).to.be.eql(value);
        expect(val).to.be.an('array');
        done();
      });
    });

    it('should store an object.', function(done) {
      var value = {
        foo: 'bar',
        baz: 'bat',
      };

      getset('fooObject', value, function(err, val) {
        expect(val).to.be.eql(value);
        expect(val).to.be.an('object');
        done();
      });
    });

    it('should update an existing variable.', function(done) {
      var value = {
        foo: 'bar',
        baz: 'bat',
      };

      mongoVar.get('fooString', null, function(err, origVal) {
        expect(origVal).to.be.equal('bar');
        expect(origVal).to.be.an('string');

        mongoVar.set('fooString', value, function(err, newVal) {
          expect(newVal).to.be.eql(value);
          expect(newVal).to.be.an('object');
          done();
        });
      });
    });
  });
});

/**
 * Helper to get and set variable.
 *
 * @param string
 *   the name of the variable.
 * @param mixed
 *   the data to be stored.
 * @param function
 *   the callback function to be called upon completion.
 */
function getset(name, value, callback) {
  var mongoVar = new MongoVar();

  // Check that the value doesn't exist.
  mongoVar.get(name, null, function(err, result) {
    expect(result).to.be.null;

    mongoVar.set(name, value, function(err, val) {
      callback(err, val);
    });
  });
}