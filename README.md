# composer-runtimes [![NPM version](https://img.shields.io/npm/v/composer-runtimes.svg)](https://www.npmjs.com/package/composer-runtimes) [![Build Status](https://img.shields.io/travis/doowb/composer-runtimes.svg)](https://travis-ci.org/doowb/composer-runtimes)

> Write composer task start and end times to a stream.

_HEADS UP_ Api changes in `0.5.0`

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i composer-runtimes --save
```

## Usage

```js
var composer = require('composer');
var runtimes = require('composer-runtimes');
```

## API

### [runtimes](index.js#L27)

Listen to composer events and output runtime information.

**Params**

* `options` **{Object}**: Options to specify color output and stream to write to.
* `options.colors` **{Boolean}**: Show ansi colors or not. `true` by default
* `options.stream` **{Stream}**: Output stream to write to. `process.stderr` by default.
* `options.displayName` **{Function}**: Override how the task name is displayed. [See below][displayName]
* `options.displayTime` **{Function}**: Override how the starting and finished times are displayed. [See below][displayTime]
* `options.displayDuration` **{Function}**: Override how the run duration is displayed. [See below][displayDuration]

**Example**

```js
runtimes({colors: false})(composer);
```

### [displayName](index.js#L91)

Override how the task name is displayed.

**Params**

* `name` **{String}**: Task name
* `options` **{Object}**: Options passed to `runtimes` and extend with application specific options.
* `returns` **{String}**: display name

**Example**

```js
var options = {
  displayName: function(name, opts) {
    // `this` is the entire `task` object
    return 'Task: ' + name;
  }
};

composer.use(runtimes(options));
```

### [displayTime](index.js#L123)

Override how run times are displayed.

**Params**

* `time` **{Date}**: Javascript `Date` object.
* `options` **{Object}**: Options passed to `runtimes` and extend with application specific options.
* `returns` **{String}**: display time

**Example**

```js
var formatTime = require('time-stamp')
var options = {
  displayTime: function(time, opts) {
    // `this` is the entire `run` object
    var formatted = formatTime('HH:mm:ss.ms', time);
    return 'Time: ' + formatted;
  }
};
composer.use(runtimes(options));
```

### [displayDuration](index.js#L162)

Override how duration times are displayed.

**Params**

* `duration` **{Array}**: Array from `process.hrtime()`
* `options` **{Object}**: Options passed to `runtimes` and extend with application specific options.
* `returns` **{String}**: display duration

**Example**

```js
var pretty = require('pretty-time');
var options = {
  displayDuration: function(duration, opts) {
    // `this` is the entire `run` object
    var formatted = pretty(duration, 'μs', 2);
    return 'Duration: ' + formatted;
  }
};

composer.use(runtimes(options));
```

## Related projects

* [composer](https://www.npmjs.com/package/composer): API-first task runner with three methods: task, run and watch. | [homepage](https://github.com/jonschlinkert/composer)
* [composer-errors](https://www.npmjs.com/package/composer-errors): Listen for and output Composer errors. | [homepage](https://github.com/doowb/composer-errors)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/doowb/composer-runtimes/issues/new).

## Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](http://twitter.com/doowb)

## License

Copyright © 2015 [Brian Woodward](https://github.com/doowb)
Released under the MIT license.

***

_This file was generated by [verb](https://github.com/verbose/verb) on December 13, 2015._