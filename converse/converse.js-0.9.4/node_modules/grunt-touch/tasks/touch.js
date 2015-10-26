/*
 * grunt-touch
 * https://github.com/mapsherpa/grunt-touch
 *
 * Copyright (c) 2013 Paul Spencer
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  
  var touch = require('touch');
  var path = require('path');
  
  grunt.registerMultiTask('touch', 'Touch files.', function() {
    
    var done = this.async();
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      force: false,
      time: new Date(),
      nocreate: false
    });

    // Iterate over all specified file groups.
    grunt.util.async.every(this.files, function(file, next) {
      grunt.util.async.every(file.orig.src, function(f) {
        grunt.verbose.writeln('touching ' + f);
        if (!grunt.file.exists(f)) {
          grunt.file.mkdir(path.dirname(f));
        }
        touch(f, options, function(err) {
          if (err) {
            grunt.log.error('error touching file: ', err);
            return next(false);
          }
          next(true);
        });
      });
    }, done);
  });

};
