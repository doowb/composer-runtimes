/*!
 * composer-runtimes <https://github.com/doowb/composer-runtimes>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

/**
 * Listen to composer events and output runtime information.
 *
 * ```js
 * runtimes({colors: false})(composer);
 * ```
 *
 * @param  {Object} `options` Options to specify color output and stream to write to.
 * @param  {Boolean} `options.colors` Show ansi colors or not. `true` by default
 * @param  {Stream} `options.stream` Output stream to write to. `process.stderr` by default.
 * @param  {Function} `options.displayName` Override how the task name is displayed. [See below][displayName]
 * @param  {Function} `options.displayTime` Override how the starting and finished times are displayed. [See below][displayTime]
 * @param  {Function} `options.displayDuration` Override how the run duration is displayed. [See below][displayDuration]
 * @api public
 */

function runtimes (options) {
  options = options || {};

  return function plugin (app) {
    if (app.runtimes) {
      return;
    }

    app.runtimes = true;
    var opts = utils.extend({}, options, app.options && app.options.runtimes);

    if (typeof opts.colors === 'undefined') {
      opts.colors = true;
    }

    // use the stderr stream by default so other output
    // can be piped into a file with `> file.txt`
    var stream = opts.stream || process.stderr;
    var log = write(stream);

    // setup some listeners
    app.on('starting', function(app, build) {
      log('', displayTime(build, 'start', opts), 'starting', displayName(app, opts), '\n');
    });

    app.on('finished', function(app, build) {
      log('', displayTime(build, 'end', opts), 'finished', displayName(app, opts), displayDuration(build, opts), '\n');
    });

    app.on('task:starting', function (task, run) {
      log('', displayTime(run, 'start', opts), 'starting', displayName(task, opts), '\n');
    });

    app.on('task:finished', function (task, run) {
      log('', displayTime(run, 'end', opts), 'finished', displayName(task, opts), displayDuration(run, opts), '\n');
    });
  };
};

/**
 * Override how the task name is displayed.
 *
 * ```js
 * var options = {
 *   displayName: function(name, opts) {
 *     // `this` is the entire `task` object
 *     return 'Task: ' + name;
 *   }
 * };
 *
 * composer.use(runtimes(options));
 * ```
 *
 * @param  {String} `name` Task name
 * @param  {Object} `options` Options passed to `runtimes` and extend with application specific options.
 * @return {String} display name
 * @api public
 */

function displayName(task, options) {
  options = options || {};
  var name = task.name;
  if (typeof options.displayName === 'function') {
    name = options.displayName.call(task, task.name, options);
  }
  var color = options.colors ? 'cyan' : 'clear';
  return utils[color]((name && name.length) ? name : '');
}

/**
 * Override how the run times are displayed.
 *
 * ```js
 * var formatTime = require('time-stamp')
 * var options = {
 *   displayTime: function(time, opts) {
 *     // `this` is the entire `run` object
 *     var formatted = formatTime('HH:mm:ss.ms', time);
 *     return 'Time: ' + formatted;
 *   }
 * };
 *
 * composer.use(runtimes(options));
 * ```
 *
 * @param  {Date} `time` Javascript `Date` object.
 * @param  {Object} `options` Options passed to `runtimes` and extend with application specific options.
 * @return {String} display time
 * @api public
 */

function displayTime(run, type, options) {
  options = options || {};
  var time = run.date[type];
  var formatted = '';
  if (typeof options.displayTime === 'function') {
    formatted = options.displayTime.call(run, time, options);
  }
  var color = options.colors ? 'grey' : 'clear';
  return utils[color]((formatted && formatted.length) ? formatted : utils.time('HH:mm:ss.ms', time));
}

/**
 * Override how the run duration is displayed.
 *
 * ```js
 * var pretty = require('pretty-time');
 * var options = {
 *   displayDuration: function(duration, opts) {
 *     // `this` is the entire `run` object
 *     var formatted = pretty(duration, 'μs', 2);
 *     return 'Duration: ' + formatted;
 *   }
 * };
 *
 * composer.use(runtimes(options));
 * ```
 *
 * @param  {Array} `duration` Array from `process.hrtime()`
 * @param  {Object} `options` Options passed to `runtimes` and extend with application specific options.
 * @return {String} display duration
 * @api public
 */

function displayDuration(run, options) {
  options = options || {};
  var duration = run.hr.duration;
  var formatted = '';
  if (typeof options.displayDuration === 'function') {
    formatted = options.displayDuration.call(run, duration, options);
  }
  var color = options.colors ? 'magenta' : 'clear';
  return utils[color]((formatted && formatted.length) ? formatted : utils.pretty(duration, 2, 'μs'));
}



/**
 * Write out strings to a stream.
 * @param  {Stream} `stream` Stream to write to (e.g. process.stdout)
 * @return {Function} Function to do the writing.
 */

function write(stream) {
  return function () {
    var len = arguments.length, i = 0;
    var args = new Array(len);
    while (len--) {
      args[i] = arguments[i++];
    }
    stream.write(args.join(' '));
  };
}

/**
 * Exposes `runtimes`
 */

module.exports = runtimes;
