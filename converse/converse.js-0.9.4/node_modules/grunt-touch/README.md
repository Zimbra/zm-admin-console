# grunt-touch

> Touch files

wraps [node-touch](https://github.com/isaacs/node-touch) as a grunt multi-task.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-touch --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-touch');
```

## The "touch" task

### Overview
In your project's Gruntfile, add a section named `touch` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  touch: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

Options align with https://github.com/isaacs/node-touch#options

#### options.force
Type: `Boolean`
Default value: `false`

like `touch -f`

#### options.time
Type: `Date`
Default value: `new Date()`

like `touch -t <date>` where `<date>` is a Date, parsable Date string or epoch ms numbder

#### options.atime
Type: `Date`
Default value: `null`

like `touch -a`, value may be a Boolean or a Date

#### options.mtime
Type: `Date`
Default value: `null`

like `touch -m`, value may be a Boolean or a Date

#### options.ref
Type: `String`
Default value: `null`

like `touch -r <file>`, where `<file>` is a path to a file

#### options.nocreate
Type: `Boolean`
Default value: `false`

like `touch -c`

### Usage Examples

```js
grunt.initConfig({
  touch: {
    options: {
      force: true,
      mtime: true
    },
    src: ['test'],
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.0 - initial release
