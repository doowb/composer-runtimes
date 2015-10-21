/*!
 * composer-runtimes <https://github.com/doowb/composer-runtimes>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');
utils.clear = function(str) {
  return str;
};

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
    app.on('starting', function (task, run) {
      log('', displayTime(run, 'start', opts), 'starting', displayName(task, opts), '\n');
    });

    app.on('finished', function (task, run) {
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
 *     return 'Task: ' + (opts.colors ? cyan(name) : name);
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
  if (typeof options.displayName === 'function') {
    return options.displayName.call(task, task.name, options);
  }
  var color = options.colors ? 'cyan' : 'clear';
  return utils[color](task.name);
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
 *     return 'Time: ' + (opts.colors ? grey(formatted) : formatted);
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
  if (typeof options.displayTime === 'function') {
    return options.displayTime.call(run, run.date[type], options);
  }
  var color = options.colors ? 'grey' : 'clear';
  return utils[color](utils.time('HH:mm:ss.ms', run.date[type]));
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
 *     return 'Duration: ' + (opts.colors ? magenta(formatted) : formatted);
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
  if (typeof options.displayDuration === 'function') {
    return options.displayDuration.call(run, run.hr.duration, options);
  }
  var color = options.colors ? 'magenta' : 'clear';
  return utils[color](utils.pretty(run.hr.duration, 2, 'μs'));
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
