'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var fs = require('fs');

exports.touch = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default: function(test) {
    test.expect(4);

    test.ok(grunt.file.exists('tmp/custom/123'), 'file should be created');
    test.ok(grunt.file.exists('tmp/custom/456'), 'file should be created');
    test.ok(grunt.file.exists('tmp/default123'), 'file should be created');
    
    var now = new Date();
    fs.stat('tmp/custom/123', function(err, stat) {
      test.ok(now - stat.mtime <= 1000, 'file should have been touched');
      test.done();
    });

  }
};
