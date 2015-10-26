var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var yaml = require('yaml');
var walkdir = require('walkdir');
var Mustache = require('mustache');
var glob = require('glob');

var lib = path.join(__dirname, './../lib');

var render = function(template, context) {
  return Mustache.to_html(template, context);
}

var loadScripts = function(f) {
  var config = './spec/load.yml';

  if (process.argv.indexOf('--config') !== -1) {
    config = process.argv[process.argv.indexOf('--config') + 1];
  }

  if (process.argv.indexOf('-c') !== -1) {
    config = process.argv[process.argv.indexOf('-c') + 1];
  }

  fs.exists(config, function(exists) {
    if (exists) {
      var sourceFiles = [];

      var loadPaths = fs.readFileSync(config); 

      var scripts = yaml.eval(loadPaths.toString())

      scripts.forEach(function(script) {
        files = glob.sync(path.join(process.cwd(), script))
        sourceFiles = sourceFiles.concat(files);
      });

      f(sourceFiles);
    }
    else {
      f();
    }
  });
}

var loadSpecs = function(f) {
  var dir = process.argv[2] || 'spec';
  specPath = path.join(process.cwd(), dir);

  fs.exists(specPath, function(exists) {
    if (!exists) {
      console.log('Spec directory "' + dir + '" not found');
      return false;
    }

    if (path.extname(specPath) == '.js') {
      f([ specPath ]);
    }
    else {
      var files = walkdir.sync(specPath);
      var specs = files.filter(function(file) {
        return path.extname(file) == '.js';
      });

      f(specs);
    }
  });
}

var runTests = function(runner) {
  var cmds = [
    'phantomjs',
    path.join(lib, 'run_jasmine_test.coffee'),
    runner
  ];

  exec(cmds.join(' '), function(err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    }

    console.log(stdout);
    fs.unlink(runner);
  });
}

var createRunner = function(html) {
  var runner = path.join(process.cwd(), 'runner.html');

  fs.writeFile(runner, html, function() {
    runTests(runner);
  });
}

var loadTemplate = function() {
  var template = path.join(lib, 'runner.template.html');

  fs.readFile(template, function(err, data) {
    loadScripts(function(scripts) {
      loadSpecs(function(specs) {
        var vendor = path.join(__dirname, './../vendor');
        var context = { scripts: scripts, specs: specs, lib: lib, vendor: vendor };
        var html = render(data.toString(), context);

        createRunner(html);
      });
    });
  });
}

module.exports = function() {
  loadTemplate();
}
